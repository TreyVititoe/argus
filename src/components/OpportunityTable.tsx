"use client";

import { AgencySummary } from "@/lib/types";
import { formatCurrency, CURRENT_YEAR } from "@/lib/data-utils";

interface OpportunityTableProps {
  agencies: AgencySummary[];
}

function confidenceLevel(opportunityScore: number, maxScore: number) {
  if (maxScore === 0) return { label: "Low (0%)", style: "text-on-error-container bg-error-container/30" };
  const pct = Math.min(Math.round((opportunityScore / maxScore) * 100), 99);
  if (pct >= 75) return { label: `High (${pct}%)`, style: "text-on-tertiary-container bg-on-tertiary-container/10" };
  if (pct >= 40) return { label: `Med (${pct}%)`, style: "text-on-surface-variant bg-surface-container" };
  return { label: `Low (${pct}%)`, style: "text-on-error-container bg-error-container/30" };
}

function statusBadge(status: AgencySummary["contractStatus"]) {
  if (status === "expiring")
    return (
      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-tertiary-fixed-dim/20 text-on-tertiary-container uppercase">
        Renewal
      </span>
    );
  if (status === "active")
    return (
      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-secondary-fixed/50 text-secondary uppercase">
        Active
      </span>
    );
  return (
    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-surface-container-high text-on-surface-variant uppercase">
      Dormant
    </span>
  );
}

function initials(name: string) {
  const words = name.replace(/,.*/, "").split(/\s+/).filter(Boolean);
  const caps = words.filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]);
  return (caps.slice(0, 2).join("") || name.slice(0, 2)).toUpperCase();
}

export default function OpportunityTable({ agencies }: OpportunityTableProps) {
  // Prioritize expiring contracts at the top
  const sorted = [...agencies].sort((a, b) => {
    if (a.contractStatus === "expiring" && b.contractStatus !== "expiring") return -1;
    if (b.contractStatus === "expiring" && a.contractStatus !== "expiring") return 1;
    return b.opportunityScore - a.opportunityScore || b.totalSpend - a.totalSpend;
  });

  const maxScore = Math.max(...sorted.map((a) => a.opportunityScore), 1);
  const maxSpend = Math.max(...sorted.map((a) => a.totalSpend), 1);

  return (
    <div className="col-span-12 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 flex items-center justify-between bg-surface-container-low/30 border-b border-surface-container">
        <div>
          <h4 className="text-lg font-headline font-bold text-primary">Top Opportunities</h4>
          <p className="text-xs text-on-surface-variant">
            Sorted by renewal window + historical spend. Expiring contracts surface first.
          </p>
        </div>
        <button className="text-secondary font-bold text-xs flex items-center gap-1 hover:underline">
          View Detailed Pipeline
          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
            arrow_forward
          </span>
        </button>
      </div>

      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-surface-container-lowest z-10">
            <tr className="text-on-surface-variant text-[9px] font-bold uppercase tracking-widest border-b border-surface-container">
              <th className="px-6 py-3">Agency</th>
              <th className="px-6 py-3">Sector</th>
              <th className="px-6 py-3">Contract Size</th>
              <th className="px-6 py-3">Confidence</th>
              <th className="px-6 py-3">Est. Renewal</th>
              <th className="px-6 py-3">Lead Score</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container/30">
            {sorted.slice(0, 50).map((agency) => {
              const conf = confidenceLevel(agency.opportunityScore, maxScore);
              const leadPct = Math.min((agency.totalSpend / maxSpend) * 100, 100);
              const estRenewal =
                agency.lastPurchaseYear > 0
                  ? Math.max(agency.lastPurchaseYear + 4, CURRENT_YEAR)
                  : CURRENT_YEAR;

              return (
                <tr
                  key={agency.name}
                  className={`transition-colors group ${
                    agency.contractStatus === "expiring"
                      ? "bg-tertiary-fixed-dim/5 hover:bg-tertiary-fixed-dim/10"
                      : "hover:bg-surface"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-surface-container-high flex items-center justify-center font-bold text-primary text-[10px] shrink-0">
                        {initials(agency.name)}
                      </div>
                      <span
                        className="font-bold text-primary text-sm truncate max-w-[280px]"
                        title={agency.name}
                      >
                        {agency.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant whitespace-nowrap">
                    {agency.type || "—"}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-primary whitespace-nowrap">
                    {formatCurrency(agency.totalSpend)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap ${conf.style}`}>
                      {conf.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-on-surface-variant whitespace-nowrap">
                    {estRenewal}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          agency.contractStatus === "expiring" ? "bg-on-tertiary-container" : "bg-secondary"
                        }`}
                        style={{ width: `${leadPct}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">{statusBadge(agency.contractStatus)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 rounded hover:bg-surface-container-high transition-all">
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: "18px" }}>
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
