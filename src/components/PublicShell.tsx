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

export function PublicHeader() {
  return (
    <header className="flex items-center justify-between px-8 md:px-12 py-6">
      <Link href="/" className="flex items-center gap-3">
        <BrandMark />
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
  );
}

export function PublicFooter() {
  return (
    <footer
      className="px-8 md:px-12 py-8 mt-16 border-t text-[13px]"
      style={{ color: "var(--ink-3)", borderColor: "var(--line)" }}
    >
      <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="block w-6 h-6 rounded-[5px] overflow-hidden">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="8" width="84" height="84" rx="22" fill="#faf8f3" />
              <rect x="46" y="20" width="8" height="60" rx="4" fill="#4A7A67" />
              <circle cx="50" cy="50" r="18" fill="#4A7A67" />
              <circle cx="50" cy="50" r="6" fill="#faf8f3" />
            </svg>
          </span>
          <span className="font-semibold text-primary">Argus</span>
        </div>
        <nav className="flex flex-wrap items-center gap-x-7 gap-y-2">
          <Link href="/about" style={{ color: "var(--ink-3)" }}>About</Link>
          <Link href="/pricing" style={{ color: "var(--ink-3)" }}>Pricing</Link>
          <Link href="/security" style={{ color: "var(--ink-3)" }}>Security</Link>
          <Link href="/privacy" style={{ color: "var(--ink-3)" }}>Privacy</Link>
          <Link href="/terms" style={{ color: "var(--ink-3)" }}>Terms</Link>
          <a href="mailto:me@treyvititoe.com" style={{ color: "var(--ink-3)" }}>Contact</a>
        </nav>
        <div>© {new Date().getFullYear()} Argus Intelligence</div>
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
