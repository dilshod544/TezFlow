import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/actions/orders";

export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (typeof id !== "string" || typeof status !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await updateOrderStatus(id, status as any);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json({ error: "Could not update order status" }, { status: 500 });
  }
}
