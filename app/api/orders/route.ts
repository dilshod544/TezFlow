import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const status = searchParams.get("status");
    const minAmount = searchParams.get("minAmount");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {
      userId: session.user.id,
      isDeleted: false,
    };

    if (startDate) {
      where.createdAt = { ...where.createdAt, gte: new Date(startDate) };
    }
    if (endDate) {
      where.createdAt = { ...where.createdAt, lte: new Date(endDate) };
    }
    if (status) {
      where.status = status;
    }
    if (minAmount) {
      where.finalAmount = { gte: parseFloat(minAmount) };
    }

    const [orders, totalCount, totalSales] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: true,
          items: true,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.order.count({ where }),
      prisma.order.aggregate({
        where,
        _sum: { finalAmount: true },
      }),
    ]);

    return NextResponse.json({
      orders,
      totalCount,
      totalSales: totalSales._sum.finalAmount || 0,
    });
  } catch (error) {
    console.error("Orders API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}