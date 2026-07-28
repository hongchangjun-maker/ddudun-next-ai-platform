import { requireChatGPTUser } from "../chatgpt-auth";
import { getCompanySettings } from "../lib/company";
import { AdminSettings } from "./settings";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  const company = await getCompanySettings();
  return <AdminSettings user={user.displayName} initial={company} />;
}
