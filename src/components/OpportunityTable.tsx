"use client";

import { useState, forwardRef, useMemo } from "react";
import { useClearFilters } from "@/lib/use-clear-filters";
import { AgencySummary, ContractStatus, Transaction } from "@/lib/types";
import { formatCurrency, CURRENT_YEAR } from "@/lib/data-utils";
import ExportButton from "./ExportButton";

type FilterMode = "all" | "expiring" | "active" | "dormant";

interface OpportunityTableProps {
  agencies: AgencySummary[];
  transactions: Transaction[];
  filter: FilterMode;
  onFilterChange: (f: FilterMode) => void;
}

function statusBadge(status: ContractStatus) {
  if (status === "expiring")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-tertiary-fixed-dim/20 text-on-tertiary-container uppercase whitespace-nowrap">
        <span className="h-1.5 w-1.5 rounded-full bg-on-tertiary-container animate-pulse" />
        Renewal
      </span>
    );
  if (status === "active")
    return (
      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-secondary-fixed/50 text-secondary uppercase whitespace-nowrap">
        Active
      </span>
    );
  return (
    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-surface-container-high text-on-surface-variant uppercase whitespace-nowrap">
      Dormant
    </span>
  );
}

function initials(name: string) {
  const words = name.replace(/,.*/, "").split(/\s+/).filter(Boolean);
  const caps = words.filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]);
  return (caps.slice(0, 2).join("") || name.slice(0, 2)).toUpperCase();
}

const FILTERS: { mode: FilterMode; label: string }[] = [
  { mode: "all", label: "All" },
  { mode: "expiring", label: "Renewal Window" },
  { mode: "active", label: "Active" },
  { mode: "dormant", label: "Dormant" },
];

const OpportunityTable = forwardRef<HTMLDivElement, OpportunityTableProps>(function OpportunityTable(
  { agencies, transactions, filter, onFilterChange },
  ref
) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<"default" | "name" | "type" | "spend" | "score" | "renewal" | "status">("default");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let result = [...agencies];
    if (filter !== "all") {
      result = result.filter((a) => a.contractStatus === filter);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.type || "").toLowerCase().includes(q) ||
          (a.topCompany || "").toLowerCase().includes(q) ||
          a.topKeywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    if (sortKey === "default") {
      result.sort((a, b) => {
        if (filter === "all") {
          if (a.contractStatus === "expiring" && b.contractStatus !== "expiring") return -1;
          if (b.contractStatus === "expiring" && a.contractStatus !== "expiring") return 1;
        }
        return b.opportunityScore - a.opportunityScore || b.totalSpend - a.totalSpend;
      });
    } else {
      result.sort((a, b) => {
        let cmp = 0;
        if (sortKey === "name") cmp = a.name.localeCompare(b.name);
        else if (sortKey === "type") cmp = (a.type || "").localeCompare(b.type || "");
        else if (sortKey === "spend") cmp = a.totalSpend - b.totalSpend;
        else if (sortKey === "score") cmp = a.opportunityScore - b.opportunityScore;
        else if (sortKey === "renewal") cmp = a.lastPurchaseYear - b.lastPurchaseYear;
        else if (sortKey === "status") cmp = a.contractStatus.localeCompare(b.contractStatus);
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return result;
  }, [agencies, filter, query, sortKey, sortDir]);

  function setSort(key: "name" | "type" | "spend" | "score" | "renewal" | "status") {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "name" || key === "type" ? "asc" : "desc");
    }
  }

  useClearFilters(() => {
    setExpanded(null);
    setShowAll(false);
    setQuery("");
    setSortKey("default");
    setSortDir("desc");
  });

  const counts = useMemo(() => {
    const c = { all: agencies.length, expiring: 0, active: 0, dormant: 0 };
    for (const a of agencies) c[a.contractStatus]++;
    return c;
  }, [agencies]);

  // Export should match what the user is actually looking at — narrow the
  // transactions to those whose agency is in the currently filtered set.
  const exportTransactions = useMemo(() => {
    const names = new Set(filtered.map((a) => a.name));
    return transactions.filter((t) => names.has(t.agency));
  }, [filtered, transactions]);

  const maxSpend = Math.max(...filtered.map((a) => a.totalSpend), 1);

  const displayed = showAll ? filtered : filtered.slice(0, 50);
  const hasMore = filtered.length > 50;

  return (
    <div
      ref={ref}
      id="opportunities"
      className="col-span-12 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden scroll-mt-20"
    >
      <div className="px-4 md:px-6 py-4 bg-surface-container-low/30 border-b border-surface-container gap-3 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h4 className="text-base md:text-lg font-headline font-semibold text-primary">Top Opportunities</h4>
          <p className="text-[11px] md:text-xs text-on-surface-variant">
            {filter === "expiring"
              ? `${filtered.length} agencies in the renewal window — prime targets for outreach`
              : filter === "active"
              ? `${filtered.length} active accounts`
              : filter === "dormant"
              ? `${filtered.length} dormant accounts (may need re-engagement)`
              : "Expiring contracts surface first, then by opportunity score"}
          </p>
        </div>

        <div className="relative w-full lg:w-72 shrink-0">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search agencies, resellers, products…"
            className="w-full pl-9 pr-3 py-2 text-[13px] rounded-full border border-outline-variant bg-surface-container-lowest text-primary placeholder:text-on-surface-variant outline-none focus:border-[var(--accent-soft)] focus:shadow-[0_0_0_4px_var(--accent-bg)]"
          />
        </div>

        <ExportButton transactions={exportTransactions} />

        {/* Filter pills */}
        <div className="flex items-center gap-1 overflow-x-auto shrink-0">
          {FILTERS.map((f) => (
            <button
              key={f.mode}
              onClick={() => onFilterChange(f.mode)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                filter === f.mode
                  ? f.mode === "expiring"
                    ? "bg-on-tertiary-container text-white"
                    : "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {f.label}
              <span className={`ml-1 text-[10px] font-medium ${filter === f.mode ? "text-white/70" : "opacity-60"}`}>
                {counts[f.mode]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-surface-container-lowest z-10">
            <tr className="text-on-surface-variant text-[9px] font-bold uppercase tracking-widest border-b border-surface-container">
              <SortHeader label="Agency" k="name" sortKey={sortKey} dir={sortDir} onClick={setSort} />
              <SortHeader label="Sector" k="type" sortKey={sortKey} dir={sortDir} onClick={setSort} className="hidden sm:table-cell" />
              <SortHeader label="Size" k="spend" sortKey={sortKey} dir={sortDir} onClick={setSort} />
              <SortHeader label="Est. Renewal" k="renewal" sortKey={sortKey} dir={sortDir} onClick={setSort} className="hidden xl:table-cell" />
              <th className="px-4 md:px-6 py-3 hidden md:table-cell">Lead Score</th>
              <SortHeader label="Status" k="status" sortKey={sortKey} dir={sortDir} onClick={setSort} />
              <th className="px-4 md:px-6 py-3 text-right w-12" />
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container/30">
            {displayed.map((agency) => {
              const leadPct = Math.min((agency.totalSpend / maxSpend) * 100, 100);
              const estRenewal =
                agency.lastPurchaseYear > 0
                  ? Math.max(agency.lastPurchaseYear + 4, CURRENT_YEAR)
                  : CURRENT_YEAR;
              const isOpen = expanded === agency.name;

              return (
                <>
                  <tr
                    key={agency.name}
                    onClick={() => setExpanded(isOpen ? null : agency.name)}
                    className={`transition-colors group cursor-pointer ${
                      agency.contractStatus === "expiring"
                        ? "bg-[var(--renewal-row)] hover:bg-[var(--renewal-row-hover)]"
                        : "hover:bg-surface"
                    } ${isOpen ? "bg-surface-container-low" : ""}`}
                  >
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded bg-surface-container-high flex items-center justify-center font-bold text-primary text-[10px] shrink-0">
                          {initials(agency.name)}
                        </div>
                        <span
                          className="font-bold text-primary text-xs md:text-sm truncate max-w-[160px] md:max-w-[280px]"
                          title={agency.name}
                        >
                          {agency.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs text-on-surface-variant whitespace-nowrap hidden sm:table-cell">
                      {agency.type || "—"}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs font-bold text-primary whitespace-nowrap">
                      {formatCurrency(agency.totalSpend)}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-xs text-on-surface-variant whitespace-nowrap hidden xl:table-cell">
                      {estRenewal}
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                      <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            agency.contractStatus === "expiring" ? "bg-on-tertiary-container" : "bg-secondary"
                          }`}
                          style={{ width: `${leadPct}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">{statusBadge(agency.contractStatus)}</td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <span
                        className="material-symbols-outlined text-on-surface-variant transition-transform"
                        style={{
                          fontSize: "18px",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                        }}
                      >
                        expand_more
                      </span>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr key={`${agency.name}-details`} className="bg-surface-container-low">
                      <td colSpan={8} className="px-4 md:px-6 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                              Top Reseller
                            </div>
                            <div className="font-bold text-primary">{agency.topCompany}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                              Transactions
                            </div>
                            <div className="font-bold text-primary">{agency.transactionCount}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                              Last Purchase
                            </div>
                            <div className="font-bold text-primary">
                              {agency.lastPurchaseYear || "—"}
                              <span className="text-on-surface-variant font-normal ml-1">
                                ({agency.yearsSinceLastPurchase}y ago)
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                              Est. Renewal
                            </div>
                            <div className="font-bold text-primary">{estRenewal}</div>
                          </div>
                          {agency.topKeywords.length > 0 && (
                            <div className="col-span-2 md:col-span-4">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                                Top Products
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {agency.topKeywords.map((kw) => (
                                  <span
                                    key={kw}
                                    className="px-2 py-0.5 rounded bg-surface-container-high text-primary text-[11px] font-medium"
                                  >
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="px-4 md:px-6 py-3 bg-surface-container-low/30 border-t border-surface-container flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">
            Showing {displayed.length} of {filtered.length}
          </span>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-secondary font-bold text-xs hover:underline flex items-center gap-1"
          >
            {showAll ? "Show Top 50" : "Show All"}
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
              {showAll ? "expand_less" : "expand_more"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
});

export default OpportunityTable;

type SortKey = "name" | "type" | "spend" | "score" | "renewal" | "status";
function SortHeader({
  label,
  k,
  sortKey,
  dir,
  onClick,
  className = "",
}: {
  label: string;
  k: SortKey;
  sortKey: string;
  dir: "asc" | "desc";
  onClick: (k: SortKey) => void;
  className?: string;
}) {
  const active = sortKey === k;
  return (
    <th
      className={`px-4 md:px-6 py-3 cursor-pointer select-none ${active ? "text-primary" : "hover:text-primary"} ${className}`}
      onClick={() => onClick(k)}
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
