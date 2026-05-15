import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import { NewProductPage } from "@/components/products/new-product-page";

export default async function NewProductPageRoute() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <NewProductPage />;
}
