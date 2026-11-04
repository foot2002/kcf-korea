import { loadInboxPublicKey, inboxRepo, inboxToken } from "@/lib/forms/config";
import { bytesToBase64, encryptRecord, type InboxRecord } from "@/lib/forms/crypto";
import { RETENTION, type FormName } from "@/lib/forms/schema";

const FAIL = "잠시 후 다시 시도하거나 cs@kcf-korea.org 로 보내 주세요.";
const WINDOW_MS = 10 * 60 * 1000;

export class SilentAccept extends Error {
  constructor() {
    super("silent");
    this.name = "SilentAccept";
  }
}

export class RateLimitError extends Error {
  constructor() {
    super("같은 신청은 10분 안에 3회까지 보낼 수 있습니다.");
    this.name = "RateLimitError";
  }
}

function timesKey(form: FormName) {
  return `kcf-form-times:${form}`;
}

function recentTimes(form: FormName) {
  try {
    const raw = JSON.parse(sessionStorage.getItem(timesKey(form)) ?? "[]") as unknown;
    const now = Date.now();
    return Array.isArray(raw) ? raw.filter((item): item is number => typeof item === "number" && now - item < WINDOW_MS) : [];
  } catch {
    return [];
  }
}

function rememberTime(form: FormName) {
  const next = [...recentTimes(form), Date.now()];
  sessionStorage.setItem(timesKey(form), JSON.stringify(next));
}

async function putContent(path: string, base64: string, message: string) {
  const repo = inboxRepo();
  const token = inboxToken();
  const url = `https://api.github.com/repos/${repo}/contents/${path.split("/").map(encodeURIComponent).join("/")}`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const body = JSON.stringify({ message, content: base64 });
  let response = await fetch(url, { method: "PUT", headers, body });
  if (response.status === 409) response = await fetch(url, { method: "PUT", headers, body });
  if (!response.ok) throw new Error(FAIL);
}

export async function submitForm(input: {
  form: FormName;
  data: unknown;
  file?: File | null;
  honeypot: string;
  openedAt: number;
  initialStatus: string;
  attachmentName?: string;
}) {
  if (input.honeypot.trim() || Date.now() - input.openedAt < 3000) throw new SilentAccept();
  if (recentTimes(input.form).length >= 3) throw new RateLimitError();
  const publicFile = await loadInboxPublicKey();
  if (!publicFile || !inboxRepo() || !inboxToken()) throw new Error(FAIL);
  const bytes = input.file ? new Uint8Array(await input.file.arrayBuffer()) : null;
  const { record, attachmentBytes } = await encryptRecord({
    publicFile,
    form: input.form,
    plaintext: {
      status: input.initialStatus,
      retention: RETENTION[input.form],
      data: input.data,
      attachmentName: input.attachmentName ?? "",
    },
    attachment: bytes ? { bytes, size: input.file?.size ?? bytes.length } : null,
  });
  if (attachmentBytes && record.attachment) {
    await putContent(record.attachment.path, bytesToBase64(attachmentBytes), `inbox: ${input.form} ${record.id.slice(0, 8)}`);
  }
  await putContent(recordPath(record), bytesToBase64(new TextEncoder().encode(JSON.stringify(record))), `inbox: ${input.form} ${record.id.slice(0, 8)}`);
  rememberTime(input.form);
  return record.id.slice(0, 8);
}

function recordPath(record: InboxRecord) {
  const date = new Date(record.createdAt);
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const stamp = record.createdAt.replace(/\D/g, "");
  return `data/${record.form}/${year}/${month}/${stamp}-${record.id.slice(0, 8)}.json`;
}

export function readFileGuard(file: File) {
  const allowed = ["application/pdf", "image/jpeg", "image/png"];
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!allowed.includes(file.type) && !["pdf", "jpg", "jpeg", "png"].includes(ext)) {
    return "PDF, JPG, PNG 파일만 올릴 수 있습니다.";
  }
  if (file.size > 5 * 1024 * 1024) return "5MB 이하 파일만 올릴 수 있습니다.";
  return "";
}
