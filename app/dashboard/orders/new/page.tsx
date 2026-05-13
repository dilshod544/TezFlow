import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { getCustomers } from "@/actions/customers";
import { NewOrderForm } from "@/components/orders/new-order-form";
import { redirect } from "next/navigation";

export default async function NewOrderPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const customers = await getCustomers();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Create New Order</h1>
      <NewOrderForm customers={customers} />
    </div>
  );
}
