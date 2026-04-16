"use client";

import { useState, useMemo } from "react";
import { Transaction } from "@/lib/types";
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

const allTransactions = rawData.transactions as Transaction[];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    if (!search.trim()) return allTransactions;
    const q = search.toLowerCase();
    return allTransactions.filter(
      (t) =>
        t.agency.toLowerCase().includes(q) ||
        t.company.toLowerCase().includes(q) ||
        t.keyword.toLowerCase().includes(q)
    );
  }, [search]);

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
      <main className="md:ml-64 min-h-screen pb-12">
        <TopAppBar
          search={search}
          onSearchChange={setSearch}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <section className="px-4 md:px-8 py-6 md:py-8 max-w-[1440px] mx-auto">
          <div className="mb-6">
            <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-1">
              Market Overview
            </span>
            <h3 className="text-2xl md:text-3xl font-headline font-extrabold text-primary tracking-tight">
              Executive Dashboard
            </h3>
          </div>

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
            />
          </div>

          {/* Bar + Radar */}
          <div className="grid grid-cols-12 gap-4 md:gap-6 mb-6 md:mb-8">
            <TopAgenciesBarChart agencies={allAgencies} />
            <CompetitorRadar transactions={filteredTransactions} />
          </div>

          {/* Top Opportunities Table */}
          <div className="grid grid-cols-12 gap-6">
            <OpportunityTable agencies={allAgencies} />
          </div>
        </section>
      </main>
    </>
  );
}
