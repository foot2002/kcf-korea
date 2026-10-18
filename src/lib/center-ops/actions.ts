import { createServerFn } from "@tanstack/react-start";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import { CAMPAIGN_STATUSES, KOREA_REGIONS, MONITOR_INTERESTS, MONITOR_MODES, MONITOR_STATUSES, POLICY_STATUSES } from "@/data/privacy-program";
import {
  applyEducationOverride,
  applyPolicyPatch,
  applyPublicationPatch,
  buildPublicContent,
  emptyDb,
  lookupCampaign,
  lookupMonitor,
  submitCampaign,
  submitEnrollment,
  submitMonitor,
  supplementCampaign,
  updateCampaign,
  updateMonitor,
  verifySureMark,
} from "@/lib/center-ops/logic";
import type { OpsDb } from "@/lib/center-ops/types";

const DATA_PATH = path.join(process.cwd(), "data", "privacy-center-ops", "store.json");

function assertAdmin(adminKey: string) {
  const expected = (process.env.PRIVACY_ADMIN_KEY ?? "kcf2026").trim();
  if (adminKey.trim() !== expected) throw new Error("관리자 인증에 실패했습니다.");
}

async function loadDb(): Promise<OpsDb> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return { ...emptyDb(), ...(JSON.parse(raw) as OpsDb) };
  } catch {
    return emptyDb();
  }
}

async function saveDb(db: OpsDb) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(db, null, 2), "utf-8");
}

const fileSchema = z.object({
  name: z.string().min(1).max(180),
  mimeType: z.string().min(1).max(120),
  dataUrl: z.string().min(1).max(1_800_000),
}).optional();

const monitorSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().max(30).optional(),
  region: z.enum(KOREA_REGIONS),
  interests: z.array(z.enum(MONITOR_INTERESTS)).min(1),
  motivation: z.string().trim().min(1).max(2000),
  participationMode: z.enum(MONITOR_MODES),
  privacyConsent: z.literal(true),
  notifyConsent: z.boolean(),
});

const campaignSchema = z.object({
  organizationName: z.string().trim().min(1),
  managerName: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(1),
  purpose: z.string().trim().min(1).max(2000),
  municipality: z.string().trim().min(1),
  department: z.string().trim().min(1),
  eventName: z.string().trim().min(1),
  eventPurpose: z.string().trim().min(1),
  eventPeriod: z.string().trim().min(1),
  expectedParticipants: z.string().trim().min(1),
  collectedItems: z.string().trim().min(1),
  attachment: fileSchema,
  privacyConsent: z.literal(true),
});

const enrollSchema = z.object({
  educationSlug: z.string().trim().min(1),
  name: z.string().trim().min(1),
  organization: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().max(30).optional(),
  privacyConsent: z.literal(true),
});

export const submitMonitorLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) => monitorSchema.parse(data))
  .handler(async ({ data }) => {
    const result = submitMonitor(await loadDb(), data, new Date().toISOString());
    await saveDb(result.db);
    return { id: result.id };
  });

export const lookupMonitorLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string(), email: z.string().email() }).parse(data))
  .handler(async ({ data }) => lookupMonitor(await loadDb(), data.id, data.email));

export const listMonitorLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ adminKey: z.string() }).parse(data))
  .handler(async ({ data }) => {
    assertAdmin(data.adminKey);
    return [...(await loadDb()).monitorApplications].reverse();
  });

export const updateMonitorLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({
      adminKey: z.string(),
      id: z.string(),
      status: z.enum(MONITOR_STATUSES).optional(),
      publicNote: z.string().optional(),
      adminMemo: z.string().optional(),
      alertUnread: z.boolean().optional(),
    }).parse(data),
  )
  .handler(async ({ data }) => {
    assertAdmin(data.adminKey);
    const { adminKey: _adminKey, id, ...patch } = data;
    await saveDb(updateMonitor(await loadDb(), id, patch, new Date().toISOString()));
  });

export const submitCampaignLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) => campaignSchema.parse(data))
  .handler(async ({ data }) => {
    const result = submitCampaign(await loadDb(), data, new Date().toISOString());
    await saveDb(result.db);
    return { id: result.id };
  });

export const lookupCampaignLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string(), email: z.string().email() }).parse(data))
  .handler(async ({ data }) => lookupCampaign(await loadDb(), data.id, data.email));

export const supplementCampaignLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({
      id: z.string(),
      email: z.string().email(),
      note: z.string().min(1),
      file: fileSchema,
    }).parse(data),
  )
  .handler(async ({ data }) => {
    await saveDb(supplementCampaign(await loadDb(), data.id, data.email, data.note, data.file, new Date().toISOString()));
  });

export const listCampaignLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ adminKey: z.string() }).parse(data))
  .handler(async ({ data }) => {
    assertAdmin(data.adminKey);
    return [...(await loadDb()).campaignApplications].reverse();
  });

export const updateCampaignLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({
      adminKey: z.string(),
      id: z.string(),
      status: z.enum(CAMPAIGN_STATUSES).optional(),
      publicNote: z.string().optional(),
      adminMemo: z.string().optional(),
      licenseCode: z.string().optional(),
      alertUnread: z.boolean().optional(),
    }).parse(data),
  )
  .handler(async ({ data }) => {
    assertAdmin(data.adminKey);
    const { adminKey: _key, id, ...patch } = data;
    await saveDb(updateCampaign(await loadDb(), id, patch, new Date().toISOString()));
  });

export const submitEnrollmentLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) => enrollSchema.parse(data))
  .handler(async ({ data }) => {
    const result = submitEnrollment(await loadDb(), data, new Date().toISOString());
    await saveDb(result.db);
    return { id: result.id };
  });

export const listEnrollmentLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ adminKey: z.string() }).parse(data))
  .handler(async ({ data }) => {
    assertAdmin(data.adminKey);
    return [...(await loadDb()).educationEnrollments].reverse();
  });

export const getPublicContentLocal = createServerFn({ method: "GET" }).handler(async () => {
  return buildPublicContent(await loadDb(), Date.now());
});

export const getOpsLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ adminKey: z.string() }).parse(data))
  .handler(async ({ data }) => {
    assertAdmin(data.adminKey);
    return loadDb();
  });

export const saveOpsLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ adminKey: z.string(), db: z.custom<OpsDb>() }).parse(data))
  .handler(async ({ data }) => {
    assertAdmin(data.adminKey);
    const current = await loadDb();
    let next = current;
    if (data.db.educationOverrides) {
      for (const [slug, patch] of Object.entries(data.db.educationOverrides)) {
        next = applyEducationOverride(next, { slug, ...patch });
      }
    }
    next = {
      ...current,
      ...data.db,
      monitorApplications: current.monitorApplications,
      campaignApplications: current.campaignApplications,
      educationEnrollments: current.educationEnrollments,
    };
    if (data.db.policyOverrides) {
      next = { ...next, policyOverrides: data.db.policyOverrides };
      for (const [slug, patch] of Object.entries(data.db.policyOverrides)) {
        if (patch.status && !POLICY_STATUSES.includes(patch.status)) {
          throw new Error("정책 상태가 올바르지 않습니다.");
        }
      }
    }
    await saveDb(next);
    return buildPublicContent(next, Date.now());
  });

export const verifySureMarkLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ code: z.string() }).parse(data))
  .handler(async ({ data }) => verifySureMark(await loadDb(), data.code));

export const patchPolicyLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({
      adminKey: z.string(),
      slug: z.string(),
      status: z.enum(POLICY_STATUSES).optional(),
      followUp: z.string().optional(),
      proposedOn: z.string().optional(),
    }).parse(data),
  )
  .handler(async ({ data }) => {
    assertAdmin(data.adminKey);
    const db = applyPolicyPatch(await loadDb(), data.slug, {
      status: data.status,
      followUp: data.followUp,
      proposedOn: data.proposedOn,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    await saveDb(db);
  });

export const patchPublicationLocal = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z.object({
      adminKey: z.string(),
      slug: z.string(),
      attachmentUrl: z.string().optional(),
      attachmentName: z.string().optional(),
      externalUrl: z.string().optional(),
      published: z.boolean().optional(),
    }).parse(data),
  )
  .handler(async ({ data }) => {
    assertAdmin(data.adminKey);
    const { adminKey: _key, slug, ...patch } = data;
    await saveDb(applyPublicationPatch(await loadDb(), slug, patch));
  });
