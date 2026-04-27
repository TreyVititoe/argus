import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { tenantForEmail } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

// If a valid session already exists for an allowed-domain email, send the
// user straight to their tenant dashboard instead of re-rendering the form.
export default async function LoginPage() {
  const supabase = await getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email;
  if (email) {
    const tenant = tenantForEmail(email);
    if (tenant) redirect(`/${tenant}`);
  }
  return <LoginForm />;
}
