import {
  canUseLocalAssociationStorage,
  useClientAssociationStorage,
  useGithubAssociationStorage,
} from "./config";
import { isStaticGitHubPages } from "@/lib/privacy-inquiry/env";
import type {
  ApplicationStatus,
  AssociationApplication,
  AssociationApplicationInput,
} from "./types";

function getGasApiUrl(): string | null {
  const url = import.meta.env.VITE_ASSOCIATION_APPLICATION_API_URL?.trim();
  return url || null;
}

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  let body: { ok?: boolean; error?: string; data?: T } = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("서버 응답을 처리할 수 없습니다.");
  }
  if (!res.ok || body.ok === false) {
    throw new Error(body.error ?? "신청 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }
  return body.data as T;
}

export async function submitAssociationApplication(
  data: AssociationApplicationInput,
  honeypot = "",
): Promise<{ id: string }> {
  const gasUrl = getGasApiUrl();
  if (gasUrl) {
    const res = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", website: honeypot, ...data }),
    });
    return parseJsonResponse<{ id: string }>(res);
  }

  if (useGithubAssociationStorage()) {
    const { submitAssociationApplicationGithub } = await import("./github-storage");
    return submitAssociationApplicationGithub(data);
  }

  if (useClientAssociationStorage()) {
    const { submitAssociationApplicationClient } = await import("./client-storage");
    return submitAssociationApplicationClient(data);
  }

  if (isStaticGitHubPages) {
    throw new Error(
      "신청 접수 중 오류가 발생했습니다. 잠시 후 다시 시도하거나 담당자에게 문의해 주세요.",
    );
  }

  const { submitAssociationApplicationLocal } = await import("./actions");
  return submitAssociationApplicationLocal({ data });
}

export async function fetchAssociationApplications(
  _token: string,
): Promise<AssociationApplication[]> {
  const gasUrl = getGasApiUrl();
  if (gasUrl) {
    const url = new URL(gasUrl);
    url.searchParams.set("action", "list");
    url.searchParams.set("token", _token);
    const res = await fetch(url.toString(), { method: "GET" });
    return parseJsonResponse<AssociationApplication[]>(res);
  }

  if (useGithubAssociationStorage()) {
    const { fetchAssociationApplicationsGithub } = await import("./github-storage");
    return fetchAssociationApplicationsGithub();
  }

  if (useClientAssociationStorage()) {
    const { hydrateAssociationApplicationsClient } = await import("./client-storage");
    return hydrateAssociationApplicationsClient();
  }

  if (!canUseLocalAssociationStorage()) {
    return [];
  }

  const { listAssociationApplicationsLocal } = await import("./actions");
  return listAssociationApplicationsLocal({ data: { adminKey: _token } });
}

export async function updateAssociationApplicationStatus(
  id: string,
  status: ApplicationStatus,
  token: string,
): Promise<void> {
  const gasUrl = getGasApiUrl();
  if (gasUrl) {
    const res = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateStatus", token, id, status }),
    });
    await parseJsonResponse(res);
    return;
  }

  if (useGithubAssociationStorage()) {
    const { updateAssociationApplicationStatusGithub } = await import("./github-storage");
    await updateAssociationApplicationStatusGithub(id, status);
    return;
  }

  if (useClientAssociationStorage()) {
    const { updateAssociationApplicationStatusClient } = await import("./client-storage");
    updateAssociationApplicationStatusClient(id, status);
    return;
  }

  const { updateAssociationApplicationStatusLocal } = await import("./actions");
  await updateAssociationApplicationStatusLocal({ data: { adminKey: token, id, status } });
}

export async function updateAssociationApplicationMemo(
  id: string,
  adminMemo: string,
  token: string,
): Promise<void> {
  const gasUrl = getGasApiUrl();
  if (gasUrl) {
    const res = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateMemo", token, id, adminMemo }),
    });
    await parseJsonResponse(res);
    return;
  }

  if (useGithubAssociationStorage()) {
    const { updateAssociationApplicationMemoGithub } = await import("./github-storage");
    await updateAssociationApplicationMemoGithub(id, adminMemo);
    return;
  }

  if (useClientAssociationStorage()) {
    const { updateAssociationApplicationMemoClient } = await import("./client-storage");
    updateAssociationApplicationMemoClient(id, adminMemo);
    return;
  }

  const { updateAssociationApplicationMemoLocal } = await import("./actions");
  await updateAssociationApplicationMemoLocal({ data: { adminKey: token, id, adminMemo } });
}
