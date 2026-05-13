"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { revalidatePath } from "next/cache";

export async function getCustomers() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return await prisma.customer.findMany({
    where: { userId: session.user.id },
    orderBy: { firstName: "asc" },
  });
}

export async function getCustomerById(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return await prisma.customer.findUnique({
    where: { id, userId: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function createCustomer(data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  notes?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const customer = await prisma.customer.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  });

  // Log analytics
  await prisma.analyticsLog.create({
    data: {
      userId: session.user.id,
      eventType: "customer_created",
      eventData: { customerId: customer.id },
    },
  });

  revalidatePath("/dashboard/customers");
  
  return customer;
}
