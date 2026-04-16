export interface Transaction {
  coverage: string;
  competitor: string;
  keyword: string;
  year: number;
  agency: string;
  state: string;
  stateCode: string;
  type: string;
  company: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  priceRange: string;
}

export interface StateInfo {
  code: string;
  name: string;
  transactionCount: number;
}

export type ContractStatus = "active" | "expiring" | "dormant";

export interface AgencySummary {
  name: string;
  type: string;
  topCompany: string;
  totalSpend: number;
  transactionCount: number;
  spendByYear: Record<number, number>;
  topKeywords: string[];
  lastPurchaseYear: number;
  yearsSinceLastPurchase: number;
  contractStatus: ContractStatus;
  opportunityScore: number;
}

export interface CompanySummary {
  name: string;
  totalSpend: number;
  agencyCount: number;
  transactionCount: number;
  spendByYear: Record<number, number>;
  topKeywords: string[];
  lastPurchaseYear: number;
}

export type SortMode = "amount" | "alpha" | "count" | "opportunity";
export type StatusFilter = "all" | "expiring" | "active" | "dormant";
