import ExecutiveDashboard from "@/components/ExecutiveDashboard";

export default async function CompanyDatasetDashboardPage({
  params,
}: {
  params: Promise<{ company: string; dataset: string }>;
}) {
  const { company, dataset } = await params;
  return <ExecutiveDashboard key={dataset} company={company} datasetSlug={dataset} />;
}
