import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import { getCustomerById } from "@/actions/customers";
import { CustomerDetailClient } from "@/components/customers/customer-detail-client";

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const customer = await getCustomerById(params.id);

  if (!customer) {
    return <div className="p-6 text-center text-muted-foreground">Customer topilmadi.</div>;
  }

  return <CustomerDetailClient customer={customer} />;
}
