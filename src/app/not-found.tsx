import Link from "next/link";
import { PublicShell } from "@/components/PublicShell";

export const metadata = {
  title: "Not found — Argus",
};

export default function NotFound() {
  return (
    <PublicShell>
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div
          className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-4"
          style={{ color: "var(--accent)" }}
        >
          404
        </div>
        <h1
          className="font-bold leading-[1.05] tracking-[-0.025em] mb-5 max-w-[720px]"
          style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
        >
          That page seems to have closed before we could see it.
        </h1>
        <p className="text-[16px] mb-8 max-w-[520px]" style={{ color: "var(--ink-3)" }}>
          The link may be old, the URL mistyped, or the route may require a sign in.
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[10px] text-[14px] font-bold text-white"
            style={{ background: "oklch(0.68 0.07 160)" }}
          >
            Back to Argus
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[10px] text-[14px] font-medium border"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
          >
            Sign in
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
