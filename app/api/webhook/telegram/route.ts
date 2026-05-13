import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { sendTelegramNotification } from "@/services/telegram";

/**
 * TELEGRAM WEBHOOK HANDLER
 * This endpoint receives messages from your Telegram Bot.
 * It automatically parses order information and saves it to the database.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 1. Basic Telegram Message Info
    const message = body.message || body.channel_post;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const text = message.text;
    const chatId = message.chat.id.toString();
    const telegramUser = message.from;

    // 2. Identify which CRM User this bot belongs to
    // We check the bot token from the URL or headers if you set it up that way
    // For now, let's look for a user who has this ChatId or we can use a specific secret
    // Better: Find user by telegramChatId (if it's the admin's chat)
    const user = await prisma.user.findFirst({
      where: {
        telegramChatId: chatId,
      },
    });

    if (!user) {
      console.log("No user found for chat ID:", chatId);
      return NextResponse.json({ ok: true });
    }

    // 3. Simple Order Parsing Logic
    // Expected format example: "Order: iPhone 15, Qty: 1, Name: John, Phone: +998901234567, Address: Tashkent"
    if (text.toLowerCase().startsWith("order:") || text.toLowerCase().startsWith("buy:")) {
      const parts = text.split(",").map((p: string) => p.trim());
      
      let productName = "Unknown Product";
      let quantity = 1;
      let customerName = telegramUser?.first_name || "Telegram User";
      let phone = "";
      let address = "Telegram Order";

      parts.forEach((part: string) => {
        if (part.toLowerCase().includes("order:") || part.toLowerCase().includes("buy:")) {
          productName = part.split(":")[1]?.trim() || productName;
        } else if (part.toLowerCase().includes("qty:")) {
          quantity = parseInt(part.split(":")[1]?.trim()) || 1;
        } else if (part.toLowerCase().includes("name:")) {
          customerName = part.split(":")[1]?.trim() || customerName;
        } else if (part.toLowerCase().includes("phone:")) {
          phone = part.split(":")[1]?.trim() || "";
        } else if (part.toLowerCase().includes("address:")) {
          address = part.split(":")[1]?.trim() || address;
        }
      });

      if (!phone) {
        // If no phone, we might not be able to create a proper customer
        // But for demo, let's use the Telegram username
        phone = telegramUser?.username || chatId;
      }

      // 4. Create or Update Customer
      const customer = await prisma.customer.upsert({
        where: {
          userId_phone: {
            userId: user.id,
            phone: phone,
          },
        },
        update: {
          firstName: customerName.split(" ")[0],
          lastName: customerName.split(" ")[1] || "",
          address: address,
        },
        create: {
          userId: user.id,
          firstName: customerName.split(" ")[0],
          lastName: customerName.split(" ")[1] || "",
          phone: phone,
          address: address,
        },
      });

      // 5. Create the Order — narxni mahsulotlar katalogidan qidir
      const orderNumber = `AUTO-${Math.floor(1000 + Math.random() * 9000)}`;

      // Mahsulot nomiga qarab bazadan narx qidir
      const product = await prisma.product.findFirst({
        where: {
          userId: user.id,
          name: { contains: productName, mode: "insensitive" },
          isActive: true,
        },
      });
      const unitPrice = product ? Number(product.price) : 0;
      const totalAmount = unitPrice * quantity;

      const order = await prisma.order.create({
        data: {
          userId: user.id,
          customerId: customer.id,
          orderNumber: orderNumber,
          status: "NEW",
          totalAmount: totalAmount,
          discount: 0,
          tax: 0,
          finalAmount: totalAmount,
          deliveryAddress: address,
          notes: `Automatic order from Telegram Bot. Text: ${text}`,
          items: {
            create: [
              {
                productId: product?.id || undefined,
                productName: productName,
                quantity: quantity,
                unitPrice: unitPrice,
                totalPrice: totalAmount,
              },
            ],
          },
        },
      });

      // 6. Send confirmation back to Admin/User via Telegram
      if (user.telegramBotToken && user.telegramChatId) {
        const appUrl = process.env.NEXTAUTH_URL || process.env.APP_URL || "http://localhost:3000";
        const orderUrl = `${appUrl}/dashboard/orders/${order.id}`;
        const confirmMsg = `✅ *New Automatic Order!*\n\n📦 *Order:* ${orderNumber}\n👤 *Customer:* ${customerName}\n📱 *Phone:* ${phone}\n📍 *Address:* ${address}\n🛍 *Item:* ${productName} (x${quantity})\n💰 *Total:* ${totalAmount.toLocaleString()} so'm\n\nView it in TezFlow: ${orderUrl}`;
        await sendTelegramNotification(user.telegramBotToken, user.telegramChatId, confirmMsg);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram Webhook Error:", error);
    return NextResponse.json({ ok: false, error: "Internal Error" }, { status: 500 });
  }
}
