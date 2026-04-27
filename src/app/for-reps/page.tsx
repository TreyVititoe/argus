import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";

export const metadata = {
  title: "For reps — Argus",
  description: "A weekly target list of expiring contracts in your territory — without the spreadsheet busywork.",
};

const VALUE_PROPS = [
  {
    h: "Mondays start with a ranked list",
    b: "Open Argus, set your state and year filter, and the dashboard surfaces this week's renewal-window agencies first. No more re-pulling spreadsheets every Monday morning.",
  },
  {
    h: "Search that actually finds the deal",
    b: "Type a vendor, a keyword, or an agency. The Discovery view searches across agency, reseller, vendor, keyword, and description in one go.",
  },
  {
    h: "Know who you're up against, by county",
    b: "Click any state to see competitor footprint and reseller share. Walk into the call knowing what the incumbent charges and how often they win.",
  },
  {
    h: "Export in one click for your CRM",
    b: "Filter to your week, hit Export CSV, and import to Salesforce or HubSpot. Back to selling in under a minute.",
  },
];

export default function ForRepsPage() {
  return (
    <PublicShell>
      <section className="max-w-[1100px] mx-auto px-8 md:px-12 py-12 md:py-20">
        <div
          className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-4"
          style={{ color: "var(--accent)" }}
        >
          For reps
        </div>
        <h1
          className="font-bold leading-[1.02] tracking-[-0.025em] mb-6 max-w-[920px]"
          style={{ fontSize: "clamp(40px, 6.5vw, 68px)" }}
        >
          Spend Monday selling, not scraping portals.
        </h1>
        <p className="text-[17px] leading-relaxed mb-14 max-w-[640px]" style={{ color: "var(--ink-2)" }}>
          Argus is a single workspace for the reps who chase public-sector contracts. The data is
          fresh, the renewal radar is tuned, and the search actually finds the deal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {VALUE_PROPS.map((p) => (
            <div
              key={p.h}
              className="rounded-[14px] border bg-[var(--panel)] p-7"
              style={{ borderColor: "var(--line)" }}
            >
              <h3 className="font-semibold text-[22px] leading-[1.2] tracking-[-0.015em] mb-2.5">
                {p.h}
              </h3>
              <p className="text-[14px] leading-[1.6]" style={{ color: "var(--ink-2)" }}>
                {p.b}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex items-center gap-3 flex-wrap">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[10px] text-[14px] font-bold text-white"
            style={{ background: "oklch(0.68 0.07 160)" }}
          >
            Sign in →
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[10px] text-[14px] font-medium border"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
          >
            FAQ
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
