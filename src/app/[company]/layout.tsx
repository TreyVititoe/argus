import { cookies } from "next/headers";
import { TENANT_COOKIE_NAME, readSession } from "@/lib/auth";
import { SessionProvider } from "@/components/SessionProvider";

export default async function CompanyLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = await readSession(cookieStore.get(TENANT_COOKIE_NAME)?.value);
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
