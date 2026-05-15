import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import { NewCustomerPage } from "@/components/customers/new-customer-page";

export default async function NewCustomerPageRoute() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <NewCustomerPage />;
}
