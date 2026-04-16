"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "dashboard", href: "/" },
  { label: "Discovery", icon: "explore", href: "/discovery" },
  { label: "Companies", icon: "business", href: "/companies" },
  { label: "Analytics", icon: "monitoring", href: "/analytics" },
];

const BOTTOM_ITEMS = [
  { label: "Settings", icon: "settings", href: "/settings" },
  { label: "Help", icon: "help_outline", href: "/help" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}

      <aside
        className="sidebar-drawer fixed left-0 top-0 h-screen flex flex-col py-8 z-50 bg-[#041627] w-64 shadow-2xl transition-transform duration-300"
        data-open={open}
        aria-hidden={!open}
      >
        <div className="px-6 mb-10 flex items-center justify-between">
          <Link href="/" onClick={onClose} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
              <span
                className="material-symbols-outlined text-white"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}
              >
                dashboard
              </span>
            </div>
            <div>
              <h1 className="font-headline text-white font-extrabold tracking-widest uppercase text-xs">
                Argus
              </h1>
              <p className="text-[10px] text-on-primary-container uppercase tracking-tighter">
                Intelligence Suite
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1"
            aria-label="Close sidebar"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
              close
            </span>
          </button>
        </div>

        <nav className="flex-1 px-4">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`${
                  active
                    ? "nav-active text-white rounded-r-full"
                    : "text-slate-400 hover:text-white hover:bg-[#1a2b3c]"
                } py-3 px-6 my-1 flex items-center gap-3 font-body text-sm font-medium transition-all duration-300`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}

          <div className="mt-8 px-2">
            <Link
              href="/discovery"
              onClick={onClose}
              className="w-full bg-gradient-to-br from-secondary to-primary-container text-white py-3 px-4 rounded-xl text-sm font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                add_circle
              </span>
              New Analysis
            </Link>
          </div>
        </nav>

        <div className="px-4 mt-auto">
          <div className="bg-[#1a2b3c] h-[1px] w-full mb-4" />
          {BOTTOM_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`${
                  active ? "text-white bg-[#1a2b3c]" : "text-slate-400 hover:text-white"
                } py-3 px-6 my-1 flex items-center gap-3 font-body text-sm font-medium transition-all rounded-lg`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
