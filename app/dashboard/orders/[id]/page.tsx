import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { getOrderById } from "@/actions/orders";
import { redirect } from "next/navigation";
import { OrderDetailClient } from "@/components/orders/order-detail-client";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const order = await getOrderById(params.id);

  if (!order) {
    return <div className="p-6 text-center text-muted-foreground">Order topilmadi.</div>;
  }

  return <OrderDetailClient order={order} />;
}
