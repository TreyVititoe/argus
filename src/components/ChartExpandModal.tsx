"use client";

import { useEffect } from "react";
import { formatCurrency, formatFullCurrency } from "@/lib/data-utils";

export interface ChartExpandRow {
  name: string;
  value: number;
}

interface ChartExpandModalProps {
  title: string;
  eyebrow?: string;
  rows: ChartExpandRow[];
  onClose: () => void;
}

export default function ChartExpandModal({ title, eyebrow, rows, onClose }: ChartExpandModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const sorted = [...rows].sort((a, b) => b.value - a.value);
  const total = sorted.reduce((s, r) => s + r.value, 0) || 1;
  const max = sorted[0]?.value || 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chart-expand-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-container-lowest rounded-[14px] w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="px-5 md:px-6 py-4 border-b flex items-start justify-between gap-4" style={{ borderColor: "var(--line)" }}>
          <div className="min-w-0">
            {eyebrow && (
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant mb-0.5">
                {eyebrow}
              </div>
            )}
            <h3 id="chart-expand-title" className="font-headline font-semibold text-[20px] leading-tight tracking-[-0.015em] text-primary">
              {title}
            </h3>
            <p className="text-[12px] text-on-surface-variant mt-1">
              {sorted.length.toLocaleString()} entries · {formatCurrency(total)} total
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary p-1 shrink-0"
            aria-label="Close"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-surface-container-lowest z-10 border-b" style={{ borderColor: "var(--line)" }}>
              <tr className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                <th className="px-4 md:px-6 py-2.5 w-12">#</th>
                <th className="px-4 md:px-6 py-2.5">Name</th>
                <th className="px-4 md:px-6 py-2.5 text-right">Value</th>
                <th className="px-4 md:px-6 py-2.5 text-right hidden sm:table-cell">Share</th>
                <th className="px-4 md:px-6 py-2.5 hidden md:table-cell w-32">Bar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container/30">
              {sorted.map((r, i) => {
                const pct = (r.value / total) * 100;
                const barW = Math.max((r.value / max) * 100, 0.5);
                return (
                  <tr key={r.name + i} className="hover:bg-surface transition-colors">
                    <td className="px-4 md:px-6 py-2.5 text-xs font-bold text-on-surface-variant tabular-nums">
                      {i + 1}
                    </td>
                    <td className="px-4 md:px-6 py-2.5 text-[13px] text-primary">
                      <span className="block truncate max-w-[280px] md:max-w-none" title={r.name}>
                        {r.name}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-2.5 text-[13px] font-bold text-primary text-right tabular-nums whitespace-nowrap" title={formatFullCurrency(r.value)}>
                      {formatCurrency(r.value)}
                    </td>
                    <td className="px-4 md:px-6 py-2.5 text-[12px] text-on-surface-variant text-right tabular-nums hidden sm:table-cell">
                      {pct.toFixed(pct < 1 ? 2 : 1)}%
                    </td>
                    <td className="px-4 md:px-6 py-2.5 hidden md:table-cell">
                      <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                        <div className="h-full" style={{ width: `${barW}%`, background: "var(--accent)" }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
