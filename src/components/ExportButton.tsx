"use client";

import { useEffect, useState } from "react";
import { Transaction } from "@/lib/types";

interface ExportButtonProps {
  transactions: Transaction[];
}

const CSV_HEADERS = [
  "Year",
  "State",
  "Agency",
  "Sector",
  "Reseller",
  "Vendor",
  "Keyword",
  "Description",
  "Quantity",
  "Unit Price",
  "Total Price",
];

function escapeCsv(v: string | number): string {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(rows: Transaction[]): string {
  const lines = [CSV_HEADERS.join(",")];
  for (const t of rows) {
    lines.push(
      [
        t.year,
        t.stateCode,
        t.agency,
        t.type,
        t.company,
        t.competitor,
        t.keyword,
        t.description,
        t.quantity,
        t.unitPrice,
        t.totalPrice,
      ]
        .map(escapeCsv)
        .join(",")
    );
  }
  return lines.join("\n");
}

function triggerDownload(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ExportButton({ transactions }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setPassword("");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid password");
        setSubmitting(false);
        return;
      }
      const csv = toCsv(transactions);
      const stamp = new Date().toISOString().slice(0, 10);
      triggerDownload(csv, `argus-export-${stamp}-${transactions.length}-rows.csv`);
      setOpen(false);
    } catch {
      setError("Network error");
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px] font-medium border border-outline-variant bg-surface-container-lowest text-primary transition-colors hover:border-[oklch(0.88_0.007_85)]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
        Export CSV
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-[14px] border border-outline-variant bg-surface-container-lowest p-6 shadow-2xl"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)] mb-2">
              Enterprise feature
            </div>
            <h3 className="font-headline font-bold text-[28px] leading-tight tracking-[-0.02em] text-primary mb-2">
              Export filtered data
            </h3>
            <p className="text-[13px] text-on-surface-variant mb-5 leading-relaxed">
              CSV export is gated by a password. Request one from{" "}
              <a href="mailto:me@treyvititoe.com" className="text-[var(--accent)] underline">
                me@treyvititoe.com
              </a>
              .
            </p>
            <label className="block mb-4">
              <span className="block text-[12px] font-medium text-on-surface-variant mb-1.5">
                Password
              </span>
              <input
                autoFocus
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[10px] border border-outline-variant bg-surface-container-lowest text-primary outline-none focus:border-[var(--accent-soft)] focus:shadow-[0_0_0_4px_var(--accent-bg)]"
              />
            </label>
            {error && (
              <div className="mb-4 rounded-[10px] border border-[oklch(0.55_0.18_25_/_0.3)] bg-[oklch(0.96_0.03_25)] px-3 py-2 text-[13px] text-[oklch(0.45_0.15_25)]">
                {error}
              </div>
            )}
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] text-on-surface-variant">
                {transactions.length.toLocaleString()} rows will be exported
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-[10px] text-[13px] font-medium text-on-surface-variant hover:text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !password}
                  className="px-5 py-2 rounded-[10px] text-[13px] font-medium text-white disabled:opacity-40"
                  style={{ background: "var(--ink)" }}
                >
                  {submitting ? "Checking…" : "Download CSV"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
