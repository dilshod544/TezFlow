"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { revalidatePath } from "next/cache";

export async function getCustomers() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const customers = await prisma.customer.findMany({
    where: { userId: session.user.id },
    orderBy: { firstName: "asc" },
  });

  return customers.map((customer) => ({
    ...customer,
    email: customer.email ?? undefined,
    address: customer.address ?? undefined,
    city: customer.city ?? undefined,
    state: customer.state ?? undefined,
    zipCode: customer.zipCode ?? undefined,
    country: customer.country ?? undefined,
    notes: customer.notes ?? undefined,
  }));
}

export async function getCustomerById(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const customer = await prisma.customer.findFirst({
    where: { id, userId: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
    },
  });

  if (!customer) return null;

  return {
    ...customer,
    email: customer.email ?? undefined,
    address: customer.address ?? undefined,
    city: customer.city ?? undefined,
    state: customer.state ?? undefined,
    zipCode: customer.zipCode ?? undefined,
    country: customer.country ?? undefined,
    notes: customer.notes ?? undefined,
    orders: customer.orders.map((order) => ({
      ...order,
      totalAmount: order.totalAmount.toString(),
      discount: order.discount.toString(),
      tax: order.tax.toString(),
      finalAmount: order.finalAmount.toString(),
      deliveryAddress: order.deliveryAddress ?? undefined,
      deliveryCity: order.deliveryCity ?? undefined,
      deliveryState: order.deliveryState ?? undefined,
      deliveryZip: order.deliveryZip ?? undefined,
      notes: order.notes ?? undefined,
      deliveredAt: order.deliveredAt ?? undefined,
      items: order.items.map((item) => ({
        ...item,
        unitPrice: item.unitPrice.toString(),
        totalPrice: item.totalPrice.toString(),
        description: item.description ?? undefined,
      })),
    })),
  };
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

export async function updateCustomer(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    notes?: string;
  }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existingCustomer = await prisma.customer.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existingCustomer) {
    throw new Error("Customer not found or unauthorized");
  }

  const customer = await prisma.customer.update({
    where: { id: existingCustomer.id },
    data,
  });

  revalidatePath("/dashboard/customers");
  return customer;
}

export async function deleteCustomer(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Buyurtmalar bor-yo'qligini tekshir
  const orderCount = await prisma.order.count({
    where: { customerId: id, userId: session.user.id },
  });

  if (orderCount > 0) {
    throw new Error(
      `Bu mijozda ${orderCount} ta buyurtma mavjud. Avval buyurtmalarni o'chiring.`
    );
  }

  const existingCustomer = await prisma.customer.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existingCustomer) {
    throw new Error("Customer not found or unauthorized");
  }

  await prisma.customer.delete({
    where: { id: existingCustomer.id },
  });

  revalidatePath("/dashboard/customers");
}
