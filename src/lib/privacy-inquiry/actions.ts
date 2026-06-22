import { createServerFn } from "@tanstack/react-start";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import {
  isAllowedAttachmentName,
  MAX_ATTACHMENT_BYTES,
  MAX_ATTACHMENTS_PER_INQUIRY,
  MAX_TOTAL_ATTACHMENTS_BYTES,
} from "@/lib/privacy-inquiry/config";
import type {
  PrivacyInquiryAttachment,
  PrivacyInquiryRecord,
} from "@/lib/privacy-inquiry/types";
import { parseWithUserError } from "@/lib/privacy-inquiry/errors";

const DATA_DIR = path.join(process.cwd(), "data", "privacy-inquiries");
const FILES_DIR = path.join(DATA_DIR, "files");
const JSON_PATH = path.join(DATA_DIR, "inquiries.json");

function getAdminKey(): string {
  return process.env.PRIVACY_ADMIN_KEY ?? "kcf2026";
}

function assertAdmin(adminKey: string) {
  if (adminKey !== getAdminKey()) {
    throw new Error("관리자 인증에 실패했습니다.");
  }
}

async function ensureStorage() {
  await fs.mkdir(FILES_DIR, { recursive: true });
  try {
    await fs.access(JSON_PATH);
  } catch {
    await fs.writeFile(JSON_PATH, "[]", "utf-8");
  }
}

async function loadInquiries(): Promise<PrivacyInquiryRecord[]> {
  await ensureStorage();
  const raw = await fs.readFile(JSON_PATH, "utf-8");
  return JSON.parse(raw) as PrivacyInquiryRecord[];
}

async function saveInquiries(records: PrivacyInquiryRecord[]) {
  await fs.writeFile(JSON_PATH, JSON.stringify(records, null, 2), "utf-8");
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w.\-()가-힣]/g, "_").slice(0, 120);
}

const attachmentInputSchema = z.object({
  name: z.string().min(1),
  mimeType: z.string(),
  size: z.number().positive().max(MAX_ATTACHMENT_BYTES),
  dataBase64: z.string().min(1),
});

const submitSchema = z.object({
  name: z.string().trim().min(1, "이름 또는 기관명을 입력해 주세요."),
  email: z.string().trim().email("올바른 이메일을 입력해 주세요."),
  phone: z.string().trim().optional(),
  type: z.string().trim().min(1, "문의 유형을 선택해 주세요."),
  content: z.string().trim().min(10, "문의 내용을 10자 이상 입력해 주세요."),
  consent: z.literal(true, {
    errorMap: () => ({ message: "개인정보 수집·이용에 동의해 주세요." }),
  }),
  attachments: z.array(attachmentInputSchema).max(MAX_ATTACHMENTS_PER_INQUIRY).optional(),
});

export const submitPrivacyInquiry = createServerFn({ method: "POST" })
  .validator((data: unknown) => parseWithUserError(submitSchema, data))
  .handler(async ({ data }) => {
    const attachments = data.attachments ?? [];

    if (attachments.length > MAX_ATTACHMENTS_PER_INQUIRY) {
      throw new Error(`첨부파일은 최대 ${MAX_ATTACHMENTS_PER_INQUIRY}개까지 가능합니다.`);
    }

    const totalSize = attachments.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > MAX_TOTAL_ATTACHMENTS_BYTES) {
      throw new Error("첨부파일 총 용량이 10MB를 초과합니다.");
    }

    for (const file of attachments) {
      if (!isAllowedAttachmentName(file.name)) {
        throw new Error(`허용되지 않는 파일 형식입니다: ${file.name}`);
      }
      if (file.size > MAX_ATTACHMENT_BYTES) {
        throw new Error(`파일 용량은 5MB 이하여야 합니다: ${file.name}`);
      }
    }

    await ensureStorage();

    const inquiryId = crypto.randomUUID();
    const savedAttachments: PrivacyInquiryAttachment[] = [];

    for (const file of attachments) {
      const attachmentId = crypto.randomUUID();
      const safeName = sanitizeFilename(file.name);
      const storedName = `${inquiryId}_${attachmentId}_${safeName}`;
      const filePath = path.join(FILES_DIR, storedName);

      const buffer = Buffer.from(file.dataBase64, "base64");
      if (buffer.byteLength > MAX_ATTACHMENT_BYTES) {
        throw new Error(`파일 용량이 제한을 초과합니다: ${file.name}`);
      }

      await fs.writeFile(filePath, buffer);

      savedAttachments.push({
        id: attachmentId,
        originalName: file.name,
        storedName,
        mimeType: file.mimeType,
        size: buffer.byteLength,
      });
    }

    const record: PrivacyInquiryRecord = {
      id: inquiryId,
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      type: data.type,
      content: data.content,
      attachments: savedAttachments,
      createdAt: new Date().toISOString(),
      status: "new",
    };

    const records = await loadInquiries();
    records.unshift(record);
    await saveInquiries(records);

    return { ok: true as const, id: inquiryId };
  });

const adminKeySchema = z.object({
  adminKey: z.string().min(1),
});

export const verifyPrivacyAdmin = createServerFn({ method: "POST" })
  .validator((data: unknown) => adminKeySchema.parse(data))
  .handler(async ({ data }) => {
    return { ok: data.adminKey === getAdminKey() };
  });

export const listPrivacyInquiries = createServerFn({ method: "POST" })
  .validator((data: unknown) => adminKeySchema.parse(data))
  .handler(async ({ data }) => {
    assertAdmin(data.adminKey);
    const records = await loadInquiries();
    return records.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  });

export const markPrivacyInquiryRead = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    adminKeySchema.extend({ inquiryId: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data }) => {
    assertAdmin(data.adminKey);
    const records = await loadInquiries();
    const idx = records.findIndex((r) => r.id === data.inquiryId);
    if (idx === -1) throw new Error("문의를 찾을 수 없습니다.");
    records[idx] = { ...records[idx], status: "read" };
    await saveInquiries(records);
    return { ok: true as const };
  });

export const deletePrivacyInquiry = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    adminKeySchema.extend({ inquiryId: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data }) => {
    assertAdmin(data.adminKey);
    const records = await loadInquiries();
    const target = records.find((r) => r.id === data.inquiryId);
    if (!target) throw new Error("문의를 찾을 수 없습니다.");

    for (const file of target.attachments) {
      try {
        await fs.unlink(path.join(FILES_DIR, file.storedName));
      } catch {
        /* ignore missing files */
      }
    }

    await saveInquiries(records.filter((r) => r.id !== data.inquiryId));
    return { ok: true as const };
  });

export const downloadPrivacyAttachment = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    adminKeySchema
      .extend({
        inquiryId: z.string().uuid(),
        attachmentId: z.string().uuid(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    assertAdmin(data.adminKey);
    const records = await loadInquiries();
    const inquiry = records.find((r) => r.id === data.inquiryId);
    if (!inquiry) throw new Error("문의를 찾을 수 없습니다.");

    const attachment = inquiry.attachments.find((a) => a.id === data.attachmentId);
    if (!attachment) throw new Error("첨부파일을 찾을 수 없습니다.");

    const filePath = path.join(FILES_DIR, attachment.storedName);
    const buffer = await fs.readFile(filePath);

    return {
      originalName: attachment.originalName,
      mimeType: attachment.mimeType,
      dataBase64: buffer.toString("base64"),
    };
  });
