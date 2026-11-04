import { FIELD_LABELS } from "@/data/inbox-admin";
import type { InboxRecord } from "@/lib/forms/crypto";
import { FORM_NAMES, STATUSES, type FormName } from "@/lib/forms/schema";

export type AppPlain = {
  status: string;
  retention: string;
  data: Record<string, unknown>;
  attachmentName: string;
};

export type StatusPlain = {
  status: string;
  adminMemo: string;
  retentionUntil: string;
  updatedAt: string;
  updatedBy: string;
};

export type InboxItem = {
  id: string;
  form: FormName;
  createdAt: string;
  path: string;
  sha: string;
  record: InboxRecord;
  plain: AppPlain | null;
  overlay: StatusPlain | null;
  overlaySha: string | null;
  attachmentSha: string | null;
};

const FORMS = new Set<string>(Object.values(FORM_NAMES));

export function isFormName(value: string): value is FormName {
  return FORMS.has(value);
}

export function localDate(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function maskMiddle(value: string) {
  const chars = [...value.trim()];
  if (chars.length <= 1) return chars.join("");
  if (chars.length === 2) return `${chars[0]}*`;
  return `${chars[0]}${"*".repeat(chars.length - 2)}${chars[chars.length - 1]}`;
}

function textOf(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function rawName(item: InboxItem) {
  const data = item.plain?.data;
  if (!data) return "";
  return textOf(data.orgName) || textOf(data.company) || textOf(data.name);
}

export function maskedName(item: InboxItem) {
  const name = rawName(item);
  return name ? maskMiddle(name) : "열 수 없음";
}

export function kindLabel(item: InboxItem) {
  const data = item.plain?.data ?? {};
  if (item.form === FORM_NAMES.free) return textOf(data.orgKind);
  if (item.form === FORM_NAMES.cpo) return textOf(data.promotion);
  if (item.form === FORM_NAMES.pledge) return "실천선언";
  if (item.form === FORM_NAMES.monitor) return textOf(data.region);
  return textOf(data.type);
}

export function effectiveStatus(item: InboxItem) {
  return item.overlay?.status || item.plain?.status || STATUSES[item.form][0];
}

function shiftDate(iso: string, months: number) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return localDate(new Date(date.getFullYear(), date.getMonth() + months, date.getDate()));
}

export function defaultRetentionUntil(form: FormName, createdAt: string, status: string, statusAt: string) {
  const changed = statusAt || createdAt;
  if (form === FORM_NAMES.free) return status === "이용 종료" || status === "반려" ? localDate(new Date(changed)) : "";
  if (form === FORM_NAMES.cpo) return status === "지원 종료" || status === "반려" ? localDate(new Date(changed)) : "";
  if (form === FORM_NAMES.pledge) return status === "게시 종료" || status === "반려" ? shiftDate(changed, 12) : "";
  if (form === FORM_NAMES.monitor) return status === "미선발" ? shiftDate(changed, 6) : shiftDate(createdAt, 18);
  if (status === "답변 완료" || status === "종결") return shiftDate(changed, 36);
  return "";
}

export function retentionUntil(item: InboxItem) {
  if (item.overlay?.retentionUntil) return item.overlay.retentionUntil;
  return defaultRetentionUntil(item.form, item.createdAt, effectiveStatus(item), item.overlay?.updatedAt || item.createdAt);
}

export function isExpired(item: InboxItem, today = localDate()) {
  const until = retentionUntil(item);
  return Boolean(until) && until <= today;
}

export function isWithin7Days(item: InboxItem, now = Date.now()) {
  const time = new Date(item.createdAt).getTime();
  return Number.isFinite(time) && now - time <= 7 * 24 * 60 * 60 * 1000 && now >= time;
}

export function firstStatusCounts(items: InboxItem[]) {
  const counts = {} as Record<FormName, number>;
  for (const form of Object.values(FORM_NAMES)) {
    counts[form] = items.filter((item) => item.form === form && effectiveStatus(item) === STATUSES[form][0]).length;
  }
  return counts;
}

export function fieldText(value: unknown) {
  if (typeof value === "boolean") return value ? "예" : "아니오";
  if (Array.isArray(value)) return value.map((item) => String(item)).join(", ");
  if (value == null) return "";
  return String(value);
}

export function searchText(item: InboxItem) {
  const data = item.plain?.data ?? {};
  return [rawName(item), kindLabel(item), effectiveStatus(item), item.overlay?.adminMemo ?? "", ...Object.values(data).map(fieldText)]
    .join(" ")
    .toLowerCase();
}

export function csvFor(items: InboxItem[]) {
  const header = ["접수번호", "접수일", "종류", "이름", "구분", "상태", "보유기간 만료일", "메모"];
  const lines = [header, ...items.map((item) => [item.id, item.createdAt, item.form, rawName(item), kindLabel(item), effectiveStatus(item), retentionUntil(item), item.overlay?.adminMemo ?? ""])];
  const body = lines.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\r\n");
  return `\uFEFF${body}`;
}

export function labelFor(key: string) {
  return FIELD_LABELS[key] ?? key;
}

export function asAppPlain(value: unknown): AppPlain | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (!row.data || typeof row.data !== "object" || typeof row.status !== "string") return null;
  return {
    status: row.status,
    retention: typeof row.retention === "string" ? row.retention : "",
    data: row.data as Record<string, unknown>,
    attachmentName: typeof row.attachmentName === "string" ? row.attachmentName : "",
  };
}

export function asStatusPlain(value: unknown): StatusPlain | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.status !== "string" || "data" in row) return null;
  return {
    status: row.status,
    adminMemo: typeof row.adminMemo === "string" ? row.adminMemo : "",
    retentionUntil: typeof row.retentionUntil === "string" ? row.retentionUntil : "",
    updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : "",
    updatedBy: typeof row.updatedBy === "string" ? row.updatedBy : "",
  };
}
