"use client";

import { useState, useMemo, useRef } from "react";
import { useClearFilters } from "@/lib/use-clear-filters";
import { Transaction, StateInfo } from "@/lib/types";
import {
  summarizeByAgency,
  summarizeByCompany,
  summarizeByVendor,
  formatCurrency,
} from "@/lib/data-utils";
import rawData from "@/lib/data.json";
import AppShell from "./AppShell";
import KpiStat from "./KpiStat";
import SpendTrendChart from "./SpendTrendChart";
import InsightPanel from "./InsightPanel";
import TopAgenciesBarChart from "./TopAgenciesBarChart";
import CompetitorsTable from "./CompetitorsTable";
import OpportunityTable from "./OpportunityTable";
import StateTabs from "./StateTabs";
import StateMap from "./StateMap";
import ShareDonut from "./ShareDonut";
import TenantLogo from "./TenantLogo";

const SHARE_COLORS = [
  "oklch(0.50 0.08 160)",
  "oklch(0.62 0.10 140)",
  "oklch(0.55 0.12 40)",
  "oklch(0.55 0.08 240)",
  "oklch(0.65 0.09 75)",
  "oklch(0.78 0.005 85)",
];
import PageHeader from "./PageHeader";
import { getRegion, FL_REGIONS, Region } from "@/lib/regions";

const allTransactions = (rawData.transactions as Transaction[]).filter(
  (t) => t.competitor !== "Medical Platforms"
);
const allStates = rawData.states as StateInfo[];
const allYears = Array.from(
  new Set(allTransactions.map((t) => t.year).filter((y) => y > 0))
).sort((a, b) => b - a);
const MIN_YEAR = allYears[allYears.length - 1];
const MAX_YEAR = allYears[0];

function formatCompany(slug: string): string {
  const known: Record<string, string> = {
    cohesity: "Cohesity",
    crowdstrike: "CrowdStrike",
  };
  if (known[slug.toLowerCase()]) return known[slug.toLowerCase()];
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

function yearRangeLabel(yearMin: number | null, yearMax: number | null): string {
  if (yearMin === null && yearMax === null) return "All years";
  if (yearMin !== null && yearMax !== null) {
    return yearMin === yearMax ? `${yearMin}` : `${yearMin} – ${yearMax}`;
  }
  if (yearMin !== null) return `${yearMin}+`;
  return `through ${yearMax}`;
}

export default function ExecutiveDashboard({ company }: { company?: string } = {}) {
  const [search, setSearch] = useState("");
  const [yearMin, setYearMin] = useState<number | null>(null);
  const [yearMax, setYearMax] = useState<number | null>(null);
  const [yearsOpen, setYearsOpen] = useState(false);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [statesOpen, setStatesOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | "all">("all");
  // FL region filter only applies when FL is the *only* selected state.
  const isOnlyFL = selectedStates.length === 1 && selectedStates[0] === "FL";
  const [opportunityFilter, setOpportunityFilter] = useState<"all" | "expiring" | "active" | "dormant">("all");
  const [hideMicrosoft, setHideMicrosoft] = useState(false);
  const [drill, setDrill] = useState<{ kind: "reseller" | "vendor" | "agency"; value: string } | null>(null);
  const opportunitiesRef = useRef<HTMLDivElement>(null);

  const handleViewAllOpportunities = () => {
    setOpportunityFilter("expiring");
    setTimeout(() => {
      opportunitiesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  useClearFilters(() => {
    setSearch("");
    setYearMin(null);
    setYearMax(null);
    setYearsOpen(false);
    setSelectedStates([]);
    setStatesOpen(false);
    setSelectedRegion("all");
    setOpportunityFilter("all");
    setHideMicrosoft(false);
    setDrill(null);
  });

  const filteredTransactions = useMemo(() => {
    let base = allTransactions;
    if (hideMicrosoft) {
      base = base.filter((t) => t.competitor !== "Microsoft" && t.company !== "Microsoft");
    }
    if (yearMin !== null) base = base.filter((t) => t.year >= yearMin);
    if (yearMax !== null) base = base.filter((t) => t.year <= yearMax);
    if (selectedStates.length > 0) {
      const set = new Set(selectedStates);
      base = base.filter((t) => set.has(t.stateCode));
    }
    if (isOnlyFL && selectedRegion !== "all") {
      base = base.filter((t) => getRegion(t.agency, t.stateCode) === selectedRegion);
    }
    if (drill) {
      if (drill.kind === "reseller") {
        const v = drill.value.toLowerCase();
        // Reseller donut compresses names to first two words; match by prefix.
        base = base.filter((t) => t.company.toLowerCase().startsWith(v));
      } else if (drill.kind === "vendor") {
        base = base.filter((t) => t.competitor === drill.value);
      } else if (drill.kind === "agency") {
        base = base.filter((t) => t.agency === drill.value);
      }
    }
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(
      (t) =>
        t.agency.toLowerCase().includes(q) ||
        t.company.toLowerCase().includes(q) ||
        t.keyword.toLowerCase().includes(q)
    );
  }, [search, yearMin, yearMax, selectedStates, selectedRegion, hideMicrosoft, isOnlyFL, drill]);

  const handleStateToggle = (code: string) => {
    setSelectedStates((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
    setSelectedRegion("all");
  };
  const handleClearStates = () => {
    setSelectedStates([]);
    setSelectedRegion("all");
  };

  const flRegionCounts = useMemo(() => {
    if (!isOnlyFL) return null;
    const counts: Record<string, number> = { all: 0 };
    for (const r of FL_REGIONS) counts[r] = 0;
    const flTx = allTransactions.filter((t) => t.stateCode === "FL");
    counts.all = flTx.length;
    for (const t of flTx) {
      const r = getRegion(t.agency, t.stateCode);
      if (r) counts[r] = (counts[r] || 0) + 1;
    }
    return counts;
  }, [isOnlyFL]);

  const allAgencies = useMemo(() => summarizeByAgency(filteredTransactions), [filteredTransactions]);
  const allCompanies = useMemo(() => summarizeByCompany(filteredTransactions), [filteredTransactions]);
  const allVendors = useMemo(() => summarizeByVendor(filteredTransactions), [filteredTransactions]);

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
      {drill && (
        <div
          className="sticky top-2 z-30 mb-4 flex items-center justify-between gap-3 rounded-full border px-4 py-2 shadow-md backdrop-blur"
          style={{
            background: "var(--accent-bg)",
            borderColor: "var(--accent)",
            color: "var(--accent)",
          }}
        >
          <span className="text-[12px] font-semibold truncate">
            Drilling into {drill.kind}: <span className="font-bold">{drill.value}</span>
          </span>
          <button
            type="button"
            onClick={() => setDrill(null)}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold text-white transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--accent)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
            </svg>
            Undo
          </button>
        </div>
      )}
      <div className="grid grid-cols-12 gap-4 lg:items-end mb-5">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <PageHeader
            eyebrow={company ? `Market Overview · ${formatCompany(company)}` : "Market Overview"}
            title="Executive dashboard"
            meta={
              selectedStates.length === 0
                ? `${allStates.length} states · ${allTransactions.length.toLocaleString()} transactions`
                : selectedStates.length === 1
                ? allStates.find((s) => s.code === selectedStates[0])?.name || selectedStates[0]
                : `${selectedStates.length} states selected`
            }
          />

      {/* Year range: collapsible summary bar */}
      <div>
        <button
          type="button"
          onClick={() => setYearsOpen((v) => !v)}
          className="inline-flex items-center gap-3 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-[13px] font-medium text-primary transition-colors hover:border-[oklch(0.88_0.007_85)]"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
            Year
          </span>
          <span>{yearRangeLabel(yearMin, yearMax)}</span>
          <span className="text-on-surface-variant">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: yearsOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 120ms" }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>

        {yearsOpen && (
          <div className="mt-3 flex items-center flex-wrap gap-3 rounded-[14px] border border-outline-variant bg-surface-container-lowest px-4 py-3">
            <label className="inline-flex items-center gap-2 text-[12px] text-on-surface-variant">
              From
              <select
                value={yearMin ?? ""}
                onChange={(e) => setYearMin(e.target.value ? Number(e.target.value) : null)}
                className="rounded-[10px] border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-[13px] text-primary outline-none focus:border-[var(--accent-soft)]"
              >
                <option value="">Any</option>
                {allYears.slice().reverse().map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
            <label className="inline-flex items-center gap-2 text-[12px] text-on-surface-variant">
              To
              <select
                value={yearMax ?? ""}
                onChange={(e) => setYearMax(e.target.value ? Number(e.target.value) : null)}
                className="rounded-[10px] border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-[13px] text-primary outline-none focus:border-[var(--accent-soft)]"
              >
                <option value="">Any</option>
                {allYears.slice().reverse().map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => {
                setYearMin(null);
                setYearMax(null);
              }}
              className="text-[12px] font-medium text-[var(--accent)] hover:underline"
            >
              All years
            </button>
            <button
              type="button"
              onClick={() => {
                setYearMin(MIN_YEAR);
                setYearMax(MAX_YEAR);
              }}
              className="text-[12px] font-medium text-on-surface-variant hover:text-primary"
            >
              Full range ({MIN_YEAR}–{MAX_YEAR})
            </button>
          </div>
        )}
      </div>

      {/* States: collapsible chip mirroring Year */}
      <div className="flex items-center flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStatesOpen((v) => !v)}
          className="inline-flex items-center gap-3 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-[13px] font-medium text-primary transition-colors hover:border-[oklch(0.88_0.007_85)]"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
            States
          </span>
          <span>
            {selectedStates.length === 0
              ? "All states"
              : selectedStates.length === 1
              ? allStates.find((s) => s.code === selectedStates[0])?.name || selectedStates[0]
              : `${selectedStates.length} states selected`}
          </span>
          <span className="text-on-surface-variant">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transform: statesOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 120ms" }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>
        {selectedStates.length > 0 && (
          <button
            type="button"
            onClick={handleClearStates}
            className="text-[12px] font-medium text-[var(--accent)] hover:underline ml-1"
          >
            Clear
          </button>
        )}
      </div>

      {statesOpen && (
        <div className="rounded-[14px] border border-outline-variant bg-surface-container-lowest px-4 py-3">
          <StateTabs
            states={allStates}
            selected={selectedStates}
            onToggle={handleStateToggle}
            onClear={handleClearStates}
            total={allTransactions.length}
          />
        </div>
      )}

      {isOnlyFL && flRegionCounts && (
        <div className="flex items-center flex-wrap gap-2.5">
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
                    ? "bg-primary border-primary text-on-primary"
                    : "bg-surface-container-lowest border-outline-variant text-primary hover:border-[oklch(0.88_0.007_85)]"
                }`}
              >
                {r === "all" ? "All FL" : r}
                <span
                  className={`text-[12px] font-medium rounded-full px-2 py-0.5 ${
                    isActive
                      ? "bg-on-primary/12 text-on-primary/80"
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
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-1">
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setHideMicrosoft((v) => !v)}
              aria-pressed={hideMicrosoft}
              title={hideMicrosoft ? "Including Microsoft data" : "Excluding Microsoft data"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-colors"
              style={{
                borderColor: hideMicrosoft ? "var(--accent)" : "var(--line)",
                background: hideMicrosoft ? "var(--accent-bg)" : "transparent",
                color: hideMicrosoft ? "var(--accent)" : "var(--ink-3)",
              }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: hideMicrosoft ? "var(--accent)" : "var(--ink-4)" }}
              />
              {hideMicrosoft ? "No Microsoft View · ON" : "No Microsoft View"}
            </button>
          </div>
          <TenantLogo company={company} />
          <StateMap states={allStates} selectedStates={selectedStates} selectedRegion={selectedRegion} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-5">
        <KpiStat
          label="Total Contract Value"
          value={formatCurrency(totalSpend)}
          delta={yoyGrowth >= 0 ? `+${yoyGrowth.toFixed(0)}%` : `${yoyGrowth.toFixed(0)}%`}
          deltaType={yoyGrowth >= 0 ? "positive" : "negative"}
          tooltip="Sum of all contract line items in the current filter (year + state + region + search). Delta is year-over-year change between 2024 and 2023 within the filter."
        />
        <KpiStat
          label="Expiring Contracts"
          value={String(expiringStats.count)}
          delta={formatCurrency(expiringStats.totalValue)}
          deltaType="positive"
          tooltip="Agencies whose last purchase was 3-5 years ago and whose total spend exceeds $10K. The dollar amount is their historical spend — your renewal-window opportunity size."
        />
        <KpiStat
          label="Active Agencies"
          value={String(activeCount)}
          delta={`${allAgencies.length} total`}
          deltaType="neutral"
          tooltip="Agencies with at least one purchase in the last 2 years inside the current filter. Total includes active, expiring, and dormant agencies."
        />
        <KpiStat
          label="Top Reseller"
          value={allCompanies[0]?.name.split(/\s+/)[0] || "—"}
          delta={formatCurrency(allCompanies[0]?.totalSpend || 0)}
          deltaType="neutral"
          tooltip="Channel partner (CDW-G, SHI, Insight Public Sector, etc.) with the highest spend across the current filter. Distinct from the underlying vendor."
        />
        <KpiStat
          label="Top Vendor"
          value={allVendors[0]?.name || "—"}
          delta={formatCurrency(allVendors[0]?.totalSpend || 0)}
          deltaType="neutral"
          tooltip="Manufacturer / original-source competitor (e.g., Cohesity, Veeam, Rubrik) with the highest spend in the current filter."
        />
      </div>

      <div className="grid grid-cols-12 gap-4 mb-5">
        <ShareDonut
          eyebrow="Reseller share"
          title="Top resellers by spend"
          rows={allCompanies.map((c) => ({
            name: c.name.split(/\s+/).slice(0, 2).join(" "),
            value: c.totalSpend,
          }))}
          colors={SHARE_COLORS}
          onSliceClick={(name) => setDrill({ kind: "reseller", value: name })}
        />
        <ShareDonut
          eyebrow="Competitor share"
          title="Top vendors by spend"
          rows={allVendors.map((v) => ({ name: v.name, value: v.totalSpend }))}
          colors={SHARE_COLORS}
          onSliceClick={(name) => setDrill({ kind: "vendor", value: name })}
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
        <TopAgenciesBarChart
          agencies={allAgencies}
          onAgencyClick={(name) => setDrill({ kind: "agency", value: name })}
        />
        <CompetitorsTable transactions={filteredTransactions} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <OpportunityTable
          ref={opportunitiesRef}
          agencies={allAgencies}
          transactions={filteredTransactions}
          filter={opportunityFilter}
          onFilterChange={setOpportunityFilter}
        />
      </div>
    </AppShell>
  );
}
