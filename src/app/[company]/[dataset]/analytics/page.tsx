import AnalyticsView from "@/components/AnalyticsView";

export default async function CompanyAnalyticsPage({
  params,
}: {
  params: Promise<{ dataset: string }>;
}) {
  const { dataset } = await params;
  return <AnalyticsView key={dataset} />;
}
