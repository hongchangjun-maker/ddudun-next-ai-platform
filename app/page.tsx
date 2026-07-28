import { getCompanySettings } from "./lib/company";
import { Platform } from "./platform";

export const dynamic = "force-dynamic";

export default async function Home() {
  const company = await getCompanySettings();
  return <Platform company={company} />;
}
