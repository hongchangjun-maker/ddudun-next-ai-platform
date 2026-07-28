import { headers } from "next/headers";
import { getCompanySettings, saveCompanySettings, type CompanySettings } from "../../lib/company";

async function isAdmin() {
  return (await headers()).get("x-ai-unipass-admin-authorized") === "1";
}

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  return Response.json((await getCompanySettings()) ?? {});
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "관리자 인증이 필요합니다." }, { status: 401 });
  const body = (await request.json()) as Partial<CompanySettings>;
  const allowed: (keyof CompanySettings)[] = ["name", "representative", "registrationNumber", "address", "phone", "email"];
  const clean = Object.fromEntries(allowed.map((key) => [key, String(body[key] ?? "").trim().slice(0, 200)]));
  await saveCompanySettings(clean);
  return Response.json({ ok: true });
}
