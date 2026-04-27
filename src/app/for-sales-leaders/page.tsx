import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";

export const metadata = {
  title: "For sales leaders — Argus",
  description: "Forecast, territory planning, and rep accountability for public-sector sales teams.",
};

const VALUE_PROPS = [
  {
    h: "Forecast a quarter ahead, not a week",
    b: "Renewal windows are the single most predictable signal in public-sector sales. Argus turns that signal into a quarterly target list each rep is already working — so your forecast stops depending on the rep's gut.",
  },
  {
    h: "Territory rebalancing in an afternoon",
    b: "See, by state and by sector, where pipeline is concentrated and where it isn't. Reassign accounts based on data, not seniority — and prove the change with the leaderboard a quarter later.",
  },
  {
    h: "Lose fewer deals to silent renewals",
    b: "The deals you lose loudest are the ones you never see. Renewal alerts fire 3-6 months before a public RFP — long enough to actually run a play.",
  },
  {
    h: "An audit trail your CFO trusts",
    b: "Every contract value, every keyword, every reseller is sourced from a public filing. When the deal review asks 'how do we know?', the answer is one click away.",
  },
];

export default function ForSalesLeadersPage() {
  return (
    <PublicShell>
      <section className="max-w-[1100px] mx-auto px-8 md:px-12 py-12 md:py-20">
        <div
          className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-4"
          style={{ color: "var(--accent)" }}
        >
          For sales leaders
        </div>
        <h1
          className="font-bold leading-[1.02] tracking-[-0.025em] mb-6 max-w-[920px]"
          style={{ fontSize: "clamp(40px, 6.5vw, 68px)" }}
        >
          Manage the territory, not the rep&rsquo;s spreadsheet.
        </h1>
        <p className="text-[17px] leading-relaxed mb-14 max-w-[640px]" style={{ color: "var(--ink-2)" }}>
          Argus gives sales leadership a live, tenant-scoped view of every public contract in their
          territory — so forecasting, rebalancing, and rep accountability stop depending on whose
          turn it is to update the sheet.
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
            See it on your territory →
          </Link>
          <Link
            href="/why-argus"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[10px] text-[14px] font-medium border"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
          >
            Argus vs. spreadsheets
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
