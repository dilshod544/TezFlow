"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate, statusColors, getStatusLabel } from "@/utils";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  // Mock data
  const order = {
    id: params.id,
    orderNumber: `ORD-${String(parseInt(params.id)).padStart(3, "0")}`,
    status: "SHIPPED" as const,
    customer: {
      id: "c1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "+1234567890",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    items: [
      { id: "i1", productName: "Product A", quantity: 2, unitPrice: "150", totalPrice: "300" },
      { id: "i2", productName: "Product B", quantity: 1, unitPrice: "200", totalPrice: "200" },
    ],
    totalAmount: "500",
    discount: "0",
    tax: "50",
    finalAmount: "550",
    notes: "Please deliver in the morning",
    createdAt: new Date(),
    deliveredAt: null,
  };

  const { bg, text } = statusColors(order.status);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Update logic
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/orders"
            className="text-primary hover:underline text-sm mb-2 inline-block"
          >
            ← Back to Orders
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{order.orderNumber}</h1>
          <p className="text-muted-foreground mt-1">
            Created on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full font-medium ${bg} ${text}`}>
          {getStatusLabel(order.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="mt-1">{order.customer.firstName} {order.customer.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="mt-1">{order.customer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="mt-1">{order.customer.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">City</label>
                  <p className="mt-1">{order.customer.city}, {order.customer.state}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="mt-1">{order.customer.address}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>
                {order.items.length} item(s) in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.unitPrice)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
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

          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(["NEW", "CONTACTED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={isUpdating}
                  className="w-full text-left px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm"
                >
                  {getStatusLabel(status)}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full" variant="outline">
              Edit Order
            </Button>
            <Button className="w-full" variant="destructive">
              Delete Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
