import { PublicShell, ProseSection } from "@/components/PublicShell";

export const metadata = {
  title: "Service Level Agreement — Argus",
  description: "Argus uptime targets and service credits.",
};

export default function SLAPage() {
  return (
    <PublicShell>
      <ProseSection eyebrow="Legal" title="Service Level Agreement">
        <p className="text-[13px]" style={{ color: "var(--ink-3)" }}>
          Last updated: April 26, 2026
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Availability target
        </h2>
        <p>
          Argus targets <strong style={{ color: "var(--ink)" }}>99.9%</strong> monthly availability
          for the production application, measured at the Vercel edge. Scheduled maintenance and
          force majeure events are excluded from the calculation.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Service credits
        </h2>
        <p>If monthly uptime falls below the target, eligible customers receive a service credit:</p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>99.9% &gt; uptime ≥ 99.0%: 5% credit on the affected month&apos;s subscription.</li>
          <li>99.0% &gt; uptime ≥ 95.0%: 10% credit on the affected month&apos;s subscription.</li>
          <li>Uptime &lt; 95.0%: 25% credit on the affected month&apos;s subscription.</li>
        </ul>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Status & incident reporting
        </h2>
        <p>
          Live status is published at{" "}
          <a href="/status" style={{ color: "var(--accent)" }} className="underline">
            /status
          </a>
          . For active incidents, refer to{" "}
          <a
            href="https://www.vercel-status.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)" }}
            className="underline"
          >
            vercel-status.com
          </a>
          {" "}(our hosting provider) and Argus-specific updates posted to your account email.
        </p>

        <h2 className="font-bold text-primary mt-10 mb-3" style={{ fontSize: 22 }}>
          Claiming a credit
        </h2>
        <p>
          Email{" "}
          <a href="mailto:me@treyvititoe.com" style={{ color: "var(--accent)" }} className="underline">
            me@treyvititoe.com
          </a>{" "}
          within 30 days of the affected month with the dates of the disruption. Credits are
          applied against your next invoice.
        </p>

        <p className="mt-10 text-[13px]" style={{ color: "var(--ink-4)" }}>
          This is a draft SLA intended to be reviewed by counsel before signature.
        </p>
      </ProseSection>
    </PublicShell>
  );
}
