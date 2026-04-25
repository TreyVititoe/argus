import { PublicShell, ProseSection } from "@/components/PublicShell";

export const metadata = {
  title: "Security — Argus",
  description: "How we store, transmit, and gate access to your data.",
};

export default function SecurityPage() {
  return (
    <PublicShell>
      <ProseSection eyebrow="Security" title="Public data, handled like it isn't.">
        <p>
          The contract data inside Argus is sourced from public filings — but the views, ICP
          definitions, alerts, and rep activity layered on top are unique to your team. We treat
          all of it as confidential.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Hosting & transit
        </h2>
        <p>
          Argus runs on Vercel's edge network. All requests are served over HTTPS with TLS 1.2+;
          HTTP requests are redirected automatically. Static assets are served from a global CDN.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Authentication & sessions
        </h2>
        <p>
          Tenant sessions are bound to a signed cookie (HMAC-SHA256, HttpOnly, Secure,
          SameSite=Lax) that expires after 7 days. Edge middleware checks the signature on every
          authenticated request before the page renders, so tampered cookies are rejected before
          any data is read.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Tenant isolation
        </h2>
        <p>
          Each customer has their own URL namespace (e.g. <code>/cohesity</code>). Middleware
          confirms the cookie's tenant matches the URL on every request — there is no path that
          serves another tenant's data with a Cohesity cookie, or vice versa.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Data export
        </h2>
        <p>
          CSV export is gated by a separate password issued per customer. The password lives only
          in server-side environment variables, never in the browser bundle, and is rotated on
          request.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Reporting an issue
        </h2>
        <p>
          Found something? Email{" "}
          <a href="mailto:me@treyvititoe.com" style={{ color: "var(--accent)" }} className="underline">
            me@treyvititoe.com
          </a>{" "}
          with details. We'll respond within one business day.
        </p>
      </ProseSection>
    </PublicShell>
  );
}
