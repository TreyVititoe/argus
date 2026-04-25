import Link from "next/link";

const STEPS = [
  {
    n: "01",
    title: "We scope your territory",
    body: "A 15-minute call to map the states, agencies, product categories, and competitor set you actually care about. No generic onboarding deck.",
  },
  {
    n: "02",
    title: "We stand up your workspace",
    body: "Within a day, your team gets a private tenant — like /cohesity — pre-loaded with the historical filings that match your ICP and ready to filter.",
  },
  {
    n: "03",
    title: "Weekly target lists, every Monday",
    body: "Renewal alerts, ranked opportunities, and competitor wins delivered to your inbox or piped into Salesforce / HubSpot. Pricing scales with seats and territory size.",
  },
];

export default function PricingPage() {
  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      <header className="flex items-center justify-between px-8 md:px-12 py-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="block w-8 h-8 rounded-[7px] overflow-hidden shadow-sm">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="8" width="84" height="84" rx="22" fill="#faf8f3" />
              <rect x="46" y="20" width="8" height="60" rx="4" fill="#4A7A67" />
              <circle cx="50" cy="50" r="18" fill="#4A7A67" />
              <circle cx="50" cy="50" r="6" fill="#faf8f3" />
            </svg>
          </span>
          <span className="text-[18px] font-semibold tracking-tight">Argus</span>
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[14px] font-bold text-white"
          style={{ background: "oklch(0.68 0.07 160)" }}
        >
          Sign In
        </Link>
      </header>

      <section className="flex-1 max-w-[1200px] w-full mx-auto px-8 md:px-12 py-12 md:py-20">
        <div
          className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-4"
          style={{ color: "var(--accent)" }}
        >
          Pricing
        </div>
        <h1
          className="font-bold leading-[1.02] tracking-[-0.025em] mb-5 max-w-[860px]"
          style={{ fontSize: "clamp(40px, 6.5vw, 72px)" }}
        >
          Quoted to your territory, not pulled from a sticker price.
        </h1>
        <p className="text-[17px] leading-relaxed mb-12 max-w-[640px]" style={{ color: "var(--ink-2)" }}>
          Every team's procurement footprint is different. We build a price that maps to the
          states, vendors, and seat count you actually need — and there's no public sticker price
          to argue about.
        </p>

        <div
          className="rounded-[18px] border bg-[var(--panel)] p-8 md:p-12"
          style={{ borderColor: "var(--line)" }}
        >
          <div
            className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-3"
            style={{ color: "var(--accent)" }}
          >
            How it works
          </div>
          <h2
            className="font-bold leading-[1.05] tracking-[-0.02em] mb-2 max-w-[720px]"
            style={{ fontSize: "clamp(28px, 3.4vw, 40px)" }}
          >
            From your first call to your first ranked target list, in one week.
          </h2>
          <p className="text-[15px] mb-10 max-w-[640px]" style={{ color: "var(--ink-3)" }}>
            We do the heavy lifting on data. You point us at your territory and let your reps work
            from a list that's actually current.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0 border-t" style={{ borderColor: "var(--line)" }}>
            {STEPS.map((step, i) => (
              <div
                key={step.n}
                className={`pt-6 pb-6 md:pt-8 md:pb-8 ${i > 0 ? "md:pl-8 md:border-l border-t md:border-t-0" : "md:pr-8"}`}
                style={{ borderColor: "var(--line)" }}
              >
                <div className="font-semibold text-[20px] mb-4" style={{ color: "var(--accent)" }}>
                  {step.n}
                </div>
                <h3 className="font-semibold text-[22px] leading-[1.2] tracking-[-0.015em] mb-2.5">
                  {step.title}
                </h3>
                <p className="text-[14px] leading-[1.55]" style={{ color: "var(--ink-2)" }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ borderColor: "var(--line)" }}>
            <div>
              <h3 className="font-bold text-[24px] leading-tight tracking-[-0.015em] mb-1.5">
                Ready for a quote?
              </h3>
              <p className="text-[14px]" style={{ color: "var(--ink-3)" }}>
                One short reply with the basics — territory, team size, when you'd want to start.
              </p>
            </div>
            <a
              href="mailto:me@treyvititoe.com?subject=Argus%20pricing%20inquiry"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[10px] text-[15px] font-bold text-white transition-transform hover:-translate-y-0.5 shrink-0"
              style={{ background: "oklch(0.68 0.07 160)" }}
            >
              Contact for pricing →
            </a>
          </div>
        </div>
      </section>

      <footer
        className="px-8 md:px-12 py-6 text-[13px] border-t"
        style={{ color: "var(--ink-3)", borderColor: "var(--line)" }}
      >
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <Link href="/" style={{ color: "var(--ink-3)" }}>
            ← Back to Argus
          </Link>
          <div>© {new Date().getFullYear()} Argus Intelligence</div>
        </div>
      </footer>
    </main>
  );
}
