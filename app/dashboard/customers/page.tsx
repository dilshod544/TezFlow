import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { getCustomers } from "@/actions/customers";
import { CustomersClient } from "@/components/customers/customers-client";
import { redirect } from "next/navigation";

export default async function CustomersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const customers = await getCustomers();

  return <CustomersClient initialCustomers={customers} />;
}
