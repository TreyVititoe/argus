import { PublicShell, ProseSection } from "@/components/PublicShell";

export const metadata = {
  title: "Privacy Policy — Argus",
  description: "How Argus collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <PublicShell>
      <ProseSection eyebrow="Privacy" title="Privacy Policy">
        <p className="text-[13px]" style={{ color: "var(--ink-3)" }}>
          Last updated: April 25, 2026
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          What this is
        </h2>
        <p>
          Argus Intelligence (&ldquo;Argus,&rdquo; &ldquo;we&rdquo;) provides public-sector
          procurement intelligence to authorized customers. This policy describes what information
          we collect when you use the Argus website and product, and how we use it.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Information we collect
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Account information.</strong> When you sign in with a work email, we store the
            email address and the tenant slug derived from its domain.
          </li>
          <li>
            <strong>Session data.</strong> A signed, HttpOnly cookie that records your tenant and
            email, used to keep you logged in.
          </li>
          <li>
            <strong>Usage data.</strong> Standard server logs (request paths, response codes,
            timestamps, IP addresses) used to operate and secure the service.
          </li>
        </ul>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          What we don&apos;t collect
        </h2>
        <p>
          We do not run third-party advertising trackers. We do not sell your data. The
          procurement contract data shown in Argus is sourced from public filings.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          How we use it
        </h2>
        <p>
          To authenticate you, render your tenant&apos;s data, and operate and improve the
          service. We do not share account or usage data with third parties except as required to
          operate the platform (hosting, error monitoring) or by law.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Data retention
        </h2>
        <p>
          Session cookies expire after 7 days. Server logs are retained for up to 90 days. Account
          information is retained while your account is active and deleted on request.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Your rights
        </h2>
        <p>
          You can request a copy of your data, or its deletion, at any time by emailing{" "}
          <a href="mailto:support@argus.bz" style={{ color: "var(--accent)" }} className="underline">
            support@argus.bz
          </a>
          .
        </p>

        <p className="mt-10 text-[13px]" style={{ color: "var(--ink-4)" }}>
          This is a draft policy intended to be reviewed by counsel before final use.
        </p>
      </ProseSection>
    </PublicShell>
  );
}
