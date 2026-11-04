import { CONTENT_BRANCH, CONTENT_REPO } from "@/lib/content/types";

const API = "https://api.github.com";

export type GithubUser = { login: string };

export class GithubConflictError extends Error {
  constructor() {
    super("conflict");
    this.name = "GithubConflictError";
  }
}

function headers(token: string, extra?: HeadersInit): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    ...extra,
  };
}

async function readError(response: Response) {
  if (response.status === 401) return "토큰이 올바르지 않습니다.";
  if (response.status === 403) return "토큰 권한이 부족하거나 사용 한도를 넘었습니다.";
  if (response.status === 404) return "저장소 또는 파일을 찾지 못했습니다.";
  return `GitHub 응답 오류 (${response.status})`;
}

export async function verifyContentToken(token: string): Promise<GithubUser> {
  const repo = await fetch(`${API}/repos/${CONTENT_REPO}`, { headers: headers(token) });
  if (!repo.ok) throw new Error(await readError(repo));
  const body = (await repo.json()) as { permissions?: { push?: boolean } };
  if (body.permissions?.push !== true) {
    throw new Error("이 토큰에는 저장소 Contents 쓰기 권한이 없습니다.");
  }
  const user = await fetch(`${API}/user`, { headers: headers(token) });
  if (!user.ok) throw new Error(await readError(user));
  const profile = (await user.json()) as { login?: string };
  if (!profile.login) throw new Error("GitHub 로그인 이름을 받지 못했습니다.");
  return { login: profile.login };
}

export function utf8ToBase64(text: string) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  const chunk = 0x8000;
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
  }
  return btoa(binary);
}

export function base64ToUtf8(value: string) {
  const binary = atob(value.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export async function readContentFile(token: string, fileName: string): Promise<{ sha: string; text: string } | null> {
  const response = await fetch(
    `${API}/repos/${CONTENT_REPO}/contents/public/content/${fileName}?ref=${CONTENT_BRANCH}`,
    { headers: headers(token) },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(await readError(response));
  const body = (await response.json()) as { sha?: string; content?: string; encoding?: string };
  if (!body.sha || !body.content) throw new Error("파일 정보를 읽지 못했습니다.");
  const text = body.encoding === "base64" || !body.encoding ? base64ToUtf8(body.content) : body.content;
  return { sha: body.sha, text };
}

export async function writeContentFile(input: {
  token: string;
  fileName: string;
  text: string;
  message: string;
  sha: string | null;
}): Promise<{ commitUrl: string }> {
  const latest = await readContentFile(input.token, input.fileName);
  if ((latest?.sha ?? null) !== input.sha) throw new GithubConflictError();
  const response = await fetch(`${API}/repos/${CONTENT_REPO}/contents/public/content/${input.fileName}`, {
    method: "PUT",
    headers: headers(input.token, { "Content-Type": "application/json" }),
    body: JSON.stringify({
      message: input.message,
      content: utf8ToBase64(input.text),
      branch: CONTENT_BRANCH,
      sha: input.sha ?? undefined,
    }),
  });
  if (response.status === 409) throw new GithubConflictError();
  if (!response.ok) throw new Error(await readError(response));
  const body = (await response.json()) as { commit?: { html_url?: string; sha?: string } };
  const commitUrl =
    body.commit?.html_url ??
    (body.commit?.sha ? `https://github.com/${CONTENT_REPO}/commit/${body.commit.sha}` : `https://github.com/${CONTENT_REPO}`);
  return { commitUrl };
}

export type RepoCommit = {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
};

export type DeployLabel = "진행 중" | "완료" | "실패" | "확인 불가";

export async function listCommits(token: string, filePath: string | null, perPage: number): Promise<RepoCommit[]> {
  const params = new URLSearchParams({ sha: CONTENT_BRANCH, per_page: String(perPage) });
  if (filePath) params.set("path", filePath);
  const response = await fetch(`${API}/repos/${CONTENT_REPO}/commits?${params}`, { headers: headers(token) });
  if (response.status === 404 || response.status === 409) return [];
  if (!response.ok) throw new Error(await readError(response));
  const body = (await response.json()) as Array<{
    sha?: string;
    html_url?: string;
    commit?: { message?: string; author?: { name?: string; date?: string } };
  }>;
  return body
    .filter((item) => item.sha)
    .map((item) => ({
      sha: item.sha as string,
      message: (item.commit?.message ?? "").split("\n")[0],
      author: item.commit?.author?.name ?? "",
      date: item.commit?.author?.date ?? "",
      url: item.html_url ?? `https://github.com/${CONTENT_REPO}/commit/${item.sha}`,
    }));
}

export async function readContentAt(token: string, fileName: string, ref: string): Promise<string | null> {
  const response = await fetch(
    `${API}/repos/${CONTENT_REPO}/contents/public/content/${fileName}?ref=${ref}`,
    { headers: headers(token) },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(await readError(response));
  const body = (await response.json()) as { content?: string };
  if (!body.content) return null;
  return base64ToUtf8(body.content);
}

export async function latestDeploy(token: string): Promise<{ label: DeployLabel; name: string; url: string }> {
  const response = await fetch(
    `${API}/repos/${CONTENT_REPO}/actions/runs?per_page=1&branch=${CONTENT_BRANCH}`,
    { headers: headers(token) },
  );
  if (response.status === 401 || response.status === 403 || response.status === 404) {
    return { label: "확인 불가", name: "", url: "" };
  }
  if (!response.ok) throw new Error(await readError(response));
  const body = (await response.json()) as {
    workflow_runs?: Array<{ status?: string; conclusion?: string | null; name?: string; html_url?: string }>;
  };
  const run = body.workflow_runs?.[0];
  if (!run) return { label: "확인 불가", name: "", url: "" };
  let label: DeployLabel = "진행 중";
  if (run.status === "completed") label = run.conclusion === "success" ? "완료" : "실패";
  return { label, name: run.name ?? "", url: run.html_url ?? "" };
}

export async function uploadRepoFile(input: {
  token: string;
  path: string;
  base64: string;
  message: string;
}): Promise<void> {
  const existing = await fetch(`${API}/repos/${CONTENT_REPO}/contents/${input.path}?ref=${CONTENT_BRANCH}`, {
    headers: headers(input.token),
  });
  let sha: string | undefined;
  if (existing.ok) {
    const body = (await existing.json()) as { sha?: string };
    sha = body.sha;
  } else if (existing.status !== 404) {
    throw new Error(await readError(existing));
  }
  const response = await fetch(`${API}/repos/${CONTENT_REPO}/contents/${input.path}`, {
    method: "PUT",
    headers: headers(input.token, { "Content-Type": "application/json" }),
    body: JSON.stringify({
      message: input.message,
      content: input.base64,
      branch: CONTENT_BRANCH,
      sha,
    }),
  });
  if (!response.ok) throw new Error(await readError(response));
}

export async function fileToBase64(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  const chunk = 0x8000;
  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
  }
  return btoa(binary);
}
