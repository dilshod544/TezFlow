"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return await prisma.product.findMany({
    where: { userId: session.user.id, isActive: true },
    orderBy: { name: "asc" },
  });
}

export async function getAllProducts() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return await prisma.product.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  unit?: string;
  imageUrl?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const product = await prisma.product.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  });

  await prisma.analyticsLog.create({
    data: {
      userId: session.user.id,
      eventType: "product_created",
      eventData: { productId: product.id, name: product.name },
    },
  });

  revalidatePath("/dashboard/products");
  return product;
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    unit?: string;
    imageUrl?: string;
    isActive?: boolean;
  }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const product = await prisma.product.update({
    where: { id, userId: session.user.id },
    data,
  });

  revalidatePath("/dashboard/products");
  return product;
}

export async function deleteProduct(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Soft delete — mahsulotni o'chirmay faolsizlashtir
  const product = await prisma.product.update({
    where: { id, userId: session.user.id },
    data: { isActive: false },
  });

  revalidatePath("/dashboard/products");
  return product;
}

export async function updateStock(
  id: string,
  quantity: number,
  type: "add" | "subtract"
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const product = await prisma.product.findUnique({
    where: { id, userId: session.user.id },
  });
  if (!product) throw new Error("Product not found");

  const newStock =
    type === "add"
      ? product.stock + quantity
      : Math.max(0, product.stock - quantity);

  const updated = await prisma.product.update({
    where: { id },
    data: { stock: newStock },
  });

  revalidatePath("/dashboard/products");
  return updated;
}
