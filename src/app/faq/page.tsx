import { PublicShell } from "@/components/PublicShell";

export const metadata = {
  title: "FAQ — Argus",
  description: "Common questions about Argus, the data behind it, and how it gets to your team.",
};

const QA: { q: string; a: string }[] = [
  {
    q: "Where does the data come from?",
    a: "Public procurement filings — state and county procurement portals, contract award notices, and open-records postings. We normalize, deduplicate, and index them so your team can search across them without hopping between portals. The source filings are public; the stitching, ranking, and renewal radar on top is what you're paying for.",
  },
  {
    q: "How fresh is the data?",
    a: "We pull every supported portal at least daily. Most filings appear in your tenant within hours of being posted publicly. The renewal radar updates the same day a contract enters its window.",
  },
  {
    q: "Which states do you cover?",
    a: "Today we cover 9 states across the Southeast (FL, GA, SC, NC, VA, WV, MD, DC, TN). Expanding coverage is part of every onboarding conversation — if your territory needs another state, it's usually a 2-week add.",
  },
  {
    q: "Is my team's activity (filters, searches, alerts) private from other tenants?",
    a: "Yes. Each customer gets a tenant-scoped workspace at /<tenant>. The auth middleware verifies on every request that the signed cookie matches the tenant in the URL, so there is no path that serves another tenant's view with your credentials, or vice versa.",
  },
  {
    q: "Can I export data?",
    a: "Yes — CSV exports of the currently filtered transactions are available from the Discovery page and the Opportunities table on the dashboard. Exports are gated by a per-tenant password so you control who can pull data out.",
  },
  {
    q: "Do you integrate with Salesforce or HubSpot?",
    a: "On the roadmap. Today exports are CSV; native CRM sync is the next integration we'll ship once we have a design partner asking for it.",
  },
  {
    q: "What does pricing look like?",
    a: "Quoted per territory and seat count. There is no public sticker price because every team's mix of states, agencies, and product categories is different. A 15-minute scoping call gets you a number — see /pricing.",
  },
  {
    q: "How do I get my team set up?",
    a: "Email support@argus.bz with the rough shape of your territory. We'll book a scoping call, stand up your tenant within a day, and have your reps in a ranked target list by the end of the first week.",
  },
  {
    q: "Is there a free trial?",
    a: "We don't run a self-serve trial — every tenant is hand-tuned to the customer's ICP. The 15-minute walkthrough is the closest thing; if it's a fit we'll spin up a 14-day evaluation tenant with your states.",
  },
  {
    q: "What about security and privacy?",
    a: "Sessions use signed HttpOnly cookies, all traffic is HTTPS, and the procurement data is sourced from public filings — we don't ingest or store any customer-side data. See /security and /privacy for the details.",
  },
];

export default function FAQPage() {
  return (
    <PublicShell>
      <section className="max-w-[820px] mx-auto px-8 md:px-12 py-12 md:py-20">
        <div
          className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-4"
          style={{ color: "var(--accent)" }}
        >
          FAQ
        </div>
        <h1
          className="font-bold leading-[1.02] tracking-[-0.025em] mb-6"
          style={{ fontSize: "clamp(40px, 6.5vw, 60px)" }}
        >
          Questions we hear before the first call.
        </h1>
        <p className="text-[17px] leading-relaxed mb-12" style={{ color: "var(--ink-2)" }}>
          If yours isn&rsquo;t here, write me at{" "}
          <a href="mailto:support@argus.bz" style={{ color: "var(--accent)" }} className="underline">
            support@argus.bz
          </a>
          . I usually reply within a business day.
        </p>

        <div
          className="rounded-[18px] border bg-[var(--panel)] divide-y"
          style={{ borderColor: "var(--line)", borderRightColor: "var(--line)" }}
        >
          {QA.map((row, i) => (
            <details
              key={i}
              className="group p-6 md:p-7"
              style={{ borderColor: "var(--line)" }}
            >
              <summary
                className="cursor-pointer list-none flex items-start justify-between gap-6 font-semibold text-[17px] leading-[1.35] tracking-[-0.01em]"
                style={{ color: "var(--ink)" }}
              >
                <span>{row.q}</span>
                <span
                  className="shrink-0 mt-1 transition-transform group-open:rotate-180"
                  style={{ color: "var(--ink-3)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-[15px] leading-[1.65]" style={{ color: "var(--ink-2)" }}>
                {row.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
