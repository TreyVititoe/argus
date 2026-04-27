// Tenant configuration — single source of truth for who can sign in and which dataset they see.
//
// To onboard a new tenant:
//   1. Add the domain → slug mapping to DOMAIN_TO_TENANT in src/lib/auth.ts
//   2. Add an entry below with the tenant's display name and dataset path
//   3. Optionally drop a logo at /public/<slug>.png and add an entry in src/components/TenantLogo.tsx
//
// Until step 2 is done, the tenant's dashboard renders an "indexing" empty state
// instead of showing another tenant's data.

import type { Transaction } from "./types";
import cohesityRaw from "./data.json";

export type TenantConfig = {
  slug: string;
  displayName: string;
  hasData: boolean;
};

export const TENANTS: Record<string, TenantConfig> = {
  cohesity: { slug: "cohesity", displayName: "Cohesity", hasData: true },
};

export function getTenantConfig(slug: string): TenantConfig {
  const known = TENANTS[slug.toLowerCase()];
  if (known) return known;
  return {
    slug: slug.toLowerCase(),
    displayName: slug.charAt(0).toUpperCase() + slug.slice(1),
    hasData: false,
  };
}

const cohesityTransactions = (cohesityRaw.transactions as Transaction[]).filter(
  (t) => t.competitor !== "Medical Platforms"
);

const TENANT_TRANSACTIONS: Record<string, Transaction[]> = {
  cohesity: cohesityTransactions,
};

export function getTenantTransactions(slug: string): Transaction[] {
  return TENANT_TRANSACTIONS[slug.toLowerCase()] ?? [];
}
