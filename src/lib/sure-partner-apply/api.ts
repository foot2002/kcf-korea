import {
  canUseLocalSurePartnerStorage,
  useClientSurePartnerStorage,
} from "./config";
import type {
  SurePartnerApplication,
  SurePartnerApplyInput,
  SurePartnerApplyStatus,
} from "./types";

export async function submitSurePartnerApplication(
  data: SurePartnerApplyInput,
  _honeypot = "",
): Promise<{ id: string }> {
  if (canUseLocalSurePartnerStorage()) {
    const { submitSurePartnerApplicationLocal } = await import("./actions");
    return submitSurePartnerApplicationLocal({ data });
  }

  if (useClientSurePartnerStorage()) {
    const { submitSurePartnerApplicationClient } = await import("./client-storage");
    return submitSurePartnerApplicationClient(data);
  }

  const { submitSurePartnerApplicationLocal } = await import("./actions");
  return submitSurePartnerApplicationLocal({ data });
}

export async function fetchSurePartnerApplications(
  adminKey: string,
): Promise<SurePartnerApplication[]> {
  if (canUseLocalSurePartnerStorage()) {
    const { listSurePartnerApplicationsLocal } = await import("./actions");
    return listSurePartnerApplicationsLocal({ data: { adminKey } });
  }

  if (useClientSurePartnerStorage()) {
    const { listSurePartnerApplicationsClient } = await import("./client-storage");
    return listSurePartnerApplicationsClient();
  }

  return [];
}

export async function updateSurePartnerApplicationStatus(
  id: string,
  status: SurePartnerApplyStatus,
  adminKey: string,
): Promise<void> {
  if (canUseLocalSurePartnerStorage()) {
    const { updateSurePartnerApplicationStatusLocal } = await import("./actions");
    await updateSurePartnerApplicationStatusLocal({ data: { adminKey, id, status } });
    return;
  }

  if (useClientSurePartnerStorage()) {
    const { updateSurePartnerApplicationStatusClient } = await import("./client-storage");
    updateSurePartnerApplicationStatusClient(id, status);
  }
}

export async function updateSurePartnerApplicationMemo(
  id: string,
  adminMemo: string,
  adminKey: string,
): Promise<void> {
  if (canUseLocalSurePartnerStorage()) {
    const { updateSurePartnerApplicationMemoLocal } = await import("./actions");
    await updateSurePartnerApplicationMemoLocal({ data: { adminKey, id, adminMemo } });
    return;
  }

  if (useClientSurePartnerStorage()) {
    const { updateSurePartnerApplicationMemoClient } = await import("./client-storage");
    updateSurePartnerApplicationMemoClient(id, adminMemo);
  }
}

export async function removeSurePartnerApplication(
  id: string,
  adminKey: string,
): Promise<void> {
  if (canUseLocalSurePartnerStorage()) {
    const { deleteSurePartnerApplicationLocal } = await import("./actions");
    await deleteSurePartnerApplicationLocal({ data: { adminKey, id } });
    return;
  }

  if (useClientSurePartnerStorage()) {
    const { deleteSurePartnerApplicationClient } = await import("./client-storage");
    deleteSurePartnerApplicationClient(id);
  }
}
