import { getChatGPTUser } from "../../chatgpt-auth";
import { getCompanySettings, saveCompanySettings, type CompanySettings } from "../../lib/company";

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  return Response.json((await getCompanySettings()) ?? {});
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  const body = (await request.json()) as Partial<CompanySettings>;
  const allowed: (keyof CompanySettings)[] = ["name", "representative", "registrationNumber", "address", "phone", "email"];
  const clean = Object.fromEntries(allowed.map((key) => [key, String(body[key] ?? "").trim().slice(0, 200)]));
  await saveCompanySettings(clean);
  return Response.json({ ok: true });
}
