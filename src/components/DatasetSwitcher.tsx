"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DATASETS, DEFAULT_DATASET, isValidDatasetSlug } from "@/lib/datasets";

interface DatasetSwitcherProps {
  onClose?: () => void;
}

export default function DatasetSwitcher({ onClose }: DatasetSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const segs = pathname.split("/").filter(Boolean);
  const company = segs[0] || "cohesity";
  const currentSlug = isValidDatasetSlug(segs[1]) ? segs[1] : DEFAULT_DATASET;
  const tail = segs.slice(2).join("/"); // sub-route after the dataset segment
  const current = DATASETS.find((d) => d.slug === currentSlug) ?? DATASETS[0];

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function switchTo(slug: string) {
    setOpen(false);
    onClose?.();
    if (slug === currentSlug) return;
    const target = `/${company}/${slug}${tail ? `/${tail}` : ""}`;
    router.push(target);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 rounded-[10px] border px-3 py-2 transition-colors"
        style={{
          borderColor: "var(--line)",
          background: "var(--surface-container-lowest, var(--bg))",
        }}
      >
        <div className="min-w-0 text-left">
          <div className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--accent)" }}>
            Dataset
          </div>
          <div className="text-[13px] font-semibold text-primary truncate">{current.label}</div>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-on-surface-variant shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 120ms" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 mt-2 z-40 rounded-[12px] border bg-surface-container-lowest shadow-lg overflow-hidden"
          style={{ borderColor: "var(--line)" }}
        >
          {DATASETS.map((d) => {
            const isActive = d.slug === currentSlug;
            return (
              <button
                key={d.slug}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => switchTo(d.slug)}
                className="w-full text-left px-3 py-2.5 hover:bg-surface-container transition-colors border-b last:border-b-0"
                style={{ borderColor: "var(--line)" }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[13px] font-semibold text-primary">{d.label}</div>
                  {isActive && (
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: "var(--accent)" }}
                    >
                      Active
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">{d.short}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
