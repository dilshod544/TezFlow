"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TopCustomer {
  id: string;
  name: string;
  orders: number;
}

interface AnalyticsData {
  chartData: Array<{ name: string; revenue: number; orders: number }>;
  statusCounts: Array<{ status: string; count: number }>;
  topCustomers: TopCustomer[];
  totalCustomers: number;
  monthlyRevenue: number;
  pendingOrders: number;
  stats: {
    totalOrders: number;
    deliveredOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
}

const statusColors = {
  PENDING: "#8b5cf6",
  PROCESSING: "#7c3aed",
  SHIPPED: "#fb923c",
  DELIVERED: "#10b981",
  CANCELLED: "#ef4444",
};

export function AnalyticsClient({ data }: { data: AnalyticsData }) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Comprehensive insights into your sales performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">Active profiles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.pendingOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Needs follow-up</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Conversion Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.deliveredOrders}/{data.stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">Delivered orders</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2 pr-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#ef4444" name="Revenue" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>Current order pipeline</CardDescription>
          </CardHeader>
          <CardContent className="pl-2 pr-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.statusCounts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={90}
                  dataKey="count"
                >
                  {data.statusCounts.map((entry) => (
                    <Cell key={entry.status} fill={statusColors[entry.status as keyof typeof statusColors] || "#64748b"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>Most active buyers this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">Orders: {customer.orders}</p>
                  </div>
                  <div className="text-sm font-semibold text-primary">{customer.orders}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Snapshot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="rounded-xl border border-border p-4">
                <p className="text-sm text-muted-foreground">Average order value</p>
                <p className="text-2xl font-bold">${data.stats.averageOrderValue.toFixed(2)}</p>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="text-sm text-muted-foreground">Total revenue</p>
                <p className="text-2xl font-bold">${data.stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="rounded-xl border border-border p-4">
                <p className="text-sm text-muted-foreground">Delivered orders</p>
                <p className="text-2xl font-bold">{data.stats.deliveredOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
