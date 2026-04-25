"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/data-utils";

interface ShareDonutRow {
  name: string;
  value: number;
}

interface ShareDonutProps {
  eyebrow: string;
  title: string;
  rows: ShareDonutRow[];
  colors: string[];
}

export default function ShareDonut({ eyebrow, title, rows, colors }: ShareDonutProps) {
  const sorted = [...rows].sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, 5);
  const otherSum = sorted.slice(5).reduce((s, r) => s + r.value, 0);
  const data = otherSum > 0 ? [...top, { name: "Other", value: otherSum }] : top;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const leader = data[0];

  return (
    <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-[14px] p-5 md:p-6">
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant mb-0.5">
          {eyebrow}
        </div>
        <div className="font-headline font-semibold text-[22px] leading-tight tracking-[-0.015em] text-primary">
          {title}
        </div>
      </div>

      <div className="flex items-center gap-5 flex-wrap">
        <div className="relative shrink-0" style={{ width: 200, height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={92}
                paddingAngle={1.5}
                dataKey="value"
                stroke="none"
                isAnimationActive
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid oklch(0.91 0.006 85)",
                  borderRadius: "10px",
                  fontSize: "12px",
                  boxShadow: "0 12px 40px oklch(0.20 0.01 85 / 0.08)",
                }}
                formatter={(v: unknown, _name, item) => [
                  `${formatCurrency(Number(v))} (${(((item.payload as ShareDonutRow).value / total) * 100).toFixed(1)}%)`,
                  (item.payload as ShareDonutRow).name,
                ]}
                separator=" — "
              />
            </PieChart>
          </ResponsiveContainer>
          {leader && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                Leader
              </div>
              <div className="font-bold text-primary text-[15px] leading-tight mt-0.5 truncate max-w-[120px]">
                {leader.name}
              </div>
              <div className="text-[12px] text-on-surface-variant mt-0.5 tabular-nums">
                {((leader.value / total) * 100).toFixed(0)}% · {formatCurrency(leader.value)}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-[160px] space-y-1.5">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2 text-[13px]">
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                style={{ background: colors[i % colors.length] }}
                aria-hidden
              />
              <span className="text-primary truncate flex-1" title={d.name}>
                {d.name}
              </span>
              <span className="text-on-surface-variant tabular-nums">
                {((d.value / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
