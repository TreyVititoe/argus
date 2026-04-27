"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./shell.module.css";
import ThemeToggle from "./ThemeToggle";

const DEFAULT_COMPANY = "cohesity";

const NAV_ITEMS: { label: string; sub: string | null }[] = [
  { label: "Dashboard", sub: null },
  { label: "Discovery", sub: "discovery" },
  { label: "Resellers", sub: "companies" },
  { label: "Analytics", sub: "analytics" },
];

const FOOTER_ITEMS: { label: string; sub: string }[] = [
  { label: "Settings", sub: "settings" },
  { label: "Help", sub: "help" },
];

function companyFromPath(pathname: string): string {
  // First non-empty segment is the company slug (unless it's a reserved page).
  const seg = pathname.split("/").filter(Boolean)[0];
  if (!seg || seg === "login") return DEFAULT_COMPANY;
  return seg;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const company = companyFromPath(pathname);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const hrefFor = (sub: string | null) => (sub ? `/${company}/${sub}` : `/${company}`);

  const isActive = (sub: string | null) => {
    const target = hrefFor(sub);
    if (sub === null) {
      // Dashboard = exact match on /{company}
      return pathname === target;
    }
    return pathname === target || pathname.startsWith(target + "/");
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.open : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`${styles.sidebar} ${open ? styles.open : ""}`}
        aria-hidden={!open && typeof window !== "undefined" && window.innerWidth < 1024}
      >
        <Link href={`/${company}`} onClick={onClose} className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
              <rect width="128" height="128" rx="28" ry="28" fill="#4A7A67" />
              <rect x="30" y="30" width="68" height="68" rx="14" ry="14" fill="#F2EBDD" />
              <rect x="62" y="42" width="4" height="14" rx="2" fill="#4A7A67" />
              <rect x="62" y="72" width="4" height="14" rx="2" fill="#4A7A67" />
              <circle cx="64" cy="64" r="6" fill="#4A7A67" />
            </svg>
          </span>
          <div className={styles.brandName}>Argus</div>
        </Link>

        <button
          type="button"
          onClick={onClose}
          className={`${styles.closeBtn} lg:!hidden`}
          aria-label="Close sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.sub);
            return (
              <Link
                key={item.label}
                href={hrefFor(item.sub)}
                onClick={onClose}
                className={`${styles.navItem} ${active ? styles.active : ""}`}
              >
                <span className={styles.dot} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link href={hrefFor("discovery")} onClick={onClose} className={styles.newAnalysis}>
          + New analysis
        </Link>

        <div className={styles.sidebarFooter}>
          {FOOTER_ITEMS.map((item, i) => {
            const active = isActive(item.sub);
            const link = (
              <Link
                key={item.label}
                href={hrefFor(item.sub)}
                onClick={onClose}
                className={`${styles.footerLink} ${active ? styles.active : ""} flex-1 min-w-0`}
              >
                {item.label}
              </Link>
            );
            if (i === 0) {
              return (
                <div key={item.label} className="flex items-center gap-2">
                  {link}
                  <ThemeToggle />
                </div>
              );
            }
            return link;
          })}
        </div>
      </aside>
    </>
  );
}
