import DiscoveryView from "@/components/DiscoveryView";

export default async function CompanyDiscoveryPage({
  params,
}: {
  params: Promise<{ dataset: string }>;
}) {
  const { dataset } = await params;
  // key forces a fresh mount when the dataset changes, dropping local
  // filter state from the previous dataset.
  return <DiscoveryView key={dataset} />;
}
