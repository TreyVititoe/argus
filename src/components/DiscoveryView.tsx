"use client";

import { useState, useMemo } from "react";
import { Transaction, StateInfo } from "@/lib/types";
import { formatCurrency, formatFullCurrency } from "@/lib/data-utils";
import rawData from "@/lib/data.json";
import AppShell from "./AppShell";
import StateTabs from "./StateTabs";

const allTransactions = rawData.transactions as Transaction[];
const allStates = rawData.states as StateInfo[];

export default function DiscoveryView() {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [keywordFilter, setKeywordFilter] = useState<string>("");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const keywords = useMemo(() => {
    const s = new Set<string>();
    for (const t of allTransactions) if (t.keyword) s.add(t.keyword);
    return Array.from(s).sort();
  }, []);

  const years = useMemo(() => {
    const s = new Set<number>();
    for (const t of allTransactions) if (t.year) s.add(t.year);
    return Array.from(s).sort((a, b) => a - b);
  }, []);

  const filtered = useMemo(() => {
    let result = allTransactions;
    if (selectedState !== "ALL") {
      result = result.filter((t) => t.stateCode === selectedState);
    }
    if (yearFilter) {
      result = result.filter((t) => t.year === yearFilter);
    }
    if (keywordFilter) {
      result = result.filter((t) => t.keyword === keywordFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.agency.toLowerCase().includes(q) ||
          t.company.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.keyword.toLowerCase().includes(q)
      );
    }
    return [...result].sort((a, b) => b.totalPrice - a.totalPrice);
  }, [selectedState, yearFilter, keywordFilter, search]);

  const totalSpend = filtered.reduce((s, t) => s + t.totalPrice, 0);

  return (
    <AppShell search={search} onSearchChange={setSearch}>
      <section className="px-4 md:px-8 py-6 md:py-8 max-w-[1440px] mx-auto">
        <div className="mb-4">
          <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-1">
            Transaction Explorer
          </span>
          <h3 className="text-2xl md:text-3xl font-headline font-extrabold text-primary tracking-tight">
            Discovery
          </h3>
          <p className="text-sm text-on-surface-variant mt-1">
            {filtered.length.toLocaleString()} transactions &middot; {formatCurrency(totalSpend)}
          </p>
        </div>

        <div className="mb-4">
          <StateTabs
            states={allStates}
            selected={selectedState}
            onSelect={setSelectedState}
            total={allTransactions.length}
          />
        </div>

        {/* Filters */}
        <div className="mb-4 bg-surface-container-lowest rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md bg-surface-container-low rounded-xl px-3 py-2">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: "18px" }}>
                search
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search agency, vendor, description, keyword..."
                className="bg-transparent outline-none text-sm w-full placeholder:text-on-surface-variant"
              />
            </div>

            <select
              value={yearFilter || ""}
              onChange={(e) => setYearFilter(e.target.value ? Number(e.target.value) : null)}
              className="bg-surface-container-low rounded-xl px-3 py-2 text-sm outline-none"
            >
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <select
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
              className="bg-surface-container-low rounded-xl px-3 py-2 text-sm outline-none max-w-[200px]"
            >
              <option value="">All keywords</option>
              {keywords.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>

            {(yearFilter || keywordFilter || search) && (
              <button
                onClick={() => {
                  setYearFilter(null);
                  setKeywordFilter("");
                  setSearch("");
                }}
                className="text-secondary font-bold text-xs hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto max-h-[calc(100vh-360px)] overflow-y-auto">
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
                {filtered.slice(0, 500).map((t, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedTx(t)}
                    className="hover:bg-surface cursor-pointer transition-colors"
                  >
                    <td className="px-4 md:px-6 py-3">
                      <div
                        className="font-bold text-primary text-xs md:text-sm truncate max-w-[200px] md:max-w-[300px]"
                        title={t.agency}
                      >
                        {t.agency}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3 text-xs text-on-surface-variant hidden sm:table-cell">
                      {t.stateCode}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-xs text-on-surface-variant hidden md:table-cell">
                      {t.year}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-xs text-primary truncate max-w-[160px]">
                      {t.company}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-xs hidden lg:table-cell">
                      {t.keyword && (
                        <span className="px-1.5 py-0.5 rounded bg-secondary-fixed/30 text-secondary font-medium">
                          {t.keyword}
                        </span>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-3 text-xs md:text-sm font-bold text-primary text-right whitespace-nowrap">
                      {formatCurrency(t.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length > 500 && (
            <div className="px-4 md:px-6 py-3 bg-surface-container-low/30 border-t border-surface-container text-xs text-on-surface-variant">
              Showing top 500 of {filtered.length.toLocaleString()} — narrow filters to see more
            </div>
          )}
        </div>

        {/* Transaction detail drawer */}
        {selectedTx && (
          <div
            onClick={() => setSelectedTx(null)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-container-lowest rounded-xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
                    Transaction Detail
                  </div>
                  <h3 className="font-headline font-bold text-lg text-primary">{selectedTx.agency}</h3>
                </div>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="text-on-surface-variant hover:text-primary p-1"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
                    close
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Vendor
                  </div>
                  <div className="font-bold text-primary">{selectedTx.company}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Amount
                  </div>
                  <div className="font-bold text-primary">{formatFullCurrency(selectedTx.totalPrice)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Year
                  </div>
                  <div className="font-bold text-primary">{selectedTx.year}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    State
                  </div>
                  <div className="font-bold text-primary">{selectedTx.state}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Type
                  </div>
                  <div className="font-bold text-primary">{selectedTx.type}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                    Quantity × Unit
                  </div>
                  <div className="font-bold text-primary">
                    {selectedTx.quantity} × {formatCurrency(selectedTx.unitPrice)}
                  </div>
                </div>
                {selectedTx.keyword && (
                  <div className="col-span-2 md:col-span-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                      Keyword
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded bg-secondary-fixed/30 text-secondary font-medium text-xs">
                      {selectedTx.keyword}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Description
                </div>
                <p className="text-sm text-primary leading-relaxed">{selectedTx.description || "—"}</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
