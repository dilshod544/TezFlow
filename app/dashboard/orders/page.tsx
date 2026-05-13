import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { getOrders } from "@/actions/orders";
import { OrdersClient } from "@/components/orders/orders-client";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const orders = await getOrders();

  return <OrdersClient initialOrders={orders} />;
}
