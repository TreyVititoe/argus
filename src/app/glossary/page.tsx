import { PublicShell } from "@/components/PublicShell";

export const metadata = {
  title: "Glossary — Argus",
  description: "Public-sector procurement terms, in plain language.",
};

const TERMS: { t: string; d: string }[] = [
  { t: "Agency", d: "A government body that buys goods or services. Argus tracks federal, state, county, municipal, and special-district agencies (e.g., water management districts, school boards)." },
  { t: "Award", d: "A contract that has been signed between a government buyer and a vendor following an RFP, RFQ, or sole-source process. Awards are public filings and are the primary unit of data in Argus." },
  { t: "Cooperative purchasing", d: "An arrangement (e.g., NASPO ValuePoint, OMNIA Partners) that lets multiple agencies buy off a single negotiated contract, saving each agency the work of running its own procurement." },
  { t: "GSA Schedule", d: "A federal pre-negotiated catalog of products and services. Vendors on schedule can sell to federal agencies without each agency running a fresh RFP." },
  { t: "ICP", d: "Ideal Customer Profile. The criteria — size, sector, geography, product fit — that define which agencies are worth your reps' time." },
  { t: "IDIQ", d: "Indefinite Delivery / Indefinite Quantity. A contract structure where the buyer commits to a ceiling but draws against it as needs arise. Common in federal contracting." },
  { t: "Master Services Agreement (MSA)", d: "An umbrella contract that sets terms once, then individual purchases (statements of work, task orders) execute under it." },
  { t: "NASPO", d: "National Association of State Procurement Officials. Operates ValuePoint, the largest cooperative purchasing program for state government." },
  { t: "NIGP code", d: "A standardized commodity classification used by many state and local procurement systems to categorize what's being bought." },
  { t: "Public filing", d: "A procurement document made public by law — bid notices, award announcements, contract scans, change orders. The raw input to Argus." },
  { t: "Renewal window", d: "The period before an existing contract expires when the buyer is most likely to evaluate alternatives. Argus surfaces contracts entering this window 3-6 months ahead." },
  { t: "Reseller (channel partner)", d: "A company that resells a manufacturer's product to a government buyer (e.g., CDW-G, SHI, Insight Public Sector). Distinct from the underlying vendor." },
  { t: "RFI", d: "Request for Information. A pre-procurement signal where an agency surveys the market without committing to buy. Reading RFIs early is a leading indicator." },
  { t: "RFP", d: "Request for Proposal. The most common formal procurement vehicle — agencies publish requirements and vendors respond with priced bids." },
  { t: "RFQ", d: "Request for Quotation. A simpler, price-focused alternative to an RFP, used for commoditized purchases." },
  { t: "SLED", d: "State, Local, and Education. The non-federal public-sector buyer segment Argus is built for." },
  { t: "Sole source", d: "An award made without competitive bidding, typically because only one vendor can meet the requirement. Always public; sometimes contested." },
  { t: "Task order", d: "A specific purchase made under an existing master contract or IDIQ. Tracking task orders catches activity that bypasses fresh RFPs." },
  { t: "Vendor", d: "The manufacturer or original-source company whose product or service is ultimately delivered (e.g., Cohesity, Veeam, Rubrik). Distinct from the reseller of record on the award line." },
  { t: "Win rate", d: "The percentage of pursued opportunities a vendor wins. In Argus, derived from the share of agencies in your filter set that have an active contract with the named vendor." },
];

export default function GlossaryPage() {
  return (
    <PublicShell>
      <section className="max-w-[920px] mx-auto px-8 md:px-12 py-12 md:py-20">
        <div
          className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-4"
          style={{ color: "var(--accent)" }}
        >
          Glossary
        </div>
        <h1
          className="font-bold leading-[1.02] tracking-[-0.025em] mb-6"
          style={{ fontSize: "clamp(40px, 6.5vw, 60px)" }}
        >
          Procurement, in plain language.
        </h1>
        <p className="text-[17px] leading-relaxed mb-12 max-w-[680px]" style={{ color: "var(--ink-2)" }}>
          Public-sector buying has its own vocabulary. If you&rsquo;re new to SLED sales, start
          here. If you aren&rsquo;t, send this to the rep you&rsquo;re onboarding.
        </p>

        <dl
          className="rounded-[14px] border bg-[var(--panel)] divide-y"
          style={{ borderColor: "var(--line)" }}
        >
          {TERMS.map((row) => (
            <div
              key={row.t}
              className="grid grid-cols-12 gap-4 px-6 md:px-8 py-5"
              style={{ borderColor: "var(--line)" }}
            >
              <dt
                className="col-span-12 md:col-span-3 font-semibold text-[15px] tracking-[-0.01em]"
                style={{ color: "var(--ink)" }}
              >
                {row.t}
              </dt>
              <dd className="col-span-12 md:col-span-9 text-[14px] leading-[1.65]" style={{ color: "var(--ink-2)" }}>
                {row.d}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-14">
          <h2 className="font-semibold text-primary mb-3" style={{ fontSize: 22 }}>
            How a state government is structured
          </h2>
          <p className="text-[15px] leading-[1.65] mb-4" style={{ color: "var(--ink-2)" }}>
            Knowing the buying layer matters when you&rsquo;re reading an award. State agencies,
            cabinet functions, executive agencies, and local government each procure differently —
            and the source of an award line tells you which playbook fits.
          </p>
          <div
            className="rounded-[14px] border p-4 bg-[var(--panel)]"
            style={{ borderColor: "var(--line)" }}
          >
            <p className="text-[13px] mb-2" style={{ color: "var(--ink-3)" }}>
              Example: Florida government structure (Office of Program Policy Analysis &amp;
              Government Accountability, 2024).
            </p>
            <div
              className="aspect-[16/12] rounded-[10px] flex items-center justify-center text-[13px]"
              style={{ background: "var(--bg)", color: "var(--ink-3)", border: "1px dashed var(--line)" }}
            >
              Drop the chart at <code>/public/florida-gov-structure.png</code> and I&rsquo;ll wire it in.
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
