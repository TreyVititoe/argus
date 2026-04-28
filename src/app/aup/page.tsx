import { PublicShell, ProseSection } from "@/components/PublicShell";

export const metadata = {
  title: "Acceptable Use Policy — Argus",
  description: "How customers may and may not use the Argus service.",
};

export default function AUPPage() {
  return (
    <PublicShell>
      <ProseSection eyebrow="Legal" title="Acceptable Use Policy">
        <p className="text-[13px]" style={{ color: "var(--ink-3)" }}>
          Last updated: April 26, 2026
        </p>

        <p className="mt-6">
          Argus is built so sales teams can find public-sector contract opportunities faster.
          Using it for anything else risks the service for every other customer. This policy spells
          out what we expect.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          What you may do
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the Service to research, target, and prioritize public-sector sales opportunities.</li>
          <li>Export filtered datasets for use inside your own CRM or BI tools.</li>
          <li>Share Argus URLs with teammates inside your tenant.</li>
        </ul>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          What you may not do
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Reverse engineer, scrape, or attempt to bypass authentication, rate limits, or tenant boundaries.</li>
          <li>Resell, sublicense, or redistribute Argus data to third parties without written permission.</li>
          <li>Share session credentials or export passwords with anyone outside your team.</li>
          <li>Use the Service to harass, defraud, or violate the rights of any party.</li>
          <li>Run automated load testing, vulnerability scans, or denial-of-service attempts without prior written coordination.</li>
        </ul>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Reporting abuse
        </h2>
        <p>
          Suspect a violation, or want to report something that looks off? Email{" "}
          <a href="mailto:support@argus.bz" style={{ color: "var(--accent)" }} className="underline">
            support@argus.bz
          </a>
          . We respond within one business day.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Enforcement
        </h2>
        <p>
          We may suspend or terminate access for violations of this policy. For severe or repeated
          abuse, we may also notify the offending account&apos;s organization and, if applicable,
          the relevant authorities.
        </p>
      </ProseSection>
    </PublicShell>
  );
}
