import Link from "next/link";

export default function PublicHome() {
  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      <header className="flex items-center justify-between px-8 md:px-12 py-6">
        <div className="flex items-center gap-3">
          <span className="block w-8 h-8 rounded-[7px] overflow-hidden shadow-sm">
            <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
              <rect width="128" height="128" rx="28" ry="28" fill="#4A7A67" />
              <rect x="30" y="30" width="68" height="68" rx="14" ry="14" fill="#F2EBDD" />
              <rect x="62" y="42" width="4" height="14" rx="2" fill="#4A7A67" />
              <rect x="62" y="72" width="4" height="14" rx="2" fill="#4A7A67" />
              <circle cx="64" cy="64" r="6" fill="#4A7A67" />
            </svg>
          </span>
          <span className="text-[18px] font-semibold tracking-tight">Argus</span>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-medium border"
          style={{ borderColor: "var(--line)", color: "var(--ink)" }}
        >
          Log in
        </Link>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div
          className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-4"
          style={{ color: "var(--accent)" }}
        >
          Procurement Intelligence
        </div>
        <h1
          className="font-headline font-normal leading-[1.02] tracking-[-0.02em] max-w-[900px] mb-6"
          style={{ fontSize: "clamp(44px, 7vw, 88px)" }}
        >
          See every expiring contract<br />before your competitors do.
        </h1>
        <p
          className="text-[17px] leading-relaxed max-w-[620px] mb-10"
          style={{ color: "var(--ink-3)" }}
        >
          Argus tracks public-sector procurement across every state — so your sales team knows
          who&apos;s buying, who&apos;s expiring, and where to spend the next call.
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[10px] text-[15px] font-medium text-white transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--ink)" }}
          >
            Log in to your dashboard
          </Link>
          <Link
            href="/cohesity"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-[10px] text-[15px] font-medium border transition-colors"
            style={{
              borderColor: "var(--accent-soft)",
              color: "var(--accent)",
            }}
          >
            See a demo →
          </Link>
        </div>
      </section>

      <footer className="px-8 md:px-12 py-6 text-[12px]" style={{ color: "var(--ink-4)" }}>
        © {new Date().getFullYear()} Argus. Public-sector procurement intelligence.
      </footer>
    </main>
  );
}
