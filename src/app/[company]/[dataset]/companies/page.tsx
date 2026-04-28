import CompaniesView from "@/components/CompaniesView";

export default async function CompanyCompaniesPage({
  params,
}: {
  params: Promise<{ dataset: string }>;
}) {
  const { dataset } = await params;
  return <CompaniesView key={dataset} />;
}
