import { createServerFn } from "@tanstack/react-start";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import type { SurePartnerApplication, SurePartnerApplyStatus } from "./types";
import { SURE_PARTNER_APPLY_STATUSES, buildSurePartnerApplication } from "./types";

const DATA_DIR = path.join(process.cwd(), "data", "sure-partner-applications");
const JSON_PATH = path.join(DATA_DIR, "applications.json");

function getAdminKey(): string {
  return (process.env.PRIVACY_ADMIN_KEY ?? "kcf2026").trim();
}

function assertAdmin(adminKey: string) {
  if (adminKey.trim() !== getAdminKey()) {
    throw new Error("관리자 인증에 실패했습니다.");
  }
}

async function ensureStorage() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(JSON_PATH);
  } catch {
    await fs.writeFile(JSON_PATH, "[]", "utf-8");
  }
}

async function loadApplications(): Promise<SurePartnerApplication[]> {
  await ensureStorage();
  const raw = await fs.readFile(JSON_PATH, "utf-8");
  return JSON.parse(raw) as SurePartnerApplication[];
}

async function saveApplications(records: SurePartnerApplication[]) {
  await fs.writeFile(JSON_PATH, JSON.stringify(records, null, 2), "utf-8");
}

function generateId(existingCount: number): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const seq = String(existingCount + 1).padStart(4, "0");
  return `SP-${y}${m}${d}-${seq}`;
}

const submitSchema = z.object({
  companyName: z.string().trim().min(1),
  managerName: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  email: z
    .string()
    .trim()
    .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "이메일 형식이 올바르지 않습니다."),
  serviceName: z.string().trim().min(1),
  strengths: z.string().trim().min(10).max(2000),
});

export const submitSurePartnerApplicationLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) => submitSchema.parse(data))
  .handler(async ({ data }) => {
    const records = await loadApplications();
    const now = new Date().toISOString();
    const record = buildSurePartnerApplication(data, generateId(records.length), now);
    records.push(record);
    await saveApplications(records);
    return { id: record.id };
  });

export const listSurePartnerApplicationsLocal = createServerFn({ method: "GET" })
  .validator((data: unknown) =>
    z.object({ adminKey: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    assertAdmin(data.adminKey);
    const records = await loadApplications();
    return [...records].reverse();
  });

export const updateSurePartnerApplicationStatusLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        adminKey: z.string().min(1),
        id: z.string().min(1),
        status: z.enum(SURE_PARTNER_APPLY_STATUSES),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    assertAdmin(data.adminKey);
    const records = await loadApplications();
    const index = records.findIndex((r) => r.id === data.id);
    if (index < 0) throw new Error("신청을 찾을 수 없습니다.");
    records[index] = {
      ...records[index]!,
      status: data.status as SurePartnerApplyStatus,
      updatedAt: new Date().toISOString(),
    };
    await saveApplications(records);
  });

export const updateSurePartnerApplicationMemoLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        adminKey: z.string().min(1),
        id: z.string().min(1),
        adminMemo: z.string().max(2000),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    assertAdmin(data.adminKey);
    const records = await loadApplications();
    const index = records.findIndex((r) => r.id === data.id);
    if (index < 0) throw new Error("신청을 찾을 수 없습니다.");
    records[index] = {
      ...records[index]!,
      adminMemo: data.adminMemo,
      updatedAt: new Date().toISOString(),
    };
    await saveApplications(records);
  });

export const deleteSurePartnerApplicationLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({ adminKey: z.string().min(1), id: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    assertAdmin(data.adminKey);
    const records = await loadApplications();
    await saveApplications(records.filter((r) => r.id !== data.id));
  });
