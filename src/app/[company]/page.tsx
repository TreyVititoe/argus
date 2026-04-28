import { redirect } from "next/navigation";
import TenantOnboarding from "@/components/TenantOnboarding";
import { getTenantConfig } from "@/lib/tenants";
import { DEFAULT_DATASET } from "@/lib/datasets";

// /[company] now sends users to /[company]/[default-dataset]/.
// Tenants without data still see onboarding here.
export default async function CompanyRootPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const tenant = getTenantConfig(company);
  if (!tenant.hasData) {
    return <TenantOnboarding tenant={tenant} />;
  }
  redirect(`/${company}/${DEFAULT_DATASET}`);
}
