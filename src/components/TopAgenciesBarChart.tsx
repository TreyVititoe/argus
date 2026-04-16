"use client";

import { AgencySummary } from "@/lib/types";
import { formatCurrency } from "@/lib/data-utils";

export default function TopAgenciesBarChart({ agencies }: { agencies: AgencySummary[] }) {
  const top5 = [...agencies].sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 5);
  const max = top5[0]?.totalSpend || 1;

  const shortName = (name: string) => {
    if (name.length < 14) return name;
    const words = name.split(/\s+/).filter(Boolean);
    const initials = words
      .filter((w) => /^[A-Z]/.test(w))
      .slice(0, 4)
      .map((w) => w[0])
      .join("");
    return initials.length >= 2 ? initials : name.slice(0, 12) + "…";
  };

  return (
    <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest p-6 rounded-xl shadow-sm">
      <div className="mb-6">
        <h4 className="text-lg font-headline font-bold text-primary">Spending by Agency</h4>
        <p className="text-xs text-on-surface-variant">Top 5 spending agencies</p>
      </div>
      <div className="flex items-end justify-between h-[200px] pt-4 px-2 gap-4">
        {top5.map((agency) => {
          const pct = (agency.totalSpend / max) * 100;
          return (
            <div key={agency.name} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
              <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                {formatCurrency(agency.totalSpend)}
              </span>
              <div
                className="w-full bg-secondary/20 rounded-t-md relative flex flex-col justify-end"
                style={{ height: `${Math.max(pct, 8)}%` }}
              >
                <div
                  className="w-full bg-secondary rounded-t-md transition-all group-hover:bg-primary-container"
                  style={{ height: "100%" }}
                />
              </div>
              <span
                className="text-[9px] font-bold text-on-surface-variant text-center truncate w-full"
                title={agency.name}
              >
                {shortName(agency.name)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
