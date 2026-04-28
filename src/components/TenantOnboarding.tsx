import { TenantConfig } from "@/lib/tenants";
import AppShell from "./AppShell";
import PageHeader from "./PageHeader";

export default function TenantOnboarding({ tenant }: { tenant: TenantConfig }) {
  return (
    <AppShell>
      <PageHeader
        eyebrow={`Welcome · ${tenant.displayName}`}
        title="Your dataset is being indexed."
      />

      <div
        className="rounded-[14px] border bg-[var(--panel)] p-8 md:p-10 max-w-[760px]"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="flex items-start gap-4 mb-6">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--accent-bg)", color: "var(--accent)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              <path d="M12 7v5l3 2" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-[20px] tracking-[-0.015em] mb-1.5" style={{ color: "var(--ink)" }}>
              We&rsquo;re putting together {tenant.displayName}&rsquo;s view of public-sector procurement.
            </h2>
            <p className="text-[14px] leading-[1.6]" style={{ color: "var(--ink-2)" }}>
              Argus tunes each tenant&rsquo;s dataset to the states, agencies, and product categories
              that matter to your team. The first index typically takes 24-48 hours.
            </p>
          </div>
        </div>

        <div
          className="rounded-[12px] p-5 mb-6"
          style={{ background: "var(--bg)", border: "1px solid var(--line)" }}
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] mb-3" style={{ color: "var(--ink-3)" }}>
            What happens next
          </div>
          <ol className="space-y-3 text-[14px] leading-[1.6]" style={{ color: "var(--ink-2)" }}>
            <li className="flex gap-3">
              <span className="font-semibold shrink-0" style={{ color: "var(--accent)" }}>1.</span>
              <span>You&rsquo;ll get a scoping email confirming your states, ICP, and product keywords.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold shrink-0" style={{ color: "var(--accent)" }}>2.</span>
              <span>We ingest the matching public filings and run dedup + classification.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold shrink-0" style={{ color: "var(--accent)" }}>3.</span>
              <span>You get an email when this dashboard is live with your data.</span>
            </li>
          </ol>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <a
            href="mailto:support@argus.bz?subject=Argus%20onboarding%20for%20{tenant.displayName}"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] text-[14px] font-bold text-white"
            style={{ background: "oklch(0.68 0.07 160)" }}
          >
            Email us your scoping
          </a>
          <a
            href="/why-argus"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] text-[14px] font-medium border"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
          >
            What Argus does →
          </a>
        </div>
      </div>
    </AppShell>
  );
}
