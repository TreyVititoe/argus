"use client";

import { useState, useMemo, useRef } from "react";
import { Transaction, StateInfo } from "@/lib/types";
import { summarizeByAgency, summarizeByCompany, formatCurrency } from "@/lib/data-utils";
import rawData from "@/lib/data.json";
import AppShell from "./AppShell";
import KpiStat from "./KpiStat";
import SpendTrendChart from "./SpendTrendChart";
import InsightPanel from "./InsightPanel";
import TopAgenciesBarChart from "./TopAgenciesBarChart";
import CompetitorRadar from "./CompetitorRadar";
import OpportunityTable from "./OpportunityTable";
import StateTabs from "./StateTabs";
import { getRegion, FL_REGIONS, Region } from "@/lib/regions";
import styles from "./ExecutiveDashboard.module.css";

const allTransactions = rawData.transactions as Transaction[];
const allStates = rawData.states as StateInfo[];

export default function ExecutiveDashboard() {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [selectedRegion, setSelectedRegion] = useState<Region | "all">("all");
  const [opportunityFilter, setOpportunityFilter] = useState<"all" | "expiring" | "active" | "dormant">("all");
  const opportunitiesRef = useRef<HTMLDivElement>(null);

  const handleViewAllOpportunities = () => {
    setOpportunityFilter("expiring");
    setTimeout(() => {
      opportunitiesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const filteredTransactions = useMemo(() => {
    let base = allTransactions;
    if (selectedState !== "ALL") {
      base = base.filter((t) => t.stateCode === selectedState);
    }
    if (selectedState === "FL" && selectedRegion !== "all") {
      base = base.filter((t) => getRegion(t.agency, t.stateCode) === selectedRegion);
    }
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(
      (t) =>
        t.agency.toLowerCase().includes(q) ||
        t.company.toLowerCase().includes(q) ||
        t.keyword.toLowerCase().includes(q)
    );
  }, [search, selectedState, selectedRegion]);

  const handleStateChange = (code: string) => {
    setSelectedState(code);
    setSelectedRegion("all");
  };

  const flRegionCounts = useMemo(() => {
    if (selectedState !== "FL") return null;
    const counts: Record<string, number> = { all: 0 };
    for (const r of FL_REGIONS) counts[r] = 0;
    const flTx = allTransactions.filter((t) => t.stateCode === "FL");
    counts.all = flTx.length;
    for (const t of flTx) {
      const r = getRegion(t.agency, t.stateCode);
      if (r) counts[r] = (counts[r] || 0) + 1;
    }
    return counts;
  }, [selectedState]);

  const allAgencies = useMemo(() => summarizeByAgency(filteredTransactions), [filteredTransactions]);
  const allCompanies = useMemo(() => summarizeByCompany(filteredTransactions), [filteredTransactions]);

  const totalSpend = useMemo(
    () => filteredTransactions.reduce((sum, t) => sum + t.totalPrice, 0),
    [filteredTransactions]
  );

  const expiringStats = useMemo(() => {
    const expiring = allAgencies.filter((a) => a.contractStatus === "expiring");
    return {
      count: expiring.length,
      totalValue: expiring.reduce((s, a) => s + a.totalSpend, 0),
    };
  }, [allAgencies]);

  const activeCount = useMemo(
    () => allAgencies.filter((a) => a.contractStatus === "active").length,
    [allAgencies]
  );

  const avgDeal = useMemo(() => {
    if (filteredTransactions.length === 0) return 0;
    return totalSpend / filteredTransactions.length;
  }, [totalSpend, filteredTransactions]);

  const winRate = useMemo(() => {
    if (allAgencies.length === 0) return 0;
    return (activeCount / allAgencies.length) * 100;
  }, [activeCount, allAgencies]);

  const yoyGrowth = useMemo(() => {
    const byYear = new Map<number, number>();
    for (const t of filteredTransactions) {
      byYear.set(t.year, (byYear.get(t.year) || 0) + t.totalPrice);
    }
    const y2024 = byYear.get(2024) || 0;
    const y2023 = byYear.get(2023) || 0;
    if (y2023 === 0) return 0;
    return ((y2024 - y2023) / y2023) * 100;
  }, [filteredTransactions]);

  return (
    <AppShell search={search} onSearchChange={setSearch}>
      <div className={styles.eyebrow}>Market Overview</div>
      <div className={styles.h1Row}>
        <h1 className={styles.headline}>Executive dashboard</h1>
        <div className={styles.h1Meta}>
          {selectedState === "ALL"
            ? `${allStates.length} states · ${allTransactions.length.toLocaleString()} transactions`
            : allStates.find((s) => s.code === selectedState)?.name || selectedState}
        </div>
      </div>

      <div className="mb-7">
        <StateTabs
          states={allStates}
          selected={selectedState}
          onSelect={handleStateChange}
          total={allTransactions.length}
        />
      </div>

      {selectedState === "FL" && flRegionCounts && (
        <div className="mb-7 flex items-center flex-wrap gap-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant mr-2">
            Region
          </span>
          {(["all", ...FL_REGIONS] as const).map((r) => {
            const isActive = selectedRegion === r;
            return (
              <button
                key={r}
                onClick={() => setSelectedRegion(r as Region | "all")}
                className={`shrink-0 inline-flex items-center gap-2.5 pl-4 pr-3.5 py-2 rounded-full text-[13px] font-medium border transition-colors ${
                  isActive
                    ? "bg-primary border-primary text-white"
                    : "bg-surface-container-lowest border-outline-variant text-primary hover:border-[oklch(0.88_0.007_85)]"
                }`}
              >
                {r === "all" ? "All FL" : r}
                <span
                  className={`text-[12px] font-medium rounded-full px-2 py-0.5 ${
                    isActive
                      ? "bg-white/12 text-white/80"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {(flRegionCounts[r] || 0).toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-5">
        <KpiStat
          label="Total Contract Value"
          value={formatCurrency(totalSpend)}
          delta={yoyGrowth >= 0 ? `+${yoyGrowth.toFixed(0)}%` : `${yoyGrowth.toFixed(0)}%`}
          deltaType={yoyGrowth >= 0 ? "positive" : "negative"}
        />
        <KpiStat
          label="Expiring Contracts"
          value={String(expiringStats.count)}
          delta={formatCurrency(expiringStats.totalValue)}
          deltaType="positive"
        />
        <KpiStat
          label="Active Agencies"
          value={String(activeCount)}
          delta={`${allAgencies.length} total`}
          deltaType="neutral"
        />
        <KpiStat
          label="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          delta={winRate >= 50 ? "+" : "-"}
          deltaType={winRate >= 50 ? "positive" : "negative"}
        />
        <KpiStat
          label="Avg Deal Size"
          value={formatCurrency(avgDeal)}
          delta={`${filteredTransactions.length.toLocaleString()} txns`}
          deltaType="neutral"
        />
        <KpiStat
          label="Top Vendor"
          value={allCompanies[0]?.name.split(/\s+/)[0] || "—"}
          delta={formatCurrency(allCompanies[0]?.totalSpend || 0)}
          deltaType="neutral"
        />
      </div>

      <div className="grid grid-cols-12 gap-4 mb-5">
        <SpendTrendChart transactions={filteredTransactions} />
        <InsightPanel
          expiringCount={expiringStats.count}
          expiringValue={expiringStats.totalValue}
          onViewAll={handleViewAllOpportunities}
        />
      </div>

      <div className="grid grid-cols-12 gap-4 mb-5">
        <TopAgenciesBarChart agencies={allAgencies} />
        <CompetitorRadar transactions={filteredTransactions} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <OpportunityTable
          ref={opportunitiesRef}
          agencies={allAgencies}
          filter={opportunityFilter}
          onFilterChange={setOpportunityFilter}
        />
      </div>
    </AppShell>
  );
}
