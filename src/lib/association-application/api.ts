import {
  canUseLocalAssociationStorage,
  useClientAssociationStorage,
  useGithubAssociationStorage,
} from "./config";
import { isStaticGitHubPages } from "@/lib/privacy-inquiry/env";
import type {
  ApplicationStatus,
  AssociationApplication,
  SupportApplicationInput,
} from "./types";

export async function submitAssociationApplication(
  data: SupportApplicationInput,
  _honeypot = "",
): Promise<{ id: string }> {
  if (canUseLocalAssociationStorage()) {
    const { submitAssociationApplicationLocal } = await import("./actions");
    return submitAssociationApplicationLocal({ data });
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
  if (canUseLocalAssociationStorage()) {
    const { listAssociationApplicationsLocal } = await import("./actions");
    return listAssociationApplicationsLocal({ data: { adminKey: _token } });
  }

  if (useGithubAssociationStorage()) {
    const { fetchAssociationApplicationsGithub } = await import("./github-storage");
    return fetchAssociationApplicationsGithub();
  }

  if (useClientAssociationStorage()) {
    const { hydrateAssociationApplicationsClient } = await import("./client-storage");
    return hydrateAssociationApplicationsClient();
  }

  return [];
}

export async function updateAssociationApplicationStatus(
  id: string,
  status: ApplicationStatus,
  token: string,
): Promise<void> {
  if (canUseLocalAssociationStorage()) {
    const { updateAssociationApplicationStatusLocal } = await import("./actions");
    await updateAssociationApplicationStatusLocal({ data: { adminKey: token, id, status } });
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
}

export async function updateAssociationApplicationMemo(
  id: string,
  adminMemo: string,
  token: string,
): Promise<void> {
  if (canUseLocalAssociationStorage()) {
    const { updateAssociationApplicationMemoLocal } = await import("./actions");
    await updateAssociationApplicationMemoLocal({ data: { adminKey: token, id, adminMemo } });
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
}
