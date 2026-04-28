import { PublicShell, ProseSection } from "@/components/PublicShell";

export const metadata = {
  title: "Terms of Service — Argus",
  description: "Terms governing your use of Argus.",
};

export default function TermsPage() {
  return (
    <PublicShell>
      <ProseSection eyebrow="Legal" title="Terms of Service">
        <p className="text-[13px]" style={{ color: "var(--ink-3)" }}>
          Last updated: April 25, 2026
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Acceptance
        </h2>
        <p>
          By accessing or using Argus (&ldquo;the Service&rdquo;), you agree to these Terms of
          Service. If you do not agree, do not use the Service.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Account & access
        </h2>
        <p>
          Access is granted to authorized customers based on email domain. You are responsible for
          maintaining the security of your work email and for all activity that occurs under your
          account.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Acceptable use
        </h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Reverse engineer, scrape, or attempt to bypass authentication on the Service.</li>
          <li>Resell, sublicense, or redistribute Argus data without written permission.</li>
          <li>Use the Service to harass, defraud, or violate the rights of any party.</li>
        </ul>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Data accuracy
        </h2>
        <p>
          Argus aggregates public procurement filings and presents them as faithfully as we can.
          We do not warrant that the data is complete or error-free, and you are responsible for
          your own decisions made on top of it.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Termination
        </h2>
        <p>
          We may suspend or terminate your access at any time for violation of these terms. You
          may stop using the Service at any time.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Limitation of liability
        </h2>
        <p>
          To the maximum extent permitted by law, Argus is provided &ldquo;as is.&rdquo; We are
          not liable for indirect or consequential damages.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Contact
        </h2>
        <p>
          Questions about these terms?{" "}
          <a href="mailto:support@argus.bz" style={{ color: "var(--accent)" }} className="underline">
            support@argus.bz
          </a>
          .
        </p>

        <p className="mt-10 text-[13px]" style={{ color: "var(--ink-4)" }}>
          This is a draft agreement intended to be reviewed by counsel before final use.
        </p>
      </ProseSection>
    </PublicShell>
  );
}
