import { PublicShell } from "@/components/PublicShell";

export const metadata = {
  title: "Subprocessors — Argus",
  description: "Third-party services Argus uses to operate the platform.",
};

const SUBPROCESSORS = [
  {
    name: "Vercel",
    purpose: "Application hosting, edge middleware, CDN, deploy logs.",
    location: "United States (global edge network).",
    url: "https://vercel.com/legal/dpa",
  },
  {
    name: "Google Fonts",
    purpose: "Serves the Inter typeface used across the product.",
    location: "Global CDN.",
    url: "https://fonts.google.com/about",
  },
  {
    name: "GoDaddy",
    purpose: "Domain registration for argus.bz.",
    location: "United States.",
    url: "https://www.godaddy.com/legal",
  },
];

export default function SubprocessorsPage() {
  return (
    <PublicShell>
      <section className="max-w-[820px] mx-auto px-8 md:px-12 py-12 md:py-20">
        <div
          className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-4"
          style={{ color: "var(--accent)" }}
        >
          Legal
        </div>
        <h1
          className="font-bold leading-[1.05] tracking-[-0.025em] mb-4"
          style={{ fontSize: "clamp(36px, 5.5vw, 56px)" }}
        >
          Subprocessors
        </h1>
        <p className="text-[13px]" style={{ color: "var(--ink-3)" }}>
          Last updated: April 26, 2026
        </p>
        <p className="mt-6 text-[16px] leading-[1.65]" style={{ color: "var(--ink-2)" }}>
          The third-party services Argus uses to operate the platform. We give customers at least
          30 days&rsquo; notice before adding a new subprocessor that processes customer personal
          data.
        </p>

        <div
          className="mt-10 rounded-[14px] border bg-[var(--panel)] overflow-hidden"
          style={{ borderColor: "var(--line)" }}
        >
          <div
            className="grid grid-cols-12 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ color: "var(--ink-3)", borderBottom: "1px solid var(--line)" }}
          >
            <div className="col-span-3">Vendor</div>
            <div className="col-span-6">Purpose</div>
            <div className="col-span-3">Location</div>
          </div>
          {SUBPROCESSORS.map((s, i) => (
            <div
              key={s.name}
              className="grid grid-cols-12 px-6 py-5 text-[14px] gap-3"
              style={{ borderBottom: i === SUBPROCESSORS.length - 1 ? undefined : "1px solid var(--line)" }}
            >
              <div className="col-span-12 md:col-span-3 font-semibold" style={{ color: "var(--ink)" }}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }} className="hover:underline">
                  {s.name}
                </a>
              </div>
              <div className="col-span-12 md:col-span-6" style={{ color: "var(--ink-2)" }}>
                {s.purpose}
              </div>
              <div className="col-span-12 md:col-span-3" style={{ color: "var(--ink-3)" }}>
                {s.location}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-[13px]" style={{ color: "var(--ink-3)" }}>
          Want notification when this list changes? Email{" "}
          <a href="mailto:me@treyvititoe.com" style={{ color: "var(--accent)" }} className="underline">
            me@treyvititoe.com
          </a>{" "}
          and we&rsquo;ll add you to the subprocessor change list.
        </p>
      </section>
    </PublicShell>
  );
}
