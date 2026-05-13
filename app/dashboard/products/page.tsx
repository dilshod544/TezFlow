import { getAllProducts } from "@/actions/products";
import { ProductsClient } from "@/components/products/products-client";

export default async function ProductsPage() {
  const products = await getAllProducts();
  return <ProductsClient initialProducts={products} />;
}
