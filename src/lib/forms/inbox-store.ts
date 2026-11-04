import { CONTENT_REPO } from "@/lib/content/types";
import { base64ToUtf8, readContentFile, utf8ToBase64, writeContentFile } from "@/lib/content/github";
import { inboxRepo } from "@/lib/forms/config";
import { bytesToBase64, decryptRecord, encryptRecord, type InboxPublicKeyFile, type InboxRecord } from "@/lib/forms/crypto";
import { asAppPlain, asStatusPlain, isFormName, localDate, type InboxItem, type StatusPlain } from "@/lib/forms/inbox-model";

const API = "https://api.github.com";
const INBOX_BRANCH = "main";

export type RepoAccess = { ok: boolean; push: boolean; detail: string };
export type RemovedFile = { path: string; parentSha: string; date: string; commitSha: string };
export type AuditLine = { at: string; login: string; action: string; form: string; id: string };

function headers(token: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function errorText(status: number) {
  if (status === 401) return "토큰이 올바르지 않습니다.";
  if (status === 403) return "토큰 권한이 부족하거나 사용 한도를 넘었습니다.";
  if (status === 404) return "저장소 또는 파일을 찾지 못했습니다.";
  return `GitHub 응답 오류 (${status})`;
}

export function inboxRepoName() {
  return inboxRepo();
}

function assertInboxRepo(repo: string) {
  if (!repo || repo === CONTENT_REPO) throw new Error("보관함 저장소가 설정되지 않았거나 사이트 저장소와 같습니다.");
}

function encodedPath(path: string) {
  return path.split("/").map((part) => encodeURIComponent(part)).join("/");
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error(errorText(response.status));
  return (await response.json()) as T;
}

export async function probeRepo(token: string, repo: string): Promise<RepoAccess> {
  if (!repo) return { ok: false, push: false, detail: "설정 없음" };
  const response = await fetch(`${API}/repos/${repo}`, { headers: headers(token) });
  if (!response.ok) return { ok: false, push: false, detail: errorText(response.status) };
  const body = (await response.json()) as { permissions?: { push?: boolean } };
  const push = body.permissions?.push === true;
  return { ok: true, push, detail: push ? "접근 가능" : "읽기만 가능" };
}

export async function readSitePublicKey(token: string): Promise<{ sha: string | null; file: InboxPublicKeyFile | null }> {
  const found = await readContentFile(token, "inbox-public-key.json");
  if (!found) return { sha: null, file: null };
  try {
    const file = JSON.parse(found.text) as InboxPublicKeyFile;
    if (!file?.keyId || file.alg !== "RSA-OAEP-256" || file.jwk?.d) return { sha: found.sha, file: null };
    return { sha: found.sha, file };
  } catch {
    return { sha: found.sha, file: null };
  }
}

export async function publishPublicKey(token: string, file: InboxPublicKeyFile, sha: string | null) {
  if (file.jwk.d) throw new Error("공개 키 파일에 개인 키가 들어 있습니다.");
  return writeContentFile({
    token,
    fileName: "inbox-public-key.json",
    text: `${JSON.stringify(file, null, 2)}\n`,
    message: "content: inbox public key",
    sha,
  });
}

type TreeBody = { truncated?: boolean; tree?: { path?: string; type?: string; sha?: string }[] };

export async function listInboxTree(token: string) {
  const repo = inboxRepoName();
  assertInboxRepo(repo);
  const response = await fetch(`${API}/repos/${repo}/git/trees/${INBOX_BRANCH}?recursive=1`, { headers: headers(token) });
  const body = await readJson<TreeBody>(response);
  const files = (body.tree ?? [])
    .filter((item) => item.type === "blob" && item.path && item.sha)
    .map((item) => ({ path: item.path as string, sha: item.sha as string }));
  return { files, truncated: body.truncated === true };
}

async function readFile(token: string, path: string): Promise<{ sha: string; text: string } | null> {
  const repo = inboxRepoName();
  assertInboxRepo(repo);
  const response = await fetch(`${API}/repos/${repo}/contents/${encodedPath(path)}?ref=${INBOX_BRANCH}`, { headers: headers(token) });
  if (response.status === 404) return null;
  const body = await readJson<{ sha?: string; content?: string }>(response);
  if (!body.sha || !body.content) throw new Error("파일 정보를 읽지 못했습니다.");
  return { sha: body.sha, text: base64ToUtf8(body.content) };
}

async function readBytes(token: string, path: string) {
  const repo = inboxRepoName();
  assertInboxRepo(repo);
  const response = await fetch(`${API}/repos/${repo}/contents/${encodedPath(path)}?ref=${INBOX_BRANCH}`, { headers: headers(token) });
  if (response.status === 404) return null;
  const body = await readJson<{ content?: string }>(response);
  if (!body.content) throw new Error("파일을 읽지 못했습니다.");
  const binary = atob(body.content.replace(/\s/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

async function writeBytes(token: string, path: string, bytes: Uint8Array, message: string, sha: string | null) {
  const repo = inboxRepoName();
  assertInboxRepo(repo);
  const payload = { message, content: bytesToBase64(bytes), branch: INBOX_BRANCH, sha: sha ?? undefined };
  let response = await fetch(`${API}/repos/${repo}/contents/${encodedPath(path)}`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(payload),
  });
  if (response.status === 409 && sha) {
    const latest = await readFile(token, path);
    response = await fetch(`${API}/repos/${repo}/contents/${encodedPath(path)}`, {
      method: "PUT",
      headers: headers(token),
      body: JSON.stringify({ ...payload, sha: latest?.sha }),
    });
  }
  const body = await readJson<{ content?: { sha?: string } }>(response);
  return body.content?.sha ?? "";
}

async function removeFile(token: string, path: string, sha: string, message: string) {
  const repo = inboxRepoName();
  assertInboxRepo(repo);
  const response = await fetch(`${API}/repos/${repo}/contents/${encodedPath(path)}`, {
    method: "DELETE",
    headers: headers(token),
    body: JSON.stringify({ message, sha, branch: INBOX_BRANCH }),
  });
  if (response.status === 404) return;
  if (!response.ok) throw new Error(errorText(response.status));
}

export async function loadInbox(token: string, privateKey: CryptoKey, onProgress?: (done: number, total: number) => void): Promise<{ items: InboxItem[]; truncated: boolean }> {
  const tree = await listInboxTree(token);
  const apps = tree.files.filter((file) => {
    const form = file.path.split("/")[1] ?? "";
    return file.path.startsWith("data/") && isFormName(form) && file.path.endsWith(".json");
  });
  const statusSha = new Map(tree.files.filter((file) => file.path.startsWith("data/status/") && file.path.endsWith(".json")).map((file) => [file.path, file.sha]));
  const attachmentSha = new Map(tree.files.filter((file) => file.path.startsWith("data/attachments/")).map((file) => [file.path, file.sha]));
  const items: InboxItem[] = [];
  for (let index = 0; index < apps.length; index += 50) {
    const batch = apps.slice(index, index + 50);
    const loaded = await Promise.all(batch.map(async (file) => {
      const body = await readFile(token, file.path);
      if (!body) return null;
      let record: InboxRecord;
      try {
        record = JSON.parse(body.text) as InboxRecord;
      } catch {
        return null;
      }
      if (!record?.id || !isFormName(record.form)) return null;
      let plain = null;
      try {
        plain = asAppPlain(await decryptRecord(record, privateKey));
      } catch {
        plain = null;
      }
      const statusPath = `data/status/${record.id}.json`;
      const overlayFile = statusSha.has(statusPath) ? await readFile(token, statusPath) : null;
      let overlay = null;
      if (overlayFile) {
        try {
          overlay = asStatusPlain(await decryptRecord(JSON.parse(overlayFile.text) as InboxRecord, privateKey));
        } catch {
          overlay = null;
        }
      }
      const attachmentPath = record.attachment?.path ?? "";
      const item: InboxItem = {
        id: record.id,
        form: record.form,
        createdAt: record.createdAt,
        path: file.path,
        sha: body.sha,
        record,
        plain,
        overlay,
        overlaySha: overlayFile?.sha ?? statusSha.get(statusPath) ?? null,
        attachmentSha: attachmentPath ? attachmentSha.get(attachmentPath) ?? null : null,
      };
      return item;
    }));
    for (const item of loaded) if (item) items.push(item);
    onProgress?.(Math.min(index + batch.length, apps.length), apps.length);
  }
  items.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  return { items, truncated: tree.truncated };
}

export async function saveStatus(token: string, item: InboxItem, status: StatusPlain, publicFile: InboxPublicKeyFile) {
  const { record } = await encryptRecord({ publicFile, form: item.form, id: item.id, plaintext: status });
  const bytes = new TextEncoder().encode(JSON.stringify(record));
  const sha = await writeBytes(token, `data/status/${item.id}.json`, bytes, `inbox: status ${item.id.slice(0, 8)}`, item.overlaySha);
  await appendAudit(token, { at: new Date().toISOString(), login: status.updatedBy, action: "update", form: item.form, id: item.id });
  return sha;
}

export async function deleteInboxItem(token: string, item: InboxItem, login: string) {
  await removeFile(token, item.path, item.sha, `inbox: delete ${item.id.slice(0, 8)}`);
  if (item.record.attachment && item.attachmentSha) {
    await removeFile(token, item.record.attachment.path, item.attachmentSha, `inbox: delete ${item.id.slice(0, 8)}`);
  }
  if (item.overlaySha) await removeFile(token, `data/status/${item.id}.json`, item.overlaySha, `inbox: delete ${item.id.slice(0, 8)}`);
  await appendAudit(token, { at: new Date().toISOString(), login, action: "delete", form: item.form, id: item.id });
}

export async function readAttachment(token: string, item: InboxItem) {
  if (!item.record.attachment) throw new Error("첨부가 없습니다.");
  const bytes = await readBytes(token, item.record.attachment.path);
  if (!bytes) throw new Error("첨부 파일을 찾지 못했습니다.");
  return bytes;
}

export async function publishOrg(token: string, name: string) {
  const found = await readContentFile(token, "pledges.json");
  const parsed = found ? (JSON.parse(found.text) as { items?: unknown }) : { items: [] };
  const items = Array.isArray(parsed.items) ? [...parsed.items] : [];
  const date = localDate();
  items.push({ id: `pledge-${Date.now()}`, name, date, published: true });
  await writeContentFile({
    token,
    fileName: "pledges.json",
    text: `${JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), items }, null, 2)}\n`,
    message: "content: pledge publish",
    sha: found?.sha ?? null,
  });
}

export async function appendAudit(token: string, line: AuditLine) {
  const path = `data/audit/${line.at.slice(0, 7)}.jsonl`;
  const existing = await readFile(token, path);
  const next = `${existing?.text ?? ""}${JSON.stringify({ at: line.at, login: line.login, action: line.action, form: line.form, id: line.id })}\n`;
  await writeBytes(token, path, new TextEncoder().encode(next), `inbox: audit ${line.action}`, existing?.sha ?? null);
}

export async function listAudit(token: string): Promise<AuditLine[]> {
  const tree = await listInboxTree(token);
  const files = tree.files.filter((file) => file.path.startsWith("data/audit/") && file.path.endsWith(".jsonl"));
  const lines: AuditLine[] = [];
  for (const file of files) {
    const body = await readFile(token, file.path);
    if (!body) continue;
    for (const row of body.text.split("\n")) {
      if (!row.trim()) continue;
      try {
        const parsed = JSON.parse(row) as AuditLine;
        if (parsed.at && parsed.action && parsed.id) lines.push(parsed);
      } catch {
        continue;
      }
    }
  }
  return lines.sort((left, right) => right.at.localeCompare(left.at));
}

export async function listRemovedFiles(token: string): Promise<RemovedFile[]> {
  const repo = inboxRepoName();
  assertInboxRepo(repo);
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const list = await fetch(`${API}/repos/${repo}/commits?sha=${INBOX_BRANCH}&since=${encodeURIComponent(since)}&per_page=30`, { headers: headers(token) });
  const commits = await readJson<{ sha?: string }[]>(list);
  const removed: RemovedFile[] = [];
  for (const commit of commits) {
    if (!commit.sha) continue;
    const detail = await fetch(`${API}/repos/${repo}/commits/${commit.sha}`, { headers: headers(token) });
    const body = await readJson<{
      sha?: string;
      commit?: { author?: { date?: string } };
      parents?: { sha?: string }[];
      files?: { filename?: string; status?: string }[];
    }>(detail);
    const parent = body.parents?.[0]?.sha;
    if (!parent) continue;
    for (const file of body.files ?? []) {
      if (file.status === "removed" && file.filename?.startsWith("data/")) {
        removed.push({ path: file.filename, parentSha: parent, date: body.commit?.author?.date ?? "", commitSha: body.sha ?? commit.sha });
      }
    }
  }
  return removed;
}

export async function restoreFile(token: string, file: RemovedFile, login: string) {
  const repo = inboxRepoName();
  assertInboxRepo(repo);
  const response = await fetch(`${API}/repos/${repo}/contents/${encodedPath(file.path)}?ref=${file.parentSha}`, { headers: headers(token) });
  const body = await readJson<{ content?: string }>(response);
  if (!body.content) throw new Error("되돌릴 파일 내용을 찾지 못했습니다.");
  const current = await readFile(token, file.path);
  const put = await fetch(`${API}/repos/${repo}/contents/${encodedPath(file.path)}`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify({
      message: "inbox: restore",
      content: body.content.replace(/\s/g, ""),
      branch: INBOX_BRANCH,
      sha: current?.sha,
    }),
  });
  if (!put.ok) throw new Error(errorText(put.status));
  await appendAudit(token, { at: new Date().toISOString(), login, action: "restore", form: file.path.split("/")[1] ?? "", id: file.path });
}

export async function purgeInboxHistory(token: string, confirmRepo: string, login: string) {
  const repo = inboxRepoName();
  assertInboxRepo(repo);
  if (confirmRepo.trim() !== repo) throw new Error("저장소 이름이 일치하지 않습니다.");
  if (repo === CONTENT_REPO || confirmRepo.trim() === CONTENT_REPO) throw new Error("사이트 저장소에는 실행할 수 없습니다.");
  const ref = await fetch(`${API}/repos/${repo}/git/ref/heads/${INBOX_BRANCH}`, { headers: headers(token) });
  const refBody = await readJson<{ object?: { sha?: string } }>(ref);
  const current = refBody.object?.sha;
  if (!current) throw new Error("보관함 기본 브랜치를 찾지 못했습니다.");
  const commit = await fetch(`${API}/repos/${repo}/git/commits/${current}`, { headers: headers(token) });
  const commitBody = await readJson<{ tree?: { sha?: string } }>(commit);
  const tree = commitBody.tree?.sha;
  if (!tree) throw new Error("현재 파일 목록을 찾지 못했습니다.");
  const created = await fetch(`${API}/repos/${repo}/git/commits`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ message: "inbox: purge history", tree, parents: [] }),
  });
  const createdBody = await readJson<{ sha?: string }>(created);
  if (!createdBody.sha) throw new Error("새 기록을 만들지 못했습니다.");
  const updated = await fetch(`${API}/repos/${repo}/git/refs/heads/${INBOX_BRANCH}`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify({ sha: createdBody.sha, force: true }),
  });
  if (!updated.ok) throw new Error(errorText(updated.status));
  await appendAudit(token, { at: new Date().toISOString(), login, action: "purge", form: "", id: "history" });
}
