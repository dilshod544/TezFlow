"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface SalesData {
  date: string;
  total: number;
}

interface SalesChartProps {
  data: SalesData[];
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Haftalik Sotuvlar Dinamikasi</h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value) => {
              if (typeof value === 'number') {
                return [`$${value.toFixed(2)}`, "Sotuv"];
              }
              return [`$0.00`, "Sotuv"];
            }}
            labelFormatter={(label) => `Sana: ${new Date(label).toLocaleDateString()}`}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}