import SettingsView from "@/components/SettingsView";

export default async function CompanySettingsPage({
  params,
}: {
  params: Promise<{ dataset: string }>;
}) {
  const { dataset } = await params;
  return <SettingsView key={dataset} />;
}
