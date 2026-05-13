"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon } from "@/components/icons";
import { formatCurrency, formatDate, statusColors, getStatusLabel, cn } from "@/utils";
import type { Order } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface OrdersClientProps {
  initialOrders: any[];
}

export function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [filteredOrders, setFilteredOrders] = useState(initialOrders);

  useEffect(() => {
    let filtered = initialOrders;

    if (searchTerm) {
      filtered = filtered.filter((order) =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, initialOrders]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button className="gap-2 shadow-md">
            <PlusIcon className="w-4 h-4" />
            New Order
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search order # or customer..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background/50 border-none shadow-inner"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border-none bg-background/50 shadow-inner text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="PACKED">Packed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-none shadow-xl overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle>Orders List ({filteredOrders.length})</CardTitle>
          <CardDescription>
            Showing {filteredOrders.length} orders
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left py-4 px-6 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Order</th>
                  <th className="text-left py-4 px-6 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Customer</th>
                  <th className="text-left py-4 px-6 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="text-right py-4 px-6 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Amount</th>
                  <th className="text-center py-4 px-6 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <AnimatePresence mode="popLayout">
                  {filteredOrders.length === 0 ? (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        No orders found matching your criteria.
                      </td>
                    </motion.tr>
                  ) : (
                    filteredOrders.map((order, index) => {
                      const { bg, text } = statusColors(order.status);
                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <span className="font-bold group-hover:text-primary transition-colors">{order.orderNumber}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="font-medium">{order.customer?.firstName} {order.customer?.lastName}</span>
                              <span className="text-xs text-muted-foreground">{order.customer?.phone}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={cn("px-3 py-1 rounded-full text-xs font-bold shadow-sm inline-block", bg, text)}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="py-4 px-6 font-bold text-right">
                            {formatCurrency(order.finalAmount)}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <Link href={`/dashboard/orders/${order.id}`}>
                              <Button variant="ghost" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-all">
                                View Details
                              </Button>
                            </Link>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
