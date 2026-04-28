import { PublicShell } from "@/components/PublicShell";

export const metadata = {
  title: "Status — Argus",
  description: "Current operational status of Argus and our hosting provider.",
};

export default function StatusPage() {
  return (
    <PublicShell>
      <section className="max-w-[820px] mx-auto px-8 md:px-12 py-12 md:py-20">
        <div
          className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-4"
          style={{ color: "var(--accent)" }}
        >
          Status
        </div>
        <h1
          className="font-bold leading-[1.05] tracking-[-0.025em] mb-6"
          style={{ fontSize: "clamp(36px, 5.5vw, 56px)" }}
        >
          All systems operational.
        </h1>

        <div
          className="rounded-[14px] border bg-[var(--panel)] p-6 mb-10"
          style={{ borderColor: "var(--line)" }}
        >
          <div className="flex items-center gap-3 mb-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ background: "var(--pos)" }}
            />
            <span className="font-semibold text-[16px] text-primary">Argus application</span>
          </div>
          <p className="text-[14px] ml-[22px]" style={{ color: "var(--ink-3)" }}>
            Targeting 99.9% monthly availability. See{" "}
            <a href="/sla" style={{ color: "var(--accent)" }} className="underline">SLA</a> for service credit terms.
          </p>
        </div>

        <h2 className="font-semibold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Hosting provider
        </h2>
        <p className="text-[15px] leading-[1.65] mb-3" style={{ color: "var(--ink-2)" }}>
          Argus runs on Vercel&rsquo;s edge network. For real-time incidents on the underlying
          infrastructure, the authoritative source is Vercel&rsquo;s status page:
        </p>
        <a
          href="https://www.vercel-status.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[14px] font-medium border transition-colors"
          style={{ borderColor: "var(--line)", color: "var(--ink)" }}
        >
          vercel-status.com
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M7 17 17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>

        <h2 className="font-semibold text-primary mt-12 mb-3" style={{ fontSize: 22 }}>
          Reporting an issue
        </h2>
        <p className="text-[15px] leading-[1.65]" style={{ color: "var(--ink-2)" }}>
          If you&rsquo;re seeing degraded performance or an outage that isn&rsquo;t reflected here,
          email{" "}
          <a href="mailto:support@argus.bz" style={{ color: "var(--accent)" }} className="underline">
            support@argus.bz
          </a>{" "}
          with the time, the URL, and (if you can grab it) a network screenshot.
        </p>
      </section>
    </PublicShell>
  );
}
