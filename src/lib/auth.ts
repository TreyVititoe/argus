// Edge-compatible signed session cookie.
// Value format: `<base64url(payload JSON)>.<base64url HMAC-SHA256(payload, AUTH_SECRET)>`
// Payload: { tenant: string, email: string }

export const TENANT_COOKIE_NAME = "argus_tenant";
export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type Session = {
  tenant: string;
  email: string;
};

const ENCODER = new TextEncoder();
const DECODER = new TextDecoder();

function base64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(input: string): Uint8Array {
  const pad = "=".repeat((4 - (input.length % 4)) % 4);
  const b64 = (input + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function hmac(data: string, secret: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    ENCODER.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, ENCODER.encode(data));
  return new Uint8Array(sig);
}

export async function signSession(session: Session): Promise<string> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not configured");
  const payload = base64url(ENCODER.encode(JSON.stringify(session)));
  const sig = await hmac(payload, secret);
  return `${payload}.${base64url(sig)}`;
}

export async function readSession(
  cookieValue: string | undefined | null
): Promise<Session | null> {
  if (!cookieValue) return null;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  const idx = cookieValue.lastIndexOf(".");
  if (idx <= 0 || idx === cookieValue.length - 1) return null;
  const payload = cookieValue.slice(0, idx);
  const sigB64 = cookieValue.slice(idx + 1);

  const expected = await hmac(payload, secret);
  let actual: Uint8Array;
  try {
    actual = fromBase64url(sigB64);
  } catch {
    return null;
  }
  if (!timingSafeEqual(expected, actual)) return null;

  try {
    const decoded = DECODER.decode(fromBase64url(payload));
    const parsed = JSON.parse(decoded) as Partial<Session>;
    if (
      !parsed ||
      typeof parsed.tenant !== "string" ||
      typeof parsed.email !== "string"
    ) {
      return null;
    }
    return { tenant: parsed.tenant, email: parsed.email };
  } catch {
    return null;
  }
}

// Canonical mapping of allowed email domains to tenant slugs.
export const DOMAIN_TO_TENANT: Record<string, string> = {
  "cohesity.com": "cohesity",
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
