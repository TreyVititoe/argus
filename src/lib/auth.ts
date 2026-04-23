// Edge-compatible tenant session cookie helpers.
// Cookie value format: `<tenant>.<base64url HMAC-SHA256(tenant, AUTH_SECRET)>`.
// HttpOnly + signed, so tampering with the tenant slug invalidates the cookie.

export const TENANT_COOKIE_NAME = "argus_tenant";
export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const ENCODER = new TextEncoder();

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

export async function signTenant(tenant: string): Promise<string> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not configured");
  const sig = await hmac(tenant, secret);
  return `${tenant}.${base64url(sig)}`;
}

export async function verifyTenantCookie(
  cookieValue: string | undefined | null
): Promise<string | null> {
  if (!cookieValue) return null;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  const idx = cookieValue.lastIndexOf(".");
  if (idx <= 0 || idx === cookieValue.length - 1) return null;
  const tenant = cookieValue.slice(0, idx);
  const sigB64 = cookieValue.slice(idx + 1);
  const expected = await hmac(tenant, secret);
  let actual: Uint8Array;
  try {
    actual = fromBase64url(sigB64);
  } catch {
    return null;
  }
  if (!timingSafeEqual(expected, actual)) return null;
  return tenant;
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
