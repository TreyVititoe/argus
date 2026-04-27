import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";

export const metadata = {
  title: "Why Argus — Argus",
  description: "How Argus replaces the spreadsheet stack public-sector reps use today.",
};

const ROWS: { with: string; argus: string }[] = [
  {
    with: "Cobble together state portals, scrape PDFs, paste into a spreadsheet.",
    argus: "All public filings normalized, deduped, and live the moment they hit a portal.",
  },
  {
    with: "A rep finds a renewal three months too late, after the RFP closes.",
    argus: "Renewal radar surfaces contracts the day they enter their renewal window.",
  },
  {
    with: "A spreadsheet that\u2019s a snapshot of one Friday, sorted manually.",
    argus: "Sortable tables, ranked opportunities, filters that recompute live.",
  },
  {
    with: "Competitor share = guesses based on tribal knowledge.",
    argus: "Spend share by vendor, by state, by year \u2014 tied to actual award lines.",
  },
  {
    with: "When the rep leaves, the institutional pipeline leaves with them.",
    argus: "Tenant-scoped workspace your team owns, with exportable filtered datasets.",
  },
];

export default function WhyArgusPage() {
  return (
    <PublicShell>
      <section className="max-w-[1100px] mx-auto px-8 md:px-12 py-12 md:py-20">
        <div
          className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-4"
          style={{ color: "var(--accent)" }}
        >
          Why Argus
        </div>
        <h1
          className="font-bold leading-[1.02] tracking-[-0.025em] mb-6 max-w-[940px]"
          style={{ fontSize: "clamp(40px, 6.5vw, 72px)" }}
        >
          The spreadsheet stack costs you the deals you never see.
        </h1>
        <p className="text-[17px] leading-relaxed mb-12 max-w-[680px]" style={{ color: "var(--ink-2)" }}>
          Public-sector procurement isn&rsquo;t a data problem. It&rsquo;s a freshness and ranking
          problem. Here&rsquo;s what changes when you stop running it on tab-switching.
        </p>

        <div
          className="rounded-[18px] border bg-[var(--panel)] overflow-hidden"
          style={{ borderColor: "var(--line)" }}
        >
          <div
            className="grid grid-cols-12 px-6 md:px-8 py-4 text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ color: "var(--ink-3)", borderBottom: "1px solid var(--line)" }}
          >
            <div className="col-span-6">Today, with spreadsheets</div>
            <div className="col-span-6 md:col-span-6 pl-4 md:pl-6" style={{ color: "var(--accent)" }}>
              With Argus
            </div>
          </div>
          {ROWS.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-12 px-6 md:px-8 py-6 md:py-7 gap-4 md:gap-6"
              style={{
                borderBottom: i === ROWS.length - 1 ? undefined : "1px solid var(--line)",
              }}
            >
              <div className="col-span-12 md:col-span-6 text-[15px] leading-[1.55]" style={{ color: "var(--ink-3)" }}>
                {row.with}
              </div>
              <div
                className="col-span-12 md:col-span-6 text-[15px] leading-[1.55] font-medium md:pl-6 md:border-l"
                style={{ color: "var(--ink)", borderColor: "var(--line)" }}
              >
                {row.argus}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex items-center gap-3 flex-wrap">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[10px] text-[14px] font-bold text-white"
            style={{ background: "oklch(0.68 0.07 160)" }}
          >
            See it in your tenant →
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[10px] text-[14px] font-medium border"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
          >
            Pricing
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
