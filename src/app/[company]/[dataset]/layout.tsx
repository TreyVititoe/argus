import { redirect } from "next/navigation";
import { isValidDatasetSlug, DEFAULT_DATASET } from "@/lib/datasets";

// Gate the [dataset] segment to known slugs. Anything else (typo, or an
// old bookmark like /cohesity/discovery from before the refactor) is
// treated as a sub-route and redirected to /{company}/{default}/{seg},
// preserving deep links from older URLs.
export default async function DatasetLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ company: string; dataset: string }>;
}) {
  const { company, dataset } = await params;
  if (!isValidDatasetSlug(dataset)) {
    redirect(`/${company}/${DEFAULT_DATASET}/${dataset}`);
  }
  return <>{children}</>;
}
