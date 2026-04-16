"use client";

import { useState, useMemo, useRef } from "react";
import { Transaction, StateInfo } from "@/lib/types";
import {
  summarizeByAgency,
  summarizeByCompany,
  formatCurrency,
} from "@/lib/data-utils";
import rawData from "@/lib/data.json";
import Sidebar from "./Sidebar";
import TopAppBar from "./TopAppBar";
import KpiStat from "./KpiStat";
import SpendTrendChart from "./SpendTrendChart";
import InsightPanel from "./InsightPanel";
import TopAgenciesBarChart from "./TopAgenciesBarChart";
import CompetitorRadar from "./CompetitorRadar";
import OpportunityTable from "./OpportunityTable";
import StateTabs from "./StateTabs";
import { getRegion, FL_REGIONS, Region } from "@/lib/regions";

const allTransactions = rawData.transactions as Transaction[];
const allStates = rawData.states as StateInfo[];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Reset region filter when switching states
  const handleStateChange = (code: string) => {
    setSelectedState(code);
    setSelectedRegion("all");
  };

  // Region breakdown for FL (count of transactions per region)
  const flRegionCounts = useMemo(() => {
    if (selectedState !== "FL") return null;
    const counts: Record<string, number> = { "all": 0 };
    for (const r of FL_REGIONS) counts[r] = 0;
    const flTx = allTransactions.filter((t) => t.stateCode === "FL");
    counts["all"] = flTx.length;
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
    // Proxy: percentage of agencies with active contracts
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
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="lg:ml-64 min-h-screen pb-12">
        <TopAppBar
          search={search}
          onSearchChange={setSearch}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <section className="px-4 md:px-8 py-6 md:py-8 max-w-[1440px] mx-auto">
          <div className="mb-4">
            <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-1">
              Market Overview
            </span>
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <h3 className="text-2xl md:text-3xl font-headline font-extrabold text-primary tracking-tight">
                Executive Dashboard
              </h3>
              <span className="text-xs text-on-surface-variant">
                {selectedState === "ALL"
                  ? `${allStates.length} states \u00B7 ${allTransactions.length.toLocaleString()} transactions`
                  : `${allStates.find((s) => s.code === selectedState)?.name || selectedState}`}
              </span>
            </div>
          </div>

          {/* State Tabs */}
          <div className="mb-3">
            <StateTabs
              states={allStates}
              selected={selectedState}
              onSelect={handleStateChange}
              total={allTransactions.length}
            />
          </div>

          {/* Florida Region Filter */}
          {selectedState === "FL" && flRegionCounts && (
            <div className="mb-6 flex items-center gap-1 md:gap-2 overflow-x-auto pb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant shrink-0 mr-2">
                Region:
              </span>
              <button
                onClick={() => setSelectedRegion("all")}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedRegion === "all"
                    ? "bg-on-tertiary-container text-white"
                    : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                All FL
                <span className={`ml-1.5 text-[10px] ${selectedRegion === "all" ? "text-white/70" : "opacity-60"}`}>
                  {flRegionCounts["all"].toLocaleString()}
                </span>
              </button>
              {FL_REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRegion(r)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedRegion === r
                      ? "bg-on-tertiary-container text-white"
                      : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {r}
                  <span className={`ml-1.5 text-[10px] ${selectedRegion === r ? "text-white/70" : "opacity-60"}`}>
                    {(flRegionCounts[r] || 0).toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          )}

          {selectedState !== "FL" && <div className="mb-6" />}

          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
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

          {/* Spend Trend + Insight */}
          <div className="grid grid-cols-12 gap-4 md:gap-6 mb-6 md:mb-8">
            <SpendTrendChart transactions={filteredTransactions} />
            <InsightPanel
              expiringCount={expiringStats.count}
              expiringValue={expiringStats.totalValue}
              onViewAll={handleViewAllOpportunities}
            />
          </div>

          {/* Bar + Radar */}
          <div className="grid grid-cols-12 gap-4 md:gap-6 mb-6 md:mb-8">
            <TopAgenciesBarChart agencies={allAgencies} />
            <CompetitorRadar transactions={filteredTransactions} />
          </div>

          {/* Top Opportunities Table */}
          <div className="grid grid-cols-12 gap-6">
            <OpportunityTable
              ref={opportunitiesRef}
              agencies={allAgencies}
              filter={opportunityFilter}
              onFilterChange={setOpportunityFilter}
            />
          </div>
        </section>
      </main>
    </>
  );
}
