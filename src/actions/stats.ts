"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { startOfDay, subDays, endOfDay } from "date-fns";

export async function getDashboardStats() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;

  // Basic counts
  const [totalOrders, deliveredOrders, pendingOrders, totalRevenueData] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.order.count({ where: { userId, status: "DELIVERED" } }),
    prisma.order.count({ where: { userId, status: { notIn: ["DELIVERED", "CANCELLED"] } } }),
    prisma.order.aggregate({
      where: { userId, status: { not: "CANCELLED" } },
      _sum: { finalAmount: true },
    }),
  ]);

  const totalRevenue = Number(totalRevenueData._sum.finalAmount || 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Chart data (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      start: startOfDay(date),
      end: endOfDay(date),
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
    };
  }).reverse();

  const chartData = await Promise.all(
    last7Days.map(async (day) => {
      const dayStats = await prisma.order.aggregate({
        where: {
          userId,
          createdAt: { gte: day.start, lte: day.end },
          status: { not: "CANCELLED" },
        },
        _sum: { finalAmount: true },
        _count: { id: true },
      });

      return {
        name: day.label,
        revenue: Number(dayStats._sum.finalAmount || 0),
        orders: dayStats._count.id,
      };
    })
  );

  const statusCounts = await prisma.order.groupBy({
    by: ["status"],
    where: { userId, status: { not: "CANCELLED" } },
    _count: { status: true },
  });

  const topCustomers = await prisma.customer.findMany({
    where: { userId },
    include: {
      orders: {
        where: { status: { not: "CANCELLED" } },
      },
    },
    orderBy: {
      orders: {
        _count: "desc",
      },
    },
    take: 5,
  });

  return {
    stats: {
      totalOrders,
      deliveredOrders,
      pendingOrders,
      totalRevenue,
      averageOrderValue,
    },
    chartData,
    statusCounts: statusCounts.map((item) => ({
      status: item.status,
      count: item._count.status,
    })),
    topCustomers: topCustomers.map((customer) => ({
      id: customer.id,
      name: `${customer.firstName} ${customer.lastName}`,
      orders: customer.orders.length,
    })),
  };
}

export async function getAnalyticsOverview() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id;
  const dashboard = await getDashboardStats();

  const totalCustomers = await prisma.customer.count({ where: { userId } });
  const pendingOrders = await prisma.order.count({
    where: { userId, status: { in: ["PENDING", "PROCESSING"] } },
  });
  const monthlyRevenue = await prisma.order.aggregate({
    where: {
      userId,
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
      status: { not: "CANCELLED" },
    },
    _sum: { finalAmount: true },
  });

  return {
    ...dashboard,
    totalCustomers,
    pendingOrders,
    monthlyRevenue: Number(monthlyRevenue._sum.finalAmount || 0),
  };
}
