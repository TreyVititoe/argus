"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/data-utils";

const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

export default function SpendTrendChart({ transactions }: { transactions: Transaction[] }) {
  const data = useMemo(() => {
    const map = new Map<number, number>();
    for (const t of transactions) {
      map.set(t.year, (map.get(t.year) || 0) + t.totalPrice);
    }
    return YEARS.map((y) => ({ year: String(y), spend: map.get(y) || 0 }));
  }, [transactions]);

  return (
    <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-lg font-headline font-bold text-primary">Procurement Spending Trends</h4>
          <p className="text-xs text-on-surface-variant">Aggregated spend across all agencies by year</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span className="text-[10px] font-bold text-primary">Actual spend</span>
          </div>
        </div>
      </div>
      <div className="h-[240px] w-full chart-glow">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2552ca" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#2552ca" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e6eeff" vertical={false} />
            <XAxis
              dataKey="year"
              stroke="#74777d"
              fontSize={11}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#74777d"
              fontSize={11}
              tickFormatter={(v) => formatCurrency(v)}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ stroke: "#2552ca", strokeOpacity: 0.2 }}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0px 12px 40px rgba(13, 28, 47, 0.08)",
              }}
              formatter={(value: unknown) => [formatCurrency(Number(value)), "Spend"]}
            />
            <Area
              type="monotone"
              dataKey="spend"
              stroke="#2552ca"
              strokeWidth={4}
              fill="url(#spendGradient)"
              dot={false}
              activeDot={{ r: 6, fill: "#2552ca" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
