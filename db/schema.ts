import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const companySettings = sqliteTable("company_settings", {
  id: integer("id").primaryKey(),
  name: text("name").notNull().default(""),
  representative: text("representative").notNull().default(""),
  registrationNumber: text("registration_number").notNull().default(""),
  address: text("address").notNull().default(""),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().default(""),
  updatedAt: integer("updated_at").notNull(),
});
