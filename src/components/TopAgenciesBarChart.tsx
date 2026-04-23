"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { AgencySummary } from "@/lib/types";
import { formatCurrency } from "@/lib/data-utils";

function shortName(name: string): string {
  if (name.length <= 22) return name;
  return `${name.slice(0, 20)}…`;
}

export default function TopAgenciesBarChart({ agencies }: { agencies: AgencySummary[] }) {
  const top = [...agencies].sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 8);
  const data = top.map((a) => ({
    name: shortName(a.name),
    fullName: a.name,
    spend: a.totalSpend,
    status: a.contractStatus,
  }));

  return (
    <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-[14px] p-5 md:p-6">
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant mb-0.5">
          Agency Spend
        </div>
        <div className="font-headline text-[22px] leading-tight text-primary">
          Top agencies by contract value
        </div>
        <p className="text-[12px] text-on-surface-variant mt-1">
          {data.length} agencies shown, sorted by total spend
        </p>
      </div>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 32, left: 0, bottom: 4 }}
          >
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.55" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="1" />
              </linearGradient>
            </defs>
            <XAxis
              type="number"
              stroke="oklch(0.55 0.006 85)"
              fontSize={11}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatCurrency(Number(v))}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="oklch(0.36 0.008 85)"
              fontSize={11}
              axisLine={false}
              tickLine={false}
              width={160}
              tick={{ fontWeight: 500 }}
            />
            <Tooltip
              cursor={{ fill: "oklch(0.95 0.02 160 / 0.4)" }}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid oklch(0.91 0.006 85)",
                borderRadius: "10px",
                fontSize: "12px",
                boxShadow: "0 12px 40px oklch(0.20 0.01 85 / 0.08)",
              }}
              formatter={(value: unknown) => [formatCurrency(Number(value)), "Spend"]}
              labelFormatter={(_label, payload) => {
                const full = payload?.[0]?.payload?.fullName;
                return full || "";
              }}
            />
            <Bar dataKey="spend" radius={[0, 6, 6, 0]} animationDuration={600}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.status === "expiring" ? "oklch(0.55 0.14 150)" : "url(#barGrad)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-3 text-[11px] text-on-surface-variant">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "var(--accent)" }} />
          Active / Dormant
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: "oklch(0.55 0.14 150)" }} />
          Renewal window
        </span>
      </div>
    </div>
  );
}
