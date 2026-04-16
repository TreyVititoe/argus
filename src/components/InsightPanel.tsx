"use client";

import { formatCurrency } from "@/lib/data-utils";

interface InsightPanelProps {
  expiringCount: number;
  expiringValue: number;
  onViewAll: () => void;
}

export default function InsightPanel({ expiringCount, expiringValue, onViewAll }: InsightPanelProps) {
  return (
    <div className="col-span-12 lg:col-span-4 bg-primary text-white p-5 md:p-6 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[220px]">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-secondary/10 rounded-full blur-2xl" />
      <div className="relative z-10">
        <span className="text-tertiary-fixed text-[10px] font-bold uppercase border border-tertiary-fixed/30 rounded px-1.5 py-0.5 mb-4 inline-block tracking-wider">
          Renewal Alert
        </span>
        <h4 className="text-xl font-headline font-bold leading-tight mb-2">
          {expiringCount} Expiring Contracts
        </h4>
        <p className="text-on-primary-container text-[13px] leading-relaxed">
          {formatCurrency(expiringValue)} in historical spend is in the renewal window.
          These agencies are prime targets for outreach now.
        </p>
      </div>
      <button
        onClick={onViewAll}
        className="relative z-10 w-full py-3 bg-white text-primary font-bold rounded-lg text-xs hover:bg-surface-container-high transition-colors mt-6 flex items-center justify-center gap-1.5"
      >
        View All Opportunities
        <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
          arrow_forward
        </span>
      </button>
    </div>
  );
}
