import type {
  ContactInquiry,
  ContactInquiryInput,
  ContactInquiryStatus,
} from "./types";

const STORAGE_KEY = "kcf-contact-inquiries-v1";

function readAll(): ContactInquiry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ContactInquiry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(records: ContactInquiry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function generateId(existingCount: number): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const seq = String(existingCount + 1).padStart(4, "0");
  return `CTC-${y}${m}${d}-${seq}`;
}

export function submitContactInquiryClient(data: ContactInquiryInput): { id: string } {
  const records = readAll();
  const now = new Date().toISOString();
  const record: ContactInquiry = {
    ...data,
    id: generateId(records.length),
    createdAt: now,
    updatedAt: now,
    status: "접수완료",
  };
  records.push(record);
  writeAll(records);
  return { id: record.id };
}

export function listContactInquiriesClient(): ContactInquiry[] {
  return [...readAll()].reverse();
}

export function updateContactInquiryStatusClient(id: string, status: ContactInquiryStatus): void {
  const records = readAll();
  const index = records.findIndex((r) => r.id === id);
  if (index < 0) throw new Error("문의를 찾을 수 없습니다.");
  records[index] = {
    ...records[index]!,
    status,
    updatedAt: new Date().toISOString(),
  };
  writeAll(records);
}

export function updateContactInquiryMemoClient(id: string, adminMemo: string): void {
  const records = readAll();
  const index = records.findIndex((r) => r.id === id);
  if (index < 0) throw new Error("문의를 찾을 수 없습니다.");
  records[index] = {
    ...records[index]!,
    adminMemo,
    updatedAt: new Date().toISOString(),
  };
  writeAll(records);
}

export function deleteContactInquiryClient(id: string): void {
  const records = readAll().filter((r) => r.id !== id);
  writeAll(records);
}
