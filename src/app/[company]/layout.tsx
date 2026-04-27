import { getSupabaseServer } from "@/lib/supabase/server";
import { tenantForEmail } from "@/lib/auth";
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
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const session =
    user?.email && tenantForEmail(user.email)
      ? { tenant: tenantForEmail(user.email)!, email: user.email }
      : null;

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
