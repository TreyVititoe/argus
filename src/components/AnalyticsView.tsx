"use client";

import { useState, useMemo } from "react";
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
import { Transaction, StateInfo } from "@/lib/types";
import { formatCurrency } from "@/lib/data-utils";
import rawData from "@/lib/data.json";
import AppShell from "./AppShell";
import PageHeader from "./PageHeader";
import StateTabs from "./StateTabs";

const allTransactions = rawData.transactions as Transaction[];
const allStates = rawData.states as StateInfo[];

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

export default function AnalyticsView() {
  const [selectedState, setSelectedState] = useState<string>("ALL");

  useClearFilters(() => {
    setSelectedState("ALL");
  });

  const filteredTx = useMemo(() => {
    if (selectedState === "ALL") return allTransactions;
    return allTransactions.filter((t) => t.stateCode === selectedState);
  }, [selectedState]);

  const years = useMemo(() => {
    const s = new Set<number>();
    for (const t of filteredTx) if (t.year) s.add(t.year);
    return Array.from(s).sort((a, b) => a - b);
  }, [filteredTx]);

  const spendByYear = useMemo(() => {
    const map = new Map<number, number>();
    for (const t of filteredTx) map.set(t.year, (map.get(t.year) || 0) + t.totalPrice);
    return years.map((y) => ({ year: String(y), spend: map.get(y) || 0 }));
  }, [filteredTx, years]);

  // Keyword battles — top 5 keywords across years
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

  // Competitor market share
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

  // Agency type breakdown
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

  // Price range distribution
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

      <div className="mb-6">
          <StateTabs
            states={allStates}
            selected={selectedState}
            onSelect={setSelectedState}
            total={allTransactions.length}
          />
        </div>

        {/* Spend by Year — full width */}
        <div className="bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm mb-6">
          <div className="mb-4">
            <h4 className="text-base md:text-lg font-headline font-bold text-primary">
              Spend by Year
            </h4>
            <p className="text-xs text-on-surface-variant">Total procurement spend over time</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendByYear} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
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
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Keyword Trends */}
        <div className="bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm mb-6">
          <div className="mb-4">
            <h4 className="text-base md:text-lg font-headline font-bold text-primary">Product Keyword Battles</h4>
            <p className="text-xs text-on-surface-variant">
              Top 5 products competing for market share
            </p>
          </div>
          <div className="h-[300px]">
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
                <Legend wrapperStyle={{ fontSize: "11px", color: "oklch(0.55 0.006 85)" }} />
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

        {/* Side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm">
            <div className="mb-4">
              <h4 className="text-base md:text-lg font-headline font-bold text-primary">
                Competitor Market Share
              </h4>
              <p className="text-xs text-on-surface-variant">Total spend by major competitor</p>
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
                  <Bar dataKey="value" fill="oklch(0.50 0.08 160)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm">
            <div className="mb-4">
              <h4 className="text-base md:text-lg font-headline font-bold text-primary">
                Spend by Agency Type
              </h4>
              <p className="text-xs text-on-surface-variant">State, county, K-12, higher ed, etc.</p>
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

        {/* Price Range Distribution */}
        <div className="bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm">
          <div className="mb-4">
            <h4 className="text-base md:text-lg font-headline font-bold text-primary">
              Deal Size Distribution
            </h4>
            <p className="text-xs text-on-surface-variant">Where the dollars are concentrated</p>
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
                <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
    </AppShell>
  );
}
