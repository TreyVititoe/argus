import ExecutiveDashboard from "@/components/ExecutiveDashboard";

export default async function CompanyDashboardPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  return <ExecutiveDashboard company={company} />;
}
