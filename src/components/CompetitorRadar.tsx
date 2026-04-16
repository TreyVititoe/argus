"use client";

import { useMemo } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "@/lib/types";

export default function CompetitorRadar({ transactions }: { transactions: Transaction[] }) {
  const data = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of transactions) {
      if (t.competitor) {
        map.set(t.competitor, (map.get(t.competitor) || 0) + t.totalPrice);
      }
    }
    const entries = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    const max = entries[0]?.[1] || 1;
    return entries.slice(0, 6).map(([name, value]) => ({
      name,
      value: Math.round((value / max) * 100),
    }));
  }, [transactions]);

  return (
    <div className="col-span-12 lg:col-span-5 bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm">
      <div className="mb-4">
        <h4 className="text-lg font-headline font-bold text-primary">Competitor Footprint</h4>
        <p className="text-xs text-on-surface-variant">Spend share by product keyword (normalized)</p>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="#c4c6cd" />
            <PolarAngleAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "#44474c", fontWeight: 600 }}
            />
            <Radar
              dataKey="value"
              stroke="#2552ca"
              fill="#2552ca"
              fillOpacity={0.4}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
