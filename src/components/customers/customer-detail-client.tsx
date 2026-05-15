"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatPhoneNumber, getInitials } from "@/utils";
import { motion } from "framer-motion";
import type { Customer, Order } from "@/types";

interface CustomerDetailClientProps {
  customer: Customer & { orders: Order[] };
}

export function CustomerDetailClient({ customer }: CustomerDetailClientProps) {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{customer.firstName} {customer.lastName}</h1>
          <p className="text-muted-foreground mt-1">Customer profile and order history</p>
        </div>
        <Link href="/dashboard/customers">
          <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
            Back to Customers
          </button>
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                {getInitials(`${customer.firstName} ${customer.lastName}`)}
              </div>
              <div>
                <p className="font-semibold">{customer.firstName} {customer.lastName}</p>
                <p className="text-sm text-muted-foreground">Customer ID: {customer.id}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="mt-1">{formatPhoneNumber(customer.phone)}</p>
            </div>
            {customer.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="mt-1">{customer.email}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="mt-1">{customer.address || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="mt-1">{customer.notes || "No notes available."}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {customer.orders.length === 0 ? (
              <p className="text-muted-foreground">No orders found for this customer yet.</p>
            ) : (
              <div className="space-y-3">
                {customer.orders.map((order) => (
                  <Link key={order.id} href={`/dashboard/orders/${order.id}`}>
                    <div className="rounded-xl border border-border p-4 transition hover:border-primary hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold">{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{order.finalAmount}</p>
                          <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
