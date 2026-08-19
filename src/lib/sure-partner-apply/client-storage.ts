import type {
  SurePartnerApplication,
  SurePartnerApplyInput,
  SurePartnerApplyStatus,
} from "./types";
import { buildSurePartnerApplication } from "./types";

const STORAGE_KEY = "kcf-sure-partner-applications-v1";

function readAll(): SurePartnerApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SurePartnerApplication[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(records: SurePartnerApplication[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function generateId(existingCount: number): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const seq = String(existingCount + 1).padStart(4, "0");
  return `SP-${y}${m}${d}-${seq}`;
}

export function submitSurePartnerApplicationClient(
  data: SurePartnerApplyInput,
): { id: string } {
  const records = readAll();
  const now = new Date().toISOString();
  const record = buildSurePartnerApplication(data, generateId(records.length), now);
  records.push(record);
  writeAll(records);
  return { id: record.id };
}

export function listSurePartnerApplicationsClient(): SurePartnerApplication[] {
  return [...readAll()].reverse();
}

export function updateSurePartnerApplicationStatusClient(
  id: string,
  status: SurePartnerApplyStatus,
): void {
  const records = readAll();
  const index = records.findIndex((r) => r.id === id);
  if (index < 0) throw new Error("신청을 찾을 수 없습니다.");
  records[index] = {
    ...records[index]!,
    status,
    updatedAt: new Date().toISOString(),
  };
  writeAll(records);
}

export function updateSurePartnerApplicationMemoClient(id: string, adminMemo: string): void {
  const records = readAll();
  const index = records.findIndex((r) => r.id === id);
  if (index < 0) throw new Error("신청을 찾을 수 없습니다.");
  records[index] = {
    ...records[index]!,
    adminMemo,
    updatedAt: new Date().toISOString(),
  };
  writeAll(records);
}

export function deleteSurePartnerApplicationClient(id: string): void {
  writeAll(readAll().filter((r) => r.id !== id));
}
