import { Transaction, StateInfo } from "./types";
import original from "./data/original.json";
import cloud from "./data/cloud.json";

export interface DatasetStats {
  totalTransactions: number;
  totalSpend: number;
  uniqueAgencies: number;
  uniqueCompanies: number;
  stateCount: number;
}

// Each dataset is a self-contained list of transactions + the states present
// in it. The slug becomes a URL segment (/[company]/[dataset]/...) and the
// label is what the dataset switcher renders.
export interface Dataset {
  slug: string;
  label: string;
  short: string;
  description: string;
  transactions: Transaction[];
  states: StateInfo[];
  stats: DatasetStats;
}

export const DATASETS: Dataset[] = [
  {
    slug: "original",
    label: "Original",
    short: "Backup, storage, and data-protection vendors",
    description: "NetApp, Cohesity, Veeam, Dell PowerProtect, CommVault and the rest of the data-protection landscape across nine states.",
    transactions: original.transactions as Transaction[],
    states: original.states as StateInfo[],
    stats: original.stats as DatasetStats,
  },
  {
    slug: "cloud",
    label: "Cloud + SI",
    short: "Cloud providers and systems integrators",
    description: "AWS, Azure, GCP, OCI plus the global SIs (Accenture, Deloitte, KPMG, EY, IBM, NTT) — Florida only.",
    transactions: cloud.transactions as Transaction[],
    states: cloud.states as StateInfo[],
    stats: cloud.stats as DatasetStats,
  },
];

export const DEFAULT_DATASET = "original";

export function getDataset(slug: string | undefined): Dataset {
  return DATASETS.find((d) => d.slug === slug) ?? DATASETS[0];
}

export function isValidDatasetSlug(slug: string | undefined): boolean {
  return !!slug && DATASETS.some((d) => d.slug === slug);
}
