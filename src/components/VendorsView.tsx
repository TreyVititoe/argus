"use client";

import { useMemo, useState } from "react";
import { Transaction, StateInfo } from "@/lib/types";
import { formatCurrency } from "@/lib/data-utils";
import rawData from "@/lib/data.json";
import AppShell from "./AppShell";
import PageHeader from "./PageHeader";
import StateTabs from "./StateTabs";

const allTransactions = rawData.transactions as Transaction[];
const allStates = rawData.states as StateInfo[];

const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

interface VendorRow {
  name: string;
  totalSpend: number;
  transactionCount: number;
  agencyCount: number;
  resellerCount: number;
  spendByYear: Record<number, number>;
  lastPurchaseYear: number;
  topResellers: { name: string; spend: number }[];
}

function summarizeVendors(txs: Transaction[]): VendorRow[] {
  const map = new Map<
    string,
    {
      totalSpend: number;
      transactionCount: number;
      agencies: Set<string>;
      resellerCounts: Map<string, number>;
      spendByYear: Record<number, number>;
    }
  >();
  for (const t of txs) {
    const key = t.competitor || t.keyword;
    if (!key) continue;
    let e = map.get(key);
    if (!e) {
      e = {
        totalSpend: 0,
        transactionCount: 0,
        agencies: new Set(),
        resellerCounts: new Map(),
        spendByYear: {},
      };
      map.set(key, e);
    }
    e.totalSpend += t.totalPrice;
    e.transactionCount += 1;
    e.agencies.add(t.agency);
    e.resellerCounts.set(t.company, (e.resellerCounts.get(t.company) || 0) + t.totalPrice);
    e.spendByYear[t.year] = (e.spendByYear[t.year] || 0) + t.totalPrice;
  }

  return Array.from(map.entries())
    .map(([name, e]) => {
      const years = Object.keys(e.spendByYear).map(Number).filter((y) => y > 0);
      const lastPurchaseYear = years.length ? Math.max(...years) : 0;
      const topResellers = [...e.resellerCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([n, spend]) => ({ name: n, spend }));
      return {
        name,
        totalSpend: e.totalSpend,
        transactionCount: e.transactionCount,
        agencyCount: e.agencies.size,
        resellerCount: e.resellerCounts.size,
        spendByYear: e.spendByYear,
        lastPurchaseYear,
        topResellers,
      };
    })
    .sort((a, b) => b.totalSpend - a.totalSpend);
}

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

export default function VendorsView() {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredTx = useMemo(() => {
    if (selectedState === "ALL") return allTransactions;
    return allTransactions.filter((t) => t.stateCode === selectedState);
  }, [selectedState]);

  const vendors = useMemo(() => {
    const all = summarizeVendors(filteredTx);
    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all.filter((v) => v.name.toLowerCase().includes(q));
  }, [filteredTx, search]);

  const totalSpend = vendors.reduce((s, v) => s + v.totalSpend, 0);
  const maxSpend = vendors[0]?.totalSpend || 1;

  return (
    <AppShell search={search} onSearchChange={setSearch}>
      <PageHeader
        eyebrow="Vendor Database"
        title="Vendors"
        meta={`${vendors.length} vendors · ${formatCurrency(totalSpend)} tracked spend`}
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
          <span className="text-[11px] text-on-surface-variant">{vendors.length} results</span>
        </div>

        <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
          {vendors.map((v, i) => {
            const isOpen = expanded === v.name;
            return (
              <div key={v.name}>
                <div
                  onClick={() => setExpanded(isOpen ? null : v.name)}
                  className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 cursor-pointer transition-colors border-b border-surface-container/30 ${
                    isOpen ? "bg-surface-container-low" : "hover:bg-surface"
                  }`}
                >
                  <div className="w-7 text-xs font-bold text-on-surface-variant text-right shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-primary text-sm truncate">{v.name}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-on-surface-variant">
                      <span>{v.agencyCount} agencies</span>
                      <span>{v.resellerCount} resellers</span>
                      <span>{v.transactionCount.toLocaleString()} txns</span>
                      <span>last {v.lastPurchaseYear || "—"}</span>
                    </div>
                  </div>
                  <div className="w-24 md:w-32 hidden md:block">
                    <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                      <div
                        className="h-full bg-secondary"
                        style={{ width: `${Math.min((v.totalSpend / maxSpend) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <MiniSparkline data={v.spendByYear} />
                  </div>
                  <div className="w-20 text-right shrink-0">
                    <div className="font-bold text-primary text-sm">{formatCurrency(v.totalSpend)}</div>
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
                    <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                      Top Resellers
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                      {v.topResellers.map((r) => (
                        <div key={r.name} className="flex items-center justify-between gap-2">
                          <span className="text-primary truncate">{r.name}</span>
                          <span className="font-bold text-primary shrink-0">{formatCurrency(r.spend)}</span>
                        </div>
                      ))}
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
