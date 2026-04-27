"use client";

import { useState, useMemo } from "react";
import { useClearFilters } from "@/lib/use-clear-filters";
import { Transaction, StateInfo, CompanySummary } from "@/lib/types";
import { summarizeByCompany, formatCurrency } from "@/lib/data-utils";
import rawData from "@/lib/data.json";
import AppShell from "./AppShell";
import PageHeader from "./PageHeader";
import StateTabs from "./StateTabs";

const allTransactions = rawData.transactions as Transaction[];
const allStates = rawData.states as StateInfo[];

const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

function MiniSparkline({ data }: { data: Record<number, number> }) {
  const values = YEARS.map((y) => data[y] || 0);
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-[2px] h-8">
      {values.map((v, i) => (
        <div key={YEARS[i]} className="flex flex-col items-center gap-0.5">
          <div
            className="w-[5px] rounded-sm bg-secondary"
            style={{ height: `${Math.max((v / max) * 28, 1)}px` }}
          />
          <span className="text-[7px] text-on-surface-variant">{String(YEARS[i]).slice(2)}</span>
        </div>
      ))}
    </div>
  );
}

export default function CompaniesView() {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredTx = useMemo(() => {
    if (selectedState === "ALL") return allTransactions;
    return allTransactions.filter((t) => t.stateCode === selectedState);
  }, [selectedState]);

  const companies = useMemo(() => {
    const summaries = summarizeByCompany(filteredTx);
    summaries.sort((a, b) => b.totalSpend - a.totalSpend);
    if (!search.trim()) return summaries;
    const q = search.toLowerCase();
    return summaries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.topKeywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [filteredTx, search]);

  const totalSpend = companies.reduce((s, c) => s + c.totalSpend, 0);
  const maxSpend = companies[0]?.totalSpend || 1;

  useClearFilters(() => {
    setSearch("");
    setSelectedState("ALL");
    setExpanded(null);
  });

  // For expanded company: compute top agencies that use it
  const getTopAgencies = (companyName: string) => {
    const agencySpend = new Map<string, number>();
    for (const t of filteredTx) {
      if (t.company === companyName) {
        agencySpend.set(t.agency, (agencySpend.get(t.agency) || 0) + t.totalPrice);
      }
    }
    return Array.from(agencySpend.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  return (
    <AppShell search={search} onSearchChange={setSearch}>
      <PageHeader
        eyebrow="Reseller Database"
        title="Resellers"
        meta={`${companies.length} resellers · ${formatCurrency(totalSpend)} tracked spend`}
      />

      <div className="mb-6">
          <StateTabs
            states={allStates}
            selected={selectedState}
            onSelect={setSelectedState}
            total={allTransactions.length}
          />
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 md:px-6 py-3 bg-surface-container-low/30 border-b border-surface-container flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>
                search
              </span>
              <input
                type="text"
                placeholder="Filter vendors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm w-full placeholder:text-on-surface-variant"
              />
            </div>
            <span className="text-[11px] text-on-surface-variant">{companies.length} results</span>
          </div>

          <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
            {companies.map((c, i) => {
              const isOpen = expanded === c.name;
              return (
                <div key={c.name}>
                  <div
                    onClick={() => setExpanded(isOpen ? null : c.name)}
                    className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 cursor-pointer transition-colors border-b border-surface-container/30 ${
                      isOpen ? "bg-surface-container-low" : "hover:bg-surface"
                    }`}
                  >
                    <div className="w-7 text-xs font-bold text-on-surface-variant text-right shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-primary text-sm truncate">{c.name}</div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-on-surface-variant">
                        <span>{c.agencyCount} agencies</span>
                        <span>{c.transactionCount.toLocaleString()} txns</span>
                        <span>last {c.lastPurchaseYear || "—"}</span>
                        {c.topKeywords.slice(0, 2).map((kw) => (
                          <span
                            key={kw}
                            className="px-1.5 py-0.5 rounded bg-secondary-fixed/30 text-secondary text-[10px] font-medium"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="w-24 md:w-32 hidden md:block">
                      <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                        <div
                          className="h-full bg-secondary"
                          style={{ width: `${Math.min((c.totalSpend / maxSpend) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="hidden lg:block">
                      <MiniSparkline data={c.spendByYear} />
                    </div>
                    <div className="w-20 text-right shrink-0">
                      <div className="font-bold text-primary text-sm">{formatCurrency(c.totalSpend)}</div>
                    </div>
                    <span
                      className="material-symbols-outlined text-on-surface-variant transition-transform shrink-0"
                      style={{ fontSize: "18px", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                    >
                      expand_more
                    </span>
                  </div>
                  {isOpen && (
                    <div className="bg-surface-container-low px-4 md:px-6 py-4 border-b border-surface-container">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                            Top Agencies
                          </div>
                          <div className="space-y-1.5">
                            {getTopAgencies(c.name).map(([name, spend]) => (
                              <div key={name} className="flex items-center justify-between gap-2">
                                <span className="text-primary truncate">{name}</span>
                                <span className="font-bold text-primary shrink-0">{formatCurrency(spend)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                            Product Keywords
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {c.topKeywords.map((kw) => (
                              <span
                                key={kw}
                                className="px-2 py-0.5 rounded bg-surface-container-high text-primary text-[11px] font-medium"
                              >
                                {kw}
                              </span>
                            ))}
                            {c.topKeywords.length === 0 && (
                              <span className="text-on-surface-variant text-[11px]">None</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
    </AppShell>
  );
}
