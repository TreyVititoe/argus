"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./shell.module.css";
import { useSession } from "./SessionProvider";

export default function AvatarMenu() {
  const user = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials = user?.initials || "U";
  const label = user?.name || user?.email || "Signed in";

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
