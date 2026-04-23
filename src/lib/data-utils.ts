import { Transaction, AgencySummary, CompanySummary, ContractStatus } from "./types";

// Sales heuristic: typical government contracts are 3-5 years.
// Agencies whose last purchase was 3+ years ago are prime renewal targets.
export const CURRENT_YEAR = new Date().getFullYear();
const RENEWAL_WINDOW_MIN = 3;
const RENEWAL_WINDOW_MAX = 5;
const SIGNIFICANT_SPEND = 10_000;

export function classifyContractStatus(
  lastPurchaseYear: number,
  totalSpend: number
): ContractStatus {
  const yearsSince = CURRENT_YEAR - lastPurchaseYear;
  if (yearsSince <= 2) return "active";
  if (
    yearsSince >= RENEWAL_WINDOW_MIN &&
    yearsSince <= RENEWAL_WINDOW_MAX &&
    totalSpend >= SIGNIFICANT_SPEND
  ) {
    return "expiring";
  }
  return "dormant";
}

// Score rewards historical spend + recency-of-expiring-window
function opportunityScore(
  status: ContractStatus,
  totalSpend: number,
  yearsSinceLastPurchase: number
): number {
  if (status !== "expiring") return 0;
  // Peak score when 3-4 years have passed (mid renewal window)
  const recencyFactor = 1 - Math.abs(yearsSinceLastPurchase - 3.5) / 2;
  return totalSpend * Math.max(recencyFactor, 0.3);
}

export function summarizeByAgency(transactions: Transaction[]): AgencySummary[] {
  const map = new Map<string, {
    type: string;
    totalSpend: number;
    transactionCount: number;
    spendByYear: Record<number, number>;
    companyCounts: Map<string, number>;
    keywordCounts: Map<string, number>;
  }>();

  for (const t of transactions) {
    let entry = map.get(t.agency);
    if (!entry) {
      entry = {
        type: t.type,
        totalSpend: 0,
        transactionCount: 0,
        spendByYear: {},
        companyCounts: new Map(),
        keywordCounts: new Map(),
      };
      map.set(t.agency, entry);
    }
    entry.totalSpend += t.totalPrice;
    entry.transactionCount += 1;
    entry.spendByYear[t.year] = (entry.spendByYear[t.year] || 0) + t.totalPrice;
    entry.companyCounts.set(t.company, (entry.companyCounts.get(t.company) || 0) + t.totalPrice);
    if (t.keyword) {
      entry.keywordCounts.set(t.keyword, (entry.keywordCounts.get(t.keyword) || 0) + t.totalPrice);
    }
  }

  return Array.from(map.entries()).map(([name, e]) => {
    const topCompany = [...e.companyCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "";
    const topKeywords = [...e.keywordCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k]) => k);
    const years = Object.keys(e.spendByYear).map(Number).filter((y) => y > 0);
    const lastPurchaseYear = years.length > 0 ? Math.max(...years) : 0;
    const yearsSinceLastPurchase = CURRENT_YEAR - lastPurchaseYear;
    const contractStatus = classifyContractStatus(lastPurchaseYear, e.totalSpend);
    return {
      name,
      type: e.type,
      topCompany,
      totalSpend: e.totalSpend,
      transactionCount: e.transactionCount,
      spendByYear: e.spendByYear,
      topKeywords,
      lastPurchaseYear,
      yearsSinceLastPurchase,
      contractStatus,
      opportunityScore: opportunityScore(contractStatus, e.totalSpend, yearsSinceLastPurchase),
    };
  });
}

export function summarizeByCompany(transactions: Transaction[]): CompanySummary[] {
  const map = new Map<string, {
    totalSpend: number;
    transactionCount: number;
    spendByYear: Record<number, number>;
    agencies: Set<string>;
    keywordCounts: Map<string, number>;
  }>();

  for (const t of transactions) {
    let entry = map.get(t.company);
    if (!entry) {
      entry = {
        totalSpend: 0,
        transactionCount: 0,
        spendByYear: {},
        agencies: new Set(),
        keywordCounts: new Map(),
      };
      map.set(t.company, entry);
    }
    entry.totalSpend += t.totalPrice;
    entry.transactionCount += 1;
    entry.spendByYear[t.year] = (entry.spendByYear[t.year] || 0) + t.totalPrice;
    entry.agencies.add(t.agency);
    if (t.keyword) {
      entry.keywordCounts.set(t.keyword, (entry.keywordCounts.get(t.keyword) || 0) + t.totalPrice);
    }
  }

  return Array.from(map.entries()).map(([name, e]) => {
    const topKeywords = [...e.keywordCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k]) => k);
    const years = Object.keys(e.spendByYear).map(Number).filter((y) => y > 0);
    const lastPurchaseYear = years.length > 0 ? Math.max(...years) : 0;
    return {
      name,
      totalSpend: e.totalSpend,
      agencyCount: e.agencies.size,
      transactionCount: e.transactionCount,
      spendByYear: e.spendByYear,
      topKeywords,
      lastPurchaseYear,
    };
  });
}

export function summarizeByVendor(transactions: Transaction[]): { name: string; totalSpend: number; transactionCount: number }[] {
  const map = new Map<string, { totalSpend: number; transactionCount: number }>();
  for (const t of transactions) {
    if (!t.competitor) continue;
    let entry = map.get(t.competitor);
    if (!entry) {
      entry = { totalSpend: 0, transactionCount: 0 };
      map.set(t.competitor, entry);
    }
    entry.totalSpend += t.totalPrice;
    entry.transactionCount += 1;
  }
  return Array.from(map.entries())
    .map(([name, e]) => ({ name, ...e }))
    .sort((a, b) => b.totalSpend - a.totalSpend);
}

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  return `$${amount.toFixed(0)}`;
}

export function formatFullCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}
