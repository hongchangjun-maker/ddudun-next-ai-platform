import { headers } from "next/headers";
import { getCompanySettings } from "../lib/company";
import { AdminSettings } from "./settings";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const requestHeaders = await headers();
  const user = requestHeaders.get("x-ai-unipass-admin-user") ?? "Cloudflare 관리자";
  const company = await getCompanySettings();
  return <AdminSettings user={user} initial={company} />;
}
