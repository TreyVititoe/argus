import Link from "next/link";

function BrandMark() {
  return (
    <span className="block w-8 h-8 rounded-[7px] overflow-hidden shadow-sm">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="8" width="84" height="84" rx="22" fill="#faf8f3" />
        <rect x="46" y="20" width="8" height="60" rx="4" fill="#4A7A67" />
        <circle cx="50" cy="50" r="18" fill="#4A7A67" />
        <circle cx="50" cy="50" r="6" fill="#faf8f3" />
      </svg>
    </span>
  );
}

const HEADER_LINKS: { label: string; href: string }[] = [
  { label: "Why Argus", href: "/why-argus" },
  { label: "For sales leaders", href: "/for-sales-leaders" },
  { label: "For reps", href: "/for-reps" },
  { label: "FAQ", href: "/faq" },
  { label: "Pricing", href: "/pricing" },
];

export function PublicHeader() {
  return (
    <header className="flex items-center justify-between gap-6 px-8 md:px-12 py-6">
      <Link href="/" className="flex items-center gap-3 shrink-0">
        <BrandMark />
        <span className="text-[18px] font-semibold tracking-tight">Argus</span>
      </Link>
      <nav className="hidden lg:flex items-center gap-7 flex-1 justify-center text-[14px] font-medium" style={{ color: "var(--ink-2)" }}>
        {HEADER_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-primary transition-colors">
            {l.label}
          </Link>
        ))}
      </nav>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[14px] font-bold text-white shrink-0"
        style={{ background: "oklch(0.68 0.07 160)" }}
      >
        Sign In
      </Link>
    </header>
  );
}

const FOOTER_COLS: { heading: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Why Argus", href: "/why-argus" },
      { label: "For sales leaders", href: "/for-sales-leaders" },
      { label: "For reps", href: "/for-reps" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Glossary", href: "/glossary" },
      { label: "Status", href: "/status" },
      { label: "About", href: "/about" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/security" },
      { label: "DPA", href: "/dpa" },
      { label: "SLA", href: "/sla" },
      { label: "Acceptable Use", href: "/aup" },
      { label: "Subprocessors", href: "/subprocessors" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer
      className="px-8 md:px-12 py-12 mt-16 border-t text-[13px]"
      style={{ color: "var(--ink-3)", borderColor: "var(--line)" }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-12 gap-8 mb-10">
          <div className="col-span-12 md:col-span-3">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="block w-7 h-7 rounded-[6px] overflow-hidden">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="8" width="84" height="84" rx="22" fill="#faf8f3" />
                  <rect x="46" y="20" width="8" height="60" rx="4" fill="#4A7A67" />
                  <circle cx="50" cy="50" r="18" fill="#4A7A67" />
                  <circle cx="50" cy="50" r="6" fill="#faf8f3" />
                </svg>
              </span>
              <span className="font-semibold text-[15px]" style={{ color: "var(--ink)" }}>Argus</span>
            </div>
            <p className="text-[13px] leading-[1.55] max-w-[240px]">
              Procurement intelligence for the public sector.
            </p>
            <a
              href="mailto:me@treyvititoe.com"
              className="mt-3 inline-block text-[13px]"
              style={{ color: "var(--accent)" }}
            >
              me@treyvititoe.com
            </a>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.heading} className="col-span-6 md:col-span-3">
              <div
                className="text-[10px] font-bold uppercase tracking-[0.16em] mb-4"
                style={{ color: "var(--ink-4)" }}
              >
                {col.heading}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:opacity-80" style={{ color: "var(--ink-3)" }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="pt-6 flex flex-wrap items-center justify-between gap-3 text-[12px]"
          style={{ color: "var(--ink-4)", borderTop: "1px solid var(--line)" }}
        >
          <div>© {new Date().getFullYear()} Argus Intelligence</div>
          <div>argus.bz</div>
        </div>
      </div>
    </footer>
  );
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <PublicHeader />
      <div className="flex-1">{children}</div>
      <PublicFooter />
    </main>
  );
}

export function ProseSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-[820px] w-full mx-auto px-8 md:px-12 py-10 md:py-16">
      <div
        className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-4"
        style={{ color: "var(--accent)" }}
      >
        {eyebrow}
      </div>
      <h1
        className="font-bold leading-[1.05] tracking-[-0.025em] mb-6"
        style={{ fontSize: "clamp(36px, 5.5vw, 60px)" }}
      >
        {title}
      </h1>
      <div className="prose-argus text-[16px] leading-[1.65]" style={{ color: "var(--ink-2)" }}>
        {children}
      </div>
    </section>
  );
}
