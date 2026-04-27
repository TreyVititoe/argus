import { PublicShell, ProseSection } from "@/components/PublicShell";

export const metadata = {
  title: "Data Processing Agreement — Argus",
  description: "Argus DPA template for enterprise customers.",
};

export default function DPAPage() {
  return (
    <PublicShell>
      <ProseSection eyebrow="Legal" title="Data Processing Agreement">
        <p className="text-[13px]" style={{ color: "var(--ink-3)" }}>
          Last updated: April 26, 2026
        </p>

        <p className="mt-6">
          This Data Processing Agreement (&ldquo;DPA&rdquo;) supplements the Terms of Service between
          Argus Intelligence (&ldquo;Argus,&rdquo; the &ldquo;Processor&rdquo;) and the Customer
          (the &ldquo;Controller&rdquo;) and applies whenever Argus processes personal data on the
          Customer&apos;s behalf in the course of providing the Service.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          1. Scope of processing
        </h2>
        <p>
          Argus processes only the personal data necessary to authenticate users, render
          tenant-scoped views, operate the Service, and communicate about the Service. The
          procurement contract data shown in the Service is sourced from public filings and is not
          considered Customer personal data.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          2. Categories of data
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Authorized user email addresses and derived display names.</li>
          <li>Session cookies bound to a tenant.</li>
          <li>Standard server logs (request paths, response codes, timestamps, IP addresses).</li>
        </ul>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          3. Subprocessors
        </h2>
        <p>
          Argus engages the subprocessors listed at{" "}
          <a href="/subprocessors" style={{ color: "var(--accent)" }} className="underline">
            /subprocessors
          </a>
          . Argus will give Customer at least 30 days&rsquo; notice of any new subprocessor before
          it begins processing Customer personal data, and Customer may object on reasonable
          grounds.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          4. Security
        </h2>
        <p>
          Argus implements technical and organizational measures appropriate to the risk,
          including TLS 1.2+ in transit, signed HttpOnly session cookies, principle-of-least-privilege
          access, and the controls described at{" "}
          <a href="/security" style={{ color: "var(--accent)" }} className="underline">
            /security
          </a>
          .
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          5. International transfers
        </h2>
        <p>
          Personal data may be processed in the United States. Where required, Argus relies on
          Standard Contractual Clauses or other transfer mechanisms approved by applicable
          authorities.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          6. Customer rights
        </h2>
        <p>
          Customer may, on reasonable notice, audit Argus&apos;s compliance with this DPA. Argus
          will assist with data subject requests (access, deletion, portability) within 30 days of
          a written request to{" "}
          <a href="mailto:me@treyvititoe.com" style={{ color: "var(--accent)" }} className="underline">
            me@treyvititoe.com
          </a>
          .
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          7. Term and termination
        </h2>
        <p>
          This DPA remains in effect for the duration of the Customer&apos;s subscription. On
          termination, Argus will delete or return Customer personal data within 60 days, except
          where retention is required by law.
        </p>

        <p className="mt-10 text-[13px]" style={{ color: "var(--ink-4)" }}>
          This is a draft DPA intended to be reviewed by counsel before signature. Email
          me@treyvititoe.com to request a counter-signature copy.
        </p>
      </ProseSection>
    </PublicShell>
  );
}
