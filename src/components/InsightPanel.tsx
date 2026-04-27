"use client";

import { formatCurrency } from "@/lib/data-utils";

interface InsightPanelProps {
  expiringCount: number;
  expiringValue: number;
  onViewAll: () => void;
}

export default function InsightPanel({ expiringCount, expiringValue, onViewAll }: InsightPanelProps) {
  return (
    <div className="col-span-12 lg:col-span-4 rounded-[14px] p-6 flex flex-col min-h-[220px]" style={{ background: "var(--alert)", color: "var(--alert-ink)" }}>
      <span className="inline-flex self-start px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] mb-4" style={{ background: "var(--accent-soft)", color: "oklch(0.30 0.12 160)" }}>
        Renewal Alert
      </span>
      <h4 className="font-headline font-bold leading-[1.08] tracking-[-0.02em] mb-3 text-primary" style={{ fontSize: "28px" }}>
        {expiringCount} contracts<br />expiring soon
      </h4>
      <p className="text-[14px] leading-relaxed mb-5" style={{ color: "var(--ink-2)" }}>
        {formatCurrency(expiringValue)} in historical spend is in the renewal window.
        These agencies are prime targets for outreach now.
      </p>
      <button
        onClick={onViewAll}
        className="mt-auto w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-[10px] text-white text-[14px] font-bold transition-transform hover:-translate-y-0.5"
        style={{ background: "oklch(0.50 0.10 160)" }}
      >
        View all opportunities →
      </button>
    </div>
  );
}
