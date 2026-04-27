"use client";

import { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  label: string;
  options: Option[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  className?: string;
}

export default function MultiSelectDropdown({
  label,
  options,
  selected,
  onToggle,
  onClear,
  className = "",
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const summary =
    selected.length === 0
      ? `All ${label.toLowerCase()}`
      : selected.length === 1
      ? options.find((o) => o.value === selected[0])?.label || selected[0]
      : `${selected.length} selected`;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 bg-surface-container-low rounded-xl px-3 py-2 text-sm outline-none border border-transparent hover:border-outline-variant transition-colors"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
          {label}
        </span>
        <span className="text-primary">{summary}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 120ms" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute z-40 mt-2 min-w-[220px] max-h-[320px] overflow-y-auto rounded-[12px] border bg-surface-container-lowest shadow-lg"
          style={{ borderColor: "var(--line)" }}
        >
          <div className="flex items-center justify-between px-3 py-2 border-b sticky top-0 bg-surface-container-lowest" style={{ borderColor: "var(--line)" }}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
              {label}
            </span>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="text-[12px] font-medium text-[var(--accent)] hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          {options.map((o) => {
            const isOn = selected.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={isOn}
                onClick={() => onToggle(o.value)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-[13px] text-primary hover:bg-surface-container transition-colors"
              >
                <span
                  className="inline-flex items-center justify-center w-4 h-4 rounded border shrink-0"
                  style={{
                    borderColor: isOn ? "var(--accent)" : "var(--line)",
                    background: isOn ? "var(--accent)" : "transparent",
                  }}
                  aria-hidden="true"
                >
                  {isOn && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span className="truncate">{o.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
