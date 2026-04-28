// Tenant + identity helpers used alongside Supabase Auth.
// Authentication itself is handled by Supabase; this module owns the
// domain-to-tenant mapping and small display-name utilities.

export type Session = {
  tenant: string;
  email: string;
};

// Canonical mapping of allowed email domains to tenant slugs.
export const DOMAIN_TO_TENANT: Record<string, string> = {
  "cohesity.com": "cohesity",
  "treyvititoe.com": "cohesity",
  // appreview@argus.bz is the App Store reviewer login.
  "argus.bz": "cohesity",
};

export function tenantForEmail(email: string): string | null {
  const m = email.trim().toLowerCase().match(/@([a-z0-9.-]+)$/);
  if (!m) return null;
  return DOMAIN_TO_TENANT[m[1]] ?? null;
}

export function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  if (!local) return "";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ");
}

export function initialsFromName(name: string): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
