import { redirect } from "next/navigation";
import ExecutiveDashboard from "@/components/ExecutiveDashboard";

const RESERVED_TOP_LEVEL = new Set([
  "discovery",
  "companies",
  "analytics",
  "settings",
  "help",
  "api",
  "login",
]);

const DEFAULT_COMPANY = "cohesity";

export default async function CompanyDashboardPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  if (RESERVED_TOP_LEVEL.has(company.toLowerCase())) {
    redirect(`/${DEFAULT_COMPANY}/${company.toLowerCase()}`);
  }
  return <ExecutiveDashboard company={company} />;
}
