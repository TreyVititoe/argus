"use client";

import { useMemo, useState } from "react";
import { Transaction } from "@/lib/types";
import { summarizeByVendor, formatCurrency } from "@/lib/data-utils";

type SortKey = "name" | "spend" | "share" | "txns";
type SortDir = "asc" | "desc";

export default function CompetitorsTable({ transactions }: { transactions: Transaction[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("spend");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    const vendors = summarizeByVendor(transactions);
    const totalSpend = vendors.reduce((s, v) => s + v.totalSpend, 0);
    return vendors.map((v) => ({
      name: v.name,
      spend: v.totalSpend,
      share: totalSpend > 0 ? (v.totalSpend / totalSpend) * 100 : 0,
      txns: v.transactionCount,
    }));
  }, [transactions]);

  const sorted = useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "spend") cmp = a.spend - b.spend;
      else if (sortKey === "share") cmp = a.share - b.share;
      else cmp = a.txns - b.txns;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [rows, sortKey, sortDir]);

  const maxShare = sorted[0]?.share || 1;

  function setSort(k: SortKey) {
    if (sortKey === k) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(k);
      setSortDir(k === "name" ? "asc" : "desc");
    }
  }

  return (
    <div className="col-span-12 lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-[14px] overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-outline-variant">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant mb-0.5">
          Competitor Landscape
        </div>
        <div className="font-headline font-semibold text-[22px] leading-tight tracking-[-0.015em] text-primary">Spend share by vendor</div>
      </div>

      <div className="overflow-y-auto max-h-[320px]">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-surface-container-lowest border-b border-outline-variant">
            <tr>
              <HeaderCell label="Vendor" active={sortKey === "name"} dir={sortDir} onClick={() => setSort("name")} />
              <HeaderCell label="Spend" align="right" active={sortKey === "spend"} dir={sortDir} onClick={() => setSort("spend")} />
              <HeaderCell label="Share" align="right" active={sortKey === "share"} dir={sortDir} onClick={() => setSort("share")} />
              <HeaderCell label="Txns" align="right" active={sortKey === "txns"} dir={sortDir} onClick={() => setSort("txns")} />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {sorted.map((r) => (
              <tr key={r.name} className="hover:bg-surface-container-low transition-colors">
                <td className="px-4 py-2.5 text-[13px] text-primary font-medium whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${Math.max((r.share / maxShare) * 40, 4)}px`,
                        background: "var(--accent)",
                      }}
                    />
                    {r.name}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-[13px] text-primary text-right font-medium tabular-nums whitespace-nowrap">
                  {formatCurrency(r.spend)}
                </td>
                <td className="px-4 py-2.5 text-[13px] text-on-surface-variant text-right tabular-nums">
                  {r.share.toFixed(1)}%
                </td>
                <td className="px-4 py-2.5 text-[13px] text-on-surface-variant text-right tabular-nums">
                  {r.txns.toLocaleString()}
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[13px] text-on-surface-variant">
                  No competitors in the current filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HeaderCell({
  label,
  align = "left",
  active,
  dir,
  onClick,
}: {
  label: string;
  align?: "left" | "right";
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  return (
    <th
      onClick={onClick}
      className={`px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] cursor-pointer select-none ${
        align === "right" ? "text-right" : "text-left"
      } ${active ? "text-primary" : "text-on-surface-variant hover:text-primary"}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className={`inline-block transition-opacity ${active ? "opacity-100" : "opacity-30"}`}>
          {dir === "asc" ? "▲" : "▼"}
        </span>
      </span>
    </th>
  );
}
