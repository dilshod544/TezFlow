"use server";

// Using manual type to bypass IDE ghost errors; tsc verifies this matches schema
type OrderStatus = "NEW" | "CONTACTED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { revalidatePath } from "next/cache";
import { sendTelegramNotification, formatOrderMessage } from "@/services/telegram";

export async function getOrders() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      customer: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((order: any) => ({
    ...order,
    totalAmount: order.totalAmount.toString(),
    discount: order.discount.toString(),
    tax: order.tax.toString(),
    finalAmount: order.finalAmount.toString(),
    items: order.items.map((item: any) => ({
      ...item,
      unitPrice: item.unitPrice.toString(),
      totalPrice: item.totalPrice.toString(),
    })),
  }));
}

export async function getOrderById(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const order = await prisma.order.findUnique({
    where: { id, userId: session.user.id },
    include: {
      customer: true,
      items: true,
    },
  });

  if (!order) return null;

  return {
    ...order,
    totalAmount: order.totalAmount.toString(),
    discount: order.discount.toString(),
    tax: order.tax.toString(),
    finalAmount: order.finalAmount.toString(),
    items: order.items.map((item: any) => ({
      ...item,
      unitPrice: item.unitPrice.toString(),
      totalPrice: item.totalPrice.toString(),
    })),
  };
}

export async function createOrder(data: {
  customerId: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  discount: number;
  tax: number;
  finalAmount: number;
  items: { productName: string; quantity: number; unitPrice: number; totalPrice: number }[];
  deliveryAddress?: string;
  notes?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      customerId: data.customerId,
      orderNumber: data.orderNumber,
      status: data.status,
      totalAmount: data.totalAmount,
      discount: data.discount,
      tax: data.tax,
      finalAmount: data.finalAmount,
      deliveryAddress: data.deliveryAddress,
      notes: data.notes,
      items: {
        create: data.items,
      },
    },
  });

  // Log analytics
  await prisma.analyticsLog.create({
    data: {
      userId: session.user.id,
      eventType: "order_created",
      eventData: { orderId: order.id, orderNumber: order.orderNumber },
    },
  });

  // Send Telegram Notification
  if (session.user) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { telegramBotToken: true, telegramChatId: true },
    });

    if (user?.telegramBotToken && user?.telegramChatId) {
      const fullOrder = await prisma.order.findUnique({
        where: { id: order.id },
        include: { customer: true, items: true },
      });
      if (fullOrder) {
        const message = formatOrderMessage({
          ...fullOrder,
          finalAmount: fullOrder.finalAmount.toString(),
        });
        await sendTelegramNotification(user.telegramBotToken, user.telegramChatId, message);
      }
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
  
  return order;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const order = await prisma.order.update({
    where: { id, userId: session.user.id },
    data: { status },
  });

  // Log analytics
  await prisma.analyticsLog.create({
    data: {
      userId: session.user.id,
      eventType: "order_status_updated",
      eventData: { orderId: id, status },
    },
  });

  // Send Telegram Notification
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { telegramBotToken: true, telegramChatId: true },
  });

  if (user?.telegramBotToken && user?.telegramChatId) {
    const fullOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: { customer: true, items: true },
    });
    if (fullOrder) {
      const message = formatOrderMessage({
        ...fullOrder,
        finalAmount: fullOrder.finalAmount.toString(),
      });
      await sendTelegramNotification(user.telegramBotToken, user.telegramChatId, message);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
  revalidatePath(`/dashboard/orders/${id}`);

  return order;
}
