"use client";

import { FormEvent, useState } from "react";
import AppShell from "./AppShell";
import PageHeader from "./PageHeader";

export default function FeedbackView() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!message.trim()) {
      setError("Add a message first.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Couldn't send. Try again.");
        setSubmitting(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Network error — try again.");
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Help us improve"
        title="Feedback & suggestions"
        meta="Bugs, ideas, requests — anything goes"
      />

      {sent ? (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-8 max-w-2xl">
          <div
            className="w-12 h-12 rounded-full mb-4 flex items-center justify-center"
            style={{ background: "var(--accent-bg)", color: "var(--accent)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="font-headline font-bold text-[24px] tracking-[-0.02em] text-primary mb-2">
            Thanks — got it.
          </h3>
          <p className="text-[14px] text-on-surface-variant mb-5">
            Your note went straight to Trey&apos;s inbox. Expect a reply if it&apos;s a question.
          </p>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setSubmitting(false);
              setMessage("");
              setSubject("");
            }}
            className="text-[13px] font-medium hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="bg-surface-container-lowest rounded-xl shadow-sm p-6 md:p-8 max-w-2xl">
          <label className="block mb-4">
            <span className="block text-[12px] font-semibold text-on-surface-variant mb-1.5">
              Subject (optional)
            </span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Renewal table is hard to read on mobile"
              maxLength={120}
              className="w-full px-4 py-2.5 rounded-[10px] border border-outline-variant bg-surface-container-lowest text-primary text-[14px] outline-none focus:border-[var(--accent-soft)] focus:shadow-[0_0_0_4px_var(--accent-bg)]"
            />
          </label>

          <label className="block mb-4">
            <span className="block text-[12px] font-semibold text-on-surface-variant mb-1.5">
              Message
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={8}
              maxLength={8000}
              placeholder="What's working, what's not, what would make this 10× better?"
              className="w-full px-4 py-3 rounded-[10px] border border-outline-variant bg-surface-container-lowest text-primary text-[14px] leading-relaxed outline-none focus:border-[var(--accent-soft)] focus:shadow-[0_0_0_4px_var(--accent-bg)] resize-y"
            />
            <span className="block mt-1 text-[11px] text-on-surface-variant text-right">
              {message.length} / 8000
            </span>
          </label>

          {error && (
            <div
              className="mb-4 rounded-[10px] border px-3 py-2.5 text-[13px]"
              style={{
                borderColor: "oklch(0.55 0.18 25 / 0.3)",
                background: "oklch(0.96 0.03 25)",
                color: "oklch(0.45 0.15 25)",
              }}
            >
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={submitting || !message.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-[10px] text-[14px] font-medium text-white disabled:opacity-50 transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--ink)" }}
            >
              {submitting ? "Sending…" : "Send feedback"}
            </button>
          </div>
        </form>
      )}
    </AppShell>
  );
}
