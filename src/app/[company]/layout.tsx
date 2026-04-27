import { cookies } from "next/headers";
import { TENANT_COOKIE_NAME, readSession } from "@/lib/auth";
import { SessionProvider } from "@/components/SessionProvider";
import TenantOnboarding from "@/components/TenantOnboarding";
import { getTenantConfig } from "@/lib/tenants";

export default async function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const cookieStore = await cookies();
  const session = await readSession(cookieStore.get(TENANT_COOKIE_NAME)?.value);
  const tenant = getTenantConfig(company);

  if (!tenant.hasData) {
    return (
      <SessionProvider session={session}>
        <TenantOnboarding tenant={tenant} />
      </SessionProvider>
    );
  }

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
