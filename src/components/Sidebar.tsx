"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./shell.module.css";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/cohesity" },
  { label: "Discovery", href: "/discovery" },
  { label: "Companies", href: "/companies" },
  { label: "Analytics", href: "/analytics" },
];

const SHARED_ROUTES = ["/discovery", "/companies", "/analytics", "/settings", "/help"];

const FOOTER_ITEMS = [
  { label: "Settings", href: "/settings" },
  { label: "Help", href: "/help" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/cohesity") {
      // Dashboard nav is active on any company route (/cohesity, /crowdstrike, etc.)
      if (pathname === "/") return false;
      const isSharedRoute = SHARED_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
      return !isSharedRoute;
    }
    return pathname === href || pathname.startsWith(href + "/");
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
        <Link href="/cohesity" onClick={onClose} className={styles.brand}>
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
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`${styles.navItem} ${active ? styles.active : ""}`}
              >
                <span className={styles.dot} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/discovery" onClick={onClose} className={styles.newAnalysis}>
          + New analysis
        </Link>

        <div className={styles.sidebarFooter}>
          {FOOTER_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`${styles.footerLink} ${active ? styles.active : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
