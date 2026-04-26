"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./shell.module.css";
import { useSession } from "./SessionProvider";

type Theme = "light" | "dark";
const THEME_KEY = "argus-theme";

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return (document.documentElement.dataset.theme as Theme) || "light";
}

function applyTheme(theme: Theme) {
  if (theme === "dark") {
    document.documentElement.dataset.theme = "dark";
  } else {
    delete document.documentElement.dataset.theme;
  }
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
}

export default function AvatarMenu() {
  const user = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const ref = useRef<HTMLDivElement>(null);

  const initials = user?.initials || "U";
  const label = user?.name || user?.email || "Signed in";

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  async function onSignOut() {
    await fetch("/api/logout", { method: "POST" }).catch(() => {});
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={styles.avatar}
        title={label}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initials}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-[12px] border bg-surface-container-lowest shadow-lg z-50 overflow-hidden"
          style={{ borderColor: "var(--line)" }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--line)" }}>
            <div className="text-[13px] font-semibold text-primary truncate">{user?.name || "Signed in"}</div>
            {user?.email && (
              <div className="text-[12px] text-on-surface-variant truncate">{user.email}</div>
            )}
            {user?.tenant && (
              <div
                className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{ background: "var(--accent-bg)", color: "var(--accent)" }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--accent)" }}
                />
                {user.tenant}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2.5 text-[13px] text-primary hover:bg-surface-container transition-colors border-b"
            style={{ borderColor: "var(--line)" }}
          >
            <span>Theme</span>
            <span className="inline-flex items-center gap-1.5 text-on-surface-variant">
              {theme === "dark" ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                  Dark
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                  Light
                </>
              )}
            </span>
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="w-full text-left px-4 py-2.5 text-[13px] text-primary hover:bg-surface-container transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
