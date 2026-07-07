import type {
  ApplicationStatus,
  AssociationApplication,
  AssociationApplicationInput,
} from "./types";

const DATA_PATH = "public/association-applications-data.json";
const REPO = "foot2002/kcf-korea";
const BRANCH = "main";

function getToken(): string | null {
  const token = import.meta.env.VITE_ASSOCIATION_DATA_GITHUB_TOKEN?.trim();
  return token || null;
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function readRemoteFile(token: string): Promise<{ sha: string; records: AssociationApplication[] }> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${DATA_PATH}?ref=${BRANCH}`,
    { headers: authHeaders(token) },
  );
  if (res.status === 404) {
    return { sha: "", records: [] };
  }
  if (!res.ok) {
    throw new Error("신청 데이터를 불러오지 못했습니다.");
  }
  const body = (await res.json()) as { sha?: string; content?: string };
  const decoded = body.content
    ? (JSON.parse(atob(body.content.replace(/\n/g, ""))) as AssociationApplication[])
    : [];
  return { sha: body.sha ?? "", records: Array.isArray(decoded) ? decoded : [] };
}

async function writeRemoteFile(
  token: string,
  sha: string,
  records: AssociationApplication[],
): Promise<void> {
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(records, null, 2))));
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${DATA_PATH}`, {
    method: "PUT",
    headers: {
      ...authHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Update association applications data",
      content,
      sha: sha || undefined,
      branch: BRANCH,
    }),
  });
  if (!res.ok) {
    throw new Error("신청 데이터를 저장하지 못했습니다.");
  }
}

function generateId(existingCount: number): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const seq = String(existingCount + 1).padStart(4, "0");
  return `APP-${y}${m}${d}-${seq}`;
}

export async function fetchAssociationApplicationsGithub(): Promise<AssociationApplication[]> {
  const token = getToken();
  if (!token) return [];
  const { records } = await readRemoteFile(token);
  return [...records].reverse();
}

export async function submitAssociationApplicationGithub(
  data: AssociationApplicationInput,
): Promise<{ id: string }> {
  const token = getToken();
  if (!token) throw new Error("저장소 연동이 설정되지 않았습니다.");

  const { sha, records } = await readRemoteFile(token);
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
  await writeRemoteFile(token, sha, records);
  return { id: record.id };
}

export async function updateAssociationApplicationStatusGithub(
  id: string,
  status: ApplicationStatus,
): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("저장소 연동이 설정되지 않았습니다.");

  const { sha, records } = await readRemoteFile(token);
  const index = records.findIndex((r) => r.id === id);
  if (index < 0) throw new Error("신청을 찾을 수 없습니다.");
  records[index] = {
    ...records[index]!,
    status,
    updatedAt: new Date().toISOString(),
  };
  await writeRemoteFile(token, sha, records);
}

export async function updateAssociationApplicationMemoGithub(
  id: string,
  adminMemo: string,
): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("저장소 연동이 설정되지 않았습니다.");

  const { sha, records } = await readRemoteFile(token);
  const index = records.findIndex((r) => r.id === id);
  if (index < 0) throw new Error("신청을 찾을 수 없습니다.");
  records[index] = {
    ...records[index]!,
    adminMemo,
    updatedAt: new Date().toISOString(),
  };
  await writeRemoteFile(token, sha, records);
}
