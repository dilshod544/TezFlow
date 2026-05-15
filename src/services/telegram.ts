import axios from "axios";

export async function sendTelegramNotification(
  botToken: string,
  chatId: string,
  message: string
) {
  if (!botToken || !chatId) {
    console.warn("Telegram bot token or chat ID is missing. Notification not sent.");
    return;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    });
    return true;
  } catch (error) {
    console.error("Error sending Telegram notification:", error);
    return false;
  }
}

export function formatOrderMessage(order: any) {
  const statusLabels: Record<string, string> = {
    PENDING: "⏳ Pending",
    PROCESSING: "🔄 Processing",
    SHIPPED: "🚚 Shipped",
    DELIVERED: "✅ Delivered",
    CANCELLED: "❌ Cancelled",
  };

  const status = statusLabels[order.status] || order.status;

  return `
<b>Yangi Buyurtma: ${order.orderNumber}</b>
---------------------------
<b>Status:</b> ${status}
<b>Jami Summa:</b> $${order.finalAmount}

<b>Mijoz:</b> ${order.customer?.firstName} ${order.customer?.lastName}
<b>Telefon:</b> ${order.customer?.phone}

<b>Mahsulotlar:</b>
${order.items?.map((item: any) => `- ${item.productName} (x${item.quantity})`).join("\n")}
  `.trim();
}
