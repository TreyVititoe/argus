import VendorsView from "@/components/VendorsView";

export default async function CompanyVendorsPage({
  params,
}: {
  params: Promise<{ dataset: string }>;
}) {
  const { dataset } = await params;
  return <VendorsView key={dataset} />;
}
