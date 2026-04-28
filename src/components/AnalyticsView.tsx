"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useClearFilters } from "@/lib/use-clear-filters";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/data-utils";
import { getRegion, FL_REGIONS, Region } from "@/lib/regions";
import { getDataset } from "@/lib/datasets";
import AppShell from "./AppShell";
import PageHeader from "./PageHeader";
import StateTabs from "./StateTabs";

// allTransactions / allStates come from the active dataset inside the component.

const COLORS = [
  "oklch(0.50 0.08 160)",
  "oklch(0.55 0.12 40)",
  "oklch(0.50 0.08 240)",
  "oklch(0.70 0.14 75)",
  "oklch(0.55 0.10 140)",
  "oklch(0.50 0.06 200)",
  "oklch(0.55 0.12 20)",
  "oklch(0.55 0.08 280)",
  "oklch(0.60 0.09 180)",
  "oklch(0.50 0.12 350)",
];

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "var(--panel)",
    border: "1px solid oklch(0.91 0.006 85)",
    borderRadius: "10px",
    fontSize: "12px",
    boxShadow: "0px 12px 40px oklch(0.20 0.01 85 / 0.08)",
  },
};

type Drill =
  | { kind: "competitor"; value: string }
  | { kind: "type"; value: string }
  | { kind: "priceRange"; value: string }
  | { kind: "year"; value: number }
  | { kind: "keyword"; value: string }
  | null;

function drillLabel(d: NonNullable<Drill>): string {
  switch (d.kind) {
    case "competitor":
      return `vendor · ${d.value}`;
    case "type":
      return `agency type · ${d.value}`;
    case "priceRange":
      return `deal size · ${d.value}`;
    case "year":
      return `year · ${d.value}`;
    case "keyword":
      return `keyword · ${d.value}`;
  }
}

export default function AnalyticsView() {
  const params = useParams<{ dataset?: string }>();
  const dataset = useMemo(() => getDataset(params?.dataset as string | undefined), [params?.dataset]);
  const allTransactions: Transaction[] = dataset.transactions;
  const allStates = dataset.states;

  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | "all">("all");
  const [drill, setDrill] = useState<Drill>(null);

  // FL region applies whenever FL is in the selection, alongside other states.
  const includesFL = selectedStates.includes("FL");

  useClearFilters(() => {
    setSelectedStates([]);
    setSelectedRegion("all");
    setDrill(null);
  });

  const toggleState = (code: string) => {
    setSelectedStates((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
    if (code === "FL" && selectedStates.includes("FL")) setSelectedRegion("all");
  };
  const clearStates = () => {
    setSelectedStates([]);
    setSelectedRegion("all");
  };

  const filteredTx = useMemo(() => {
    let base: Transaction[] = allTransactions;
    if (selectedStates.length > 0) {
      const set = new Set(selectedStates);
      base = base.filter((t) => {
        if (!set.has(t.stateCode)) return false;
        if (t.stateCode === "FL" && includesFL && selectedRegion !== "all") {
          return getRegion(t.agency, t.stateCode) === selectedRegion;
        }
        return true;
      });
    }
    if (drill) {
      if (drill.kind === "competitor") base = base.filter((t) => t.competitor === drill.value);
      else if (drill.kind === "type") base = base.filter((t) => (t.type || "Other") === drill.value);
      else if (drill.kind === "priceRange") base = base.filter((t) => (t.priceRange || "Unknown") === drill.value);
      else if (drill.kind === "year") base = base.filter((t) => t.year === drill.value);
      else if (drill.kind === "keyword") base = base.filter((t) => t.keyword === drill.value);
    }
    return base;
  }, [allTransactions, selectedStates, selectedRegion, includesFL, drill]);

  const flRegionCounts = useMemo(() => {
    if (!includesFL) return null;
    const counts: Record<string, number> = { all: 0 };
    for (const r of FL_REGIONS) counts[r] = 0;
    const flTx = allTransactions.filter((t) => t.stateCode === "FL");
    counts.all = flTx.length;
    for (const t of flTx) {
      const r = getRegion(t.agency, t.stateCode);
      if (r) counts[r] = (counts[r] || 0) + 1;
    }
    return counts;
  }, [allTransactions, includesFL]);

  const years = useMemo(() => {
    const s = new Set<number>();
    for (const t of filteredTx) if (t.year) s.add(t.year);
    return Array.from(s).sort((a, b) => a - b);
  }, [filteredTx]);

  const spendByYear = useMemo(() => {
    const map = new Map<number, number>();
    for (const t of filteredTx) map.set(t.year, (map.get(t.year) || 0) + t.totalPrice);
    return years.map((y) => ({ year: String(y), yearNum: y, spend: map.get(y) || 0 }));
  }, [filteredTx, years]);

  const keywordTrends = useMemo(() => {
    const keywordTotals = new Map<string, number>();
    for (const t of filteredTx) {
      if (!t.keyword) continue;
      keywordTotals.set(t.keyword, (keywordTotals.get(t.keyword) || 0) + t.totalPrice);
    }
    const topKeywords = [...keywordTotals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k]) => k);

    return {
      keywords: topKeywords,
      data: years.map((year) => {
        const entry: Record<string, unknown> = { year: String(year) };
        for (const kw of topKeywords) {
          entry[kw] = filteredTx
            .filter((t) => t.year === year && t.keyword === kw)
            .reduce((s, t) => s + t.totalPrice, 0);
        }
        return entry;
      }),
    };
  }, [filteredTx, years]);

  const competitorShare = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of filteredTx) {
      if (!t.competitor) continue;
      map.set(t.competitor, (map.get(t.competitor) || 0) + t.totalPrice);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }, [filteredTx]);

  const typeBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of filteredTx) {
      const key = t.type || "Other";
      map.set(key, (map.get(key) || 0) + t.totalPrice);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [filteredTx]);

  const priceRangeBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of filteredTx) {
      const key = t.priceRange || "Unknown";
      map.set(key, (map.get(key) || 0) + t.totalPrice);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [filteredTx]);

  return (
    <AppShell>
      <PageHeader eyebrow="Deep Dive" title="Analytics" />

      {drill && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 w-[240px] rounded-[12px] border shadow-xl"
          style={{
            background: "var(--surface-container-lowest, var(--bg))",
            borderColor: "var(--accent)",
          }}
        >
          <div className="px-3.5 pt-3 pb-2.5">
            <div
              className="text-[10px] font-bold uppercase tracking-[0.14em] mb-0.5"
              style={{ color: "var(--accent)" }}
            >
              Filtered
            </div>
            <div className="text-[12px] font-semibold text-on-surface-variant capitalize">
              {drill.kind === "priceRange" ? "Deal size" : drill.kind}
            </div>
            <div className="text-[14px] font-bold text-primary truncate" title={String(drill.value)}>
              {drill.value}
            </div>
            <div className="text-[11px] text-on-surface-variant mt-0.5 tabular-nums">
              {filteredTx.length.toLocaleString()} txns
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDrill(null)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-[13px] font-bold text-white border-t transition-transform active:scale-[0.98]"
            style={{ background: "var(--accent)", borderColor: "var(--accent)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
            </svg>
            Undo
          </button>
        </div>
      )}

      <div className="mb-6">
        <StateTabs
          states={allStates}
          selected={selectedStates}
          onToggle={toggleState}
          onClear={clearStates}
          total={allTransactions.length}
        />
      </div>

      {includesFL && flRegionCounts && (
        <div className="mb-6 flex items-center flex-wrap gap-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant mr-2">
            Florida region
          </span>
          {(["all", ...FL_REGIONS] as const).map((r) => {
            const isActive = selectedRegion === r;
            return (
              <button
                key={r}
                onClick={() => setSelectedRegion(r as Region | "all")}
                className={`shrink-0 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                  isActive
                    ? "bg-primary border-primary text-on-primary"
                    : "bg-surface-container-lowest border-outline-variant text-primary hover:border-[oklch(0.88_0.007_85)]"
                }`}
              >
                {r === "all" ? "All FL" : r}
                <span
                  className={`text-[11px] font-medium rounded-full px-1.5 py-0.5 ${
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

      {/* Side-by-side row 1: Competitor Market Share + Agency Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm">
          <div className="mb-4">
            <h4 className="text-base md:text-lg font-headline font-bold text-primary">
              Competitor Market Share
            </h4>
            <p className="text-xs text-on-surface-variant">Click a bar to drill in · {competitorShare.length} vendors</p>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={competitorShare} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.006 85)" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="oklch(0.55 0.006 85)"
                  fontSize={11}
                  tickFormatter={(v) => formatCurrency(v)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="oklch(0.55 0.006 85)"
                  fontSize={10}
                  width={110}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value: unknown) => [formatCurrency(Number(value)), "Spend"]}
                />
                <Bar
                  dataKey="value"
                  fill="oklch(0.50 0.08 160)"
                  radius={[0, 4, 4, 0]}
                  onClick={(d) => {
                    const name = (d as { name?: string })?.name;
                    if (name) setDrill({ kind: "competitor", value: name });
                  }}
                  style={{ cursor: "pointer" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm">
          <div className="mb-4">
            <h4 className="text-base md:text-lg font-headline font-bold text-primary">
              Spend by Agency Type
            </h4>
            <p className="text-xs text-on-surface-variant">Click a slice to drill in · State, county, K-12, higher ed</p>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={45}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name || ""} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  labelLine={{ stroke: "oklch(0.72 0.005 85)" }}
                  fontSize={10}
                  onClick={(d) => {
                    const name = (d as { name?: string })?.name;
                    if (name) setDrill({ kind: "type", value: name });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {typeBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value: unknown) => [formatCurrency(Number(value)), "Spend"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Deal size full width */}
      <div className="bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm mb-6">
        <div className="mb-4">
          <h4 className="text-base md:text-lg font-headline font-bold text-primary">
            Deal Size Distribution
          </h4>
          <p className="text-xs text-on-surface-variant">Click a bar to drill in · Where the dollars are concentrated</p>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priceRangeBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.006 85)" vertical={false} />
              <XAxis dataKey="name" stroke="oklch(0.55 0.006 85)" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis
                stroke="oklch(0.55 0.006 85)"
                fontSize={11}
                tickFormatter={(v) => formatCurrency(v)}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                {...tooltipStyle}
                formatter={(value: unknown) => [formatCurrency(Number(value)), "Spend"]}
              />
              <Bar
                dataKey="value"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                onClick={(d) => {
                  const name = (d as { name?: string })?.name;
                  if (name) setDrill({ kind: "priceRange", value: name });
                }}
                style={{ cursor: "pointer" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* The two former-top charts, now half-size and below */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm">
          <div className="mb-4">
            <h4 className="text-base md:text-lg font-headline font-bold text-primary">Spend by Year</h4>
            <p className="text-xs text-on-surface-variant">Click a year to drill in · Total over time</p>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={spendByYear}
                margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
                onClick={(state) => {
                  const s = state as { activePayload?: { payload?: { yearNum?: number } }[] } | undefined;
                  const yearNum = s?.activePayload?.[0]?.payload?.yearNum;
                  if (typeof yearNum === "number") setDrill({ kind: "year", value: yearNum });
                }}
              >
                <defs>
                  <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.50 0.08 160)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.50 0.08 160)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.006 85)" vertical={false} />
                <XAxis dataKey="year" stroke="oklch(0.55 0.006 85)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis
                  stroke="oklch(0.55 0.006 85)"
                  fontSize={11}
                  tickFormatter={(v) => formatCurrency(v)}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value: unknown) => [formatCurrency(Number(value)), "Spend"]}
                />
                <Area
                  type="monotone"
                  dataKey="spend"
                  stroke="oklch(0.50 0.08 160)"
                  strokeWidth={3}
                  fill="url(#analyticsGradient)"
                  style={{ cursor: "pointer" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm">
          <div className="mb-4">
            <h4 className="text-base md:text-lg font-headline font-bold text-primary">Product Keyword Battles</h4>
            <p className="text-xs text-on-surface-variant">
              Click a keyword in the legend to drill in · Top 5 products competing for share
            </p>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={keywordTrends.data} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.006 85)" vertical={false} />
                <XAxis dataKey="year" stroke="oklch(0.55 0.006 85)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis
                  stroke="oklch(0.55 0.006 85)"
                  fontSize={11}
                  tickFormatter={(v) => formatCurrency(v)}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  {...tooltipStyle}
                  formatter={(value: unknown) => [formatCurrency(Number(value))]}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", color: "oklch(0.55 0.006 85)", cursor: "pointer" }}
                  onClick={(o) => {
                    const v = (o as { value?: string })?.value;
                    if (v) setDrill({ kind: "keyword", value: v });
                  }}
                />
                {keywordTrends.keywords.map((kw, i) => (
                  <Line
                    key={kw}
                    type="monotone"
                    dataKey={kw}
                    stroke={COLORS[i]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {drill && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="px-4 md:px-6 py-3 bg-surface-container-low/30 border-b border-surface-container">
            <h4 className="text-base font-headline font-bold text-primary">
              Matching transactions
            </h4>
            <p className="text-xs text-on-surface-variant">
              {filteredTx.length.toLocaleString()} rows · showing top 200
            </p>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-surface-container-lowest z-10 border-b border-surface-container">
                <tr className="text-on-surface-variant text-[9px] font-bold uppercase tracking-widest">
                  <th className="px-4 md:px-6 py-3">Agency</th>
                  <th className="px-4 md:px-6 py-3 hidden sm:table-cell">State</th>
                  <th className="px-4 md:px-6 py-3 hidden md:table-cell">Year</th>
                  <th className="px-4 md:px-6 py-3">Vendor</th>
                  <th className="px-4 md:px-6 py-3 hidden lg:table-cell">Keyword</th>
                  <th className="px-4 md:px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container/30">
                {[...filteredTx]
                  .sort((a, b) => b.totalPrice - a.totalPrice)
                  .slice(0, 200)
                  .map((t, i) => (
                    <tr key={i} className="hover:bg-surface transition-colors">
                      <td className="px-4 md:px-6 py-2.5 text-xs font-bold text-primary truncate max-w-[280px]" title={t.agency}>
                        {t.agency}
                      </td>
                      <td className="px-4 md:px-6 py-2.5 text-xs text-on-surface-variant hidden sm:table-cell">
                        {t.stateCode}
                      </td>
                      <td className="px-4 md:px-6 py-2.5 text-xs text-on-surface-variant hidden md:table-cell">
                        {t.year}
                      </td>
                      <td className="px-4 md:px-6 py-2.5 text-xs text-primary truncate max-w-[160px]">
                        {t.company}
                      </td>
                      <td className="px-4 md:px-6 py-2.5 text-xs hidden lg:table-cell">
                        {t.keyword && (
                          <span className="px-1.5 py-0.5 rounded bg-secondary-fixed/30 text-secondary font-medium">
                            {t.keyword}
                          </span>
                        )}
                      </td>
                      <td className="px-4 md:px-6 py-2.5 text-xs md:text-sm font-bold text-primary text-right whitespace-nowrap">
                        {formatCurrency(t.totalPrice)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  );
}
