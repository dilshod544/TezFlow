"use client";

import Link from "next/link";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@/components/icons";
import { formatCurrency, formatDate, statusColors, getStatusLabel, cn } from "@/utils";
import type { DashboardStats, Order } from "@/types";
import { motion } from "framer-motion";

interface DashboardContentProps {
  stats: DashboardStats;
  chartData: any[];
  recentOrders: any[];
  userName: string;
}

export function DashboardContent({ stats, chartData, recentOrders, userName }: DashboardContentProps) {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent"
          >
            Dashboard
          </motion.h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {userName}! Here's what's happening with your sales.
          </p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button className="gap-2 shadow-lg hover:shadow-primary/20 transition-all">
            <PlusIcon className="w-4 h-4" />
            New Order
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Total Orders" value={stats.totalOrders} trend="+12% from last month" />
        <StatsCard title="Delivered" value={stats.deliveredOrders} subtitle={`${((stats.deliveredOrders / (stats.totalOrders || 1)) * 100).toFixed(1)}% success rate`} color="text-green-600" />
        <StatsCard title="Pending" value={stats.pendingOrders} subtitle="Requires attention" color="text-orange-600" />
        <StatsCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} trend="+8% from last week" />
        <StatsCard title="Avg Order Value" value={formatCurrency(stats.averageOrderValue)} subtitle="Per order" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue & Orders" description="Last 7 days performance">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                cursor={{ fill: '#f1f5f9' }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#ef4444" radius={[4, 4, 0, 0]} name="Revenue ($)" />
              <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue Trend" description="Weekly revenue progression">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#ef4444"
                name="Revenue ($)"
                strokeWidth={3}
                dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Orders */}
      <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-b from-card to-slate-50/50 dark:to-slate-900/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest {recentOrders.length} orders from your store
              </CardDescription>
            </div>
            <Link href="/dashboard/orders">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No orders yet. Start by creating your first order!
              </div>
            ) : (
              recentOrders.map((order, index) => {
                const { bg, text } = statusColors(order.status);
                return (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={order.id}
                  >
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/20 transition-all group"
                    >
                      <div className="flex-1">
                        <p className="font-bold group-hover:text-primary transition-colors">{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right mr-8">
                        <p className="font-bold">{formatCurrency(order.finalAmount)}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.items?.length || 0} items
                        </p>
                      </div>
                      <div className={cn("px-4 py-1 rounded-full text-xs font-semibold shadow-sm", bg, text)}>
                        {getStatusLabel(order.status)}
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({ title, value, trend, subtitle, color }: { title: string; value: string | number; trend?: string; subtitle?: string; color?: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-black", color)}>{value}</div>
          {trend && (
            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
              {trend}
            </p>
          )}
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ChartCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pl-2 pr-2">
        {children}
      </CardContent>
    </Card>
  );
}
