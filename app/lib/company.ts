import { env } from "cloudflare:workers";

export type CompanySettings = {
  name: string;
  representative: string;
  registrationNumber: string;
  address: string;
  phone: string;
  email: string;
};

const emptySettings: CompanySettings = {
  name: "",
  representative: "",
  registrationNumber: "",
  address: "",
  phone: "",
  email: "",
};

export async function ensureSettingsTable() {
  if (!env.DB) return;
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS company_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL DEFAULT '',
      representative TEXT NOT NULL DEFAULT '',
      registration_number TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      updated_at INTEGER NOT NULL DEFAULT (unixepoch())
    )`,
  ).run();
}

export async function getCompanySettings(): Promise<CompanySettings | null> {
  try {
    await ensureSettingsTable();
    if (!env.DB) return null;
    const row = await env.DB.prepare(
      `SELECT name, representative, registration_number, address, phone, email
       FROM company_settings WHERE id = 1`,
    ).first<Record<string, string>>();
    if (!row) return null;
    const settings = {
      name: row.name ?? "",
      representative: row.representative ?? "",
      registrationNumber: row.registration_number ?? "",
      address: row.address ?? "",
      phone: row.phone ?? "",
      email: row.email ?? "",
    };
    return Object.values(settings).some(Boolean) ? settings : null;
  } catch {
    return null;
  }
}

export async function saveCompanySettings(input: Partial<CompanySettings>) {
  await ensureSettingsTable();
  if (!env.DB) throw new Error("데이터베이스를 사용할 수 없습니다.");
  const value = { ...emptySettings, ...input };
  await env.DB.prepare(
    `INSERT INTO company_settings
      (id, name, representative, registration_number, address, phone, email, updated_at)
     VALUES (1, ?, ?, ?, ?, ?, ?, unixepoch())
     ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      representative = excluded.representative,
      registration_number = excluded.registration_number,
      address = excluded.address,
      phone = excluded.phone,
      email = excluded.email,
      updated_at = unixepoch()`,
  )
    .bind(value.name, value.representative, value.registrationNumber, value.address, value.phone, value.email)
    .run();
}
