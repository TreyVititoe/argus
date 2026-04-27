"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const HEADER_LINKS: { label: string; href: string }[] = [
  { label: "Why Argus", href: "/why-argus" },
  { label: "For sales leaders", href: "/for-sales-leaders" },
  { label: "For reps", href: "/for-reps" },
  { label: "FAQ", href: "/faq" },
  { label: "Pricing", href: "/pricing" },
];

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

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 transition-[border-color,background] duration-150"
      style={{
        background: "oklch(0.985 0.005 85 / 0.82)",
        backdropFilter: "saturate(180%) blur(10px)",
        WebkitBackdropFilter: "saturate(180%) blur(10px)",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-6 px-8 md:px-12 py-4">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <BrandMark />
          <span className="text-[16px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
            Argus
          </span>
        </Link>
        <nav
          className="hidden lg:flex items-center gap-7 flex-1 justify-center text-[14px] font-medium"
          style={{ color: "var(--ink-2)" }}
        >
          {HEADER_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:opacity-80 transition-opacity"
              style={{ color: "var(--ink-2)" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-[14px] font-bold text-white transition-transform hover:-translate-y-px shrink-0"
          style={{ background: "oklch(0.68 0.07 160)" }}
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}
