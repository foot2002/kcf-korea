import { createServerFn } from "@tanstack/react-start";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import type { ApplicationStatus, AssociationApplication } from "./types";
import { APPLICATION_STATUSES } from "./types";

const DATA_DIR = path.join(process.cwd(), "data", "association-applications");
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

async function loadApplications(): Promise<AssociationApplication[]> {
  await ensureStorage();
  const raw = await fs.readFile(JSON_PATH, "utf-8");
  return JSON.parse(raw) as AssociationApplication[];
}

async function saveApplications(records: AssociationApplication[]) {
  await fs.writeFile(JSON_PATH, JSON.stringify(records, null, 2), "utf-8");
}

function generateId(existingCount: number): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const seq = String(existingCount + 1).padStart(4, "0");
  return `APP-${y}${m}${d}-${seq}`;
}

const submitSchema = z.object({
  associationName: z.string().trim().min(1),
  websiteUrl: z.string().trim().min(1),
  memberCompanyCount: z.number().int().min(1),
  managerName: z.string().trim().min(1),
  managerPhone: z.string().trim().min(1),
  managerEmail: z.string().trim().email(),
  representativeName: z.string().trim().optional(),
  businessNumber: z.string().trim().optional(),
  establishedYear: z.string().trim().optional(),
  address: z.string().trim().optional(),
  industry: z.string().trim().optional(),
  smallBusinessMemberCount: z.string().trim().optional(),
  managerPosition: z.string().trim().optional(),
  preferredContactMethod: z.string().trim().optional(),
  message: z.string().trim().max(1000).optional(),
  privacyConsent: z.literal(true),
  newsletterConsent: z.boolean().optional(),
});

export const submitAssociationApplicationLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) => submitSchema.parse(data))
  .handler(async ({ data }) => {
    const records = await loadApplications();
    const now = new Date().toISOString();
    const record: AssociationApplication = {
      id: generateId(records.length),
      createdAt: now,
      associationName: data.associationName,
      websiteUrl: data.websiteUrl,
      memberCompanyCount: data.memberCompanyCount,
      managerName: data.managerName,
      managerPhone: data.managerPhone,
      managerEmail: data.managerEmail,
      representativeName: data.representativeName,
      businessNumber: data.businessNumber,
      establishedYear: data.establishedYear,
      address: data.address,
      industry: data.industry,
      smallBusinessMemberCount: data.smallBusinessMemberCount,
      managerPosition: data.managerPosition,
      preferredContactMethod: data.preferredContactMethod,
      message: data.message,
      privacyConsent: true,
      newsletterConsent: data.newsletterConsent,
      status: "접수완료",
      updatedAt: now,
    };
    records.push(record);
    await saveApplications(records);
    return { id: record.id };
  });

export const listAssociationApplicationsLocal = createServerFn({ method: "POST" })
  .validator((data: { adminKey: string }) => {
    assertAdmin(data.adminKey);
    return data;
  })
  .handler(async () => {
    const records = await loadApplications();
    return [...records].reverse();
  });

export const updateAssociationApplicationStatusLocal = createServerFn({ method: "POST" })
  .validator((data: { adminKey: string; id: string; status: ApplicationStatus }) => {
    assertAdmin(data.adminKey);
    if (!APPLICATION_STATUSES.includes(data.status)) {
      throw new Error("유효하지 않은 상태입니다.");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const records = await loadApplications();
    const index = records.findIndex((r) => r.id === data.id);
    if (index < 0) throw new Error("신청을 찾을 수 없습니다.");
    records[index] = {
      ...records[index]!,
      status: data.status,
      updatedAt: new Date().toISOString(),
    };
    await saveApplications(records);
  });

export const updateAssociationApplicationMemoLocal = createServerFn({ method: "POST" })
  .validator((data: { adminKey: string; id: string; adminMemo: string }) => {
    assertAdmin(data.adminKey);
    return data;
  })
  .handler(async ({ data }) => {
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
