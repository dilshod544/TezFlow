import { getAllProducts } from "@/actions/products";
import { ProductsClient } from "@/components/products/products-client";

export default async function ProductsPage() {
  const products = await getAllProducts();

  // Prisma Decimal → string (Client Component serialization uchun)
  const serialized = products.map((p) => ({
    ...p,
    price: p.price.toString(),
  }));

  return <ProductsClient initialProducts={serialized} />;
}
