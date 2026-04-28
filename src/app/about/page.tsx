import { PublicShell, ProseSection } from "@/components/PublicShell";

export const metadata = {
  title: "About — Argus",
  description: "Why Argus exists and who's behind it.",
};

export default function AboutPage() {
  return (
    <PublicShell>
      <ProseSection eyebrow="About" title="Built for the half of public-sector sales that lives in spreadsheets.">
        <p>
          Public procurement is one of the largest, most predictable buyer pools on the planet —
          and one of the most fragmented. Every state, county, and agency posts its filings to its
          own portal, on its own schedule, in its own format. The reps who chase this market spend
          half their week stitching together a picture of who's buying what.
        </p>
        <p className="mt-5">
          Argus exists to do that stitching for them. We ingest the public record, normalize it,
          and surface the contracts that are actually about to renew — so reps can show up early
          with the right pitch, not late with a generic one.
        </p>
        <p className="mt-5">
          We're a small team based in Florida with deep experience in public-sector enterprise
          sales. If you'd like to talk about your territory, your ICP, or how Argus could fit into
          your pipeline, write me directly at{" "}
          <a href="mailto:support@argus.bz" style={{ color: "var(--accent)" }} className="underline">
            support@argus.bz
          </a>
          .
        </p>
      </ProseSection>
    </PublicShell>
  );
}
