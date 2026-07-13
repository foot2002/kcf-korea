import type {
  ApplicationStatus,
  AssociationApplication,
  SupportApplicationInput,
} from "./types";
import { buildApplicationRecord } from "./types";

const STORAGE_KEY = "kcf-association-applications-v1";

function readAll(): AssociationApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AssociationApplication[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(records: AssociationApplication[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function generateId(existingCount: number): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const seq = String(existingCount + 1).padStart(4, "0");
  return `APP-${y}${m}${d}-${seq}`;
}

export function submitAssociationApplicationClient(
  data: SupportApplicationInput,
): { id: string } {
  const records = readAll();
  const now = new Date().toISOString();
  const record = buildApplicationRecord(data, generateId(records.length), now);
  records.push(record);
  writeAll(records);
  return { id: record.id };
}

export function listAssociationApplicationsClient(): AssociationApplication[] {
  return [...readAll()].reverse();
}

export function updateAssociationApplicationStatusClient(
  id: string,
  status: ApplicationStatus,
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

export function updateAssociationApplicationMemoClient(
  id: string,
  adminMemo: string,
): void {
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

export async function hydrateAssociationApplicationsClient(): Promise<AssociationApplication[]> {
  try {
    const res = await fetch("/association-applications-data.json", { cache: "no-store" });
    if (!res.ok) return listAssociationApplicationsClient();
    const remote = (await res.json()) as AssociationApplication[];
    if (!Array.isArray(remote) || remote.length === 0) {
      return listAssociationApplicationsClient();
    }
    const map = new Map<string, AssociationApplication>();
    for (const item of remote) map.set(item.id, item);
    for (const item of readAll()) map.set(item.id, item);
    const merged = [...map.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    writeAll(merged);
    return merged;
  } catch {
    return listAssociationApplicationsClient();
  }
}
