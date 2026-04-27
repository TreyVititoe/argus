"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { tenantForEmail } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim().toLowerCase();
    if (!tenantForEmail(trimmed)) {
      setError("This email isn't tied to an Argus account yet. Use your company email to continue.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = getSupabaseBrowser();
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (signInError) {
        setError(signInError.message || "Couldn't send the magic link. Try again.");
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
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      <header className="flex items-center justify-between px-8 md:px-12 py-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="block w-8 h-8 rounded-[7px] overflow-hidden shadow-sm">
            <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
              <rect width="128" height="128" rx="28" ry="28" fill="#4A7A67" />
              <rect x="30" y="30" width="68" height="68" rx="14" ry="14" fill="#F2EBDD" />
              <rect x="62" y="42" width="4" height="14" rx="2" fill="#4A7A67" />
              <rect x="62" y="72" width="4" height="14" rx="2" fill="#4A7A67" />
              <circle cx="64" cy="64" r="6" fill="#4A7A67" />
            </svg>
          </span>
          <span className="text-[18px] font-semibold tracking-tight">Argus</span>
        </Link>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-6">
        {sent ? (
          <div className="w-full max-w-md rounded-[14px] border border-outline-variant bg-surface-container-lowest p-8 shadow-sm text-center">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{ background: "var(--accent-bg)", color: "var(--accent)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <h1 className="font-headline font-bold leading-[1.1] tracking-[-0.02em] text-[28px] mb-2">
              Check your inbox.
            </h1>
            <p className="text-[14px] leading-relaxed mb-1" style={{ color: "var(--ink-3)" }}>
              We sent a sign-in link to
            </p>
            <p className="text-[14px] font-semibold mb-6" style={{ color: "var(--ink)" }}>
              {email}
            </p>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setSubmitting(false);
              }}
              className="text-[12px] font-medium hover:underline"
              style={{ color: "var(--accent)" }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="w-full max-w-md rounded-[14px] border border-outline-variant bg-surface-container-lowest p-8 shadow-sm"
          >
            <div
              className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-3"
              style={{ color: "var(--accent)" }}
            >
              Sign in
            </div>
            <h1 className="font-headline font-bold leading-[1.05] tracking-[-0.02em] text-[40px] mb-2">
              Log in to your dashboard
            </h1>
            <p className="text-[14px] mb-6 leading-relaxed" style={{ color: "var(--ink-3)" }}>
              Enter the work email you signed up with. We&apos;ll send a sign-in link.
            </p>

            <label className="block mb-4">
              <span className="block text-[12px] font-medium mb-1.5" style={{ color: "var(--ink-3)" }}>
                Work email
              </span>
              <input
                autoFocus
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-[10px] border border-outline-variant bg-surface-container-lowest text-primary text-[14px] outline-none focus:border-[var(--accent-soft)] focus:shadow-[0_0_0_4px_var(--accent-bg)]"
                disabled={submitting}
              />
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-[10px] text-[15px] font-medium text-white disabled:opacity-60 transition-transform hover:-translate-y-0.5"
              style={{ background: "var(--ink)" }}
            >
              {submitting ? "Sending link…" : "Send sign-in link"}
            </button>

            <p className="mt-6 text-[12px] text-center" style={{ color: "var(--ink-4)" }}>
              New to Argus?{" "}
              <a href="mailto:me@treyvititoe.com" className="hover:underline" style={{ color: "var(--accent)" }}>
                Request access
              </a>
            </p>
          </form>
        )}
      </section>

      <footer className="px-8 md:px-12 py-6 text-[12px]" style={{ color: "var(--ink-4)" }}>
        © {new Date().getFullYear()} Argus. Public-sector procurement intelligence.
      </footer>
    </main>
  );
}
