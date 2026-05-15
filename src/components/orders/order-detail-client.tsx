"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate, statusColors, getStatusLabel } from "@/utils";
import type { Order } from "@/types";
import { Loader2 } from "lucide-react";

interface OrderDetailClientProps {
  order: Order;
}

const statusOptions: Array<Order["status"]> = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export function OrderDetailClient({ order }: OrderDetailClientProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState<Order["status"]>(order.status);
  const [message, setMessage] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: Order["status"]) => {
    if (newStatus === status) return;
    setIsUpdating(true);
    setMessage(null);

    try {
      const response = await fetch("/api/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      setStatus(newStatus);
      setMessage("Status yangilandi");
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("Status yangilanishi muvaffaqiyatsiz bo‘ldi");
    } finally {
      setIsUpdating(false);
    }
  };

  const { bg, text } = statusColors(status);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/orders" className="text-primary hover:underline text-sm mb-2 inline-block">
            ← Back to Orders
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{order.orderNumber}</h1>
          <p className="text-muted-foreground mt-1">Created on {formatDate(order.createdAt)}</p>
        </div>
        <div className={`px-4 py-2 rounded-full font-medium ${bg} ${text}`}>{getStatusLabel(status)}</div>
      </div>

      {message && (
        <div className="rounded-xl border border-border bg-background p-4 text-sm text-foreground">{message}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="mt-1">{order.customer?.firstName} {order.customer?.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="mt-1">{order.customer?.email || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="mt-1">{order.customer?.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">City</label>
                  <p className="mt-1">{order.customer?.city || "—"}, {order.customer?.state || "—"}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="mt-1">{order.deliveryAddress || order.customer?.address || "—"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>{order.items.length} item(s) in this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(item.unitPrice)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(order.finalAmount)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {statusOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleStatusChange(option)}
                  disabled={isUpdating}
                  className="w-full text-left px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
                >
                  {getStatusLabel(option)}
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button className="w-full" variant="outline" onClick={() => router.back()}>
              Edit Order
            </Button>
            <Button className="w-full" variant="destructive" onClick={() => alert("Delete order functionality not enabled yet.")}> 
              Delete Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
