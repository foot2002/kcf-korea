import { isStaticGitHubPages } from "@/lib/privacy-inquiry/env";
import type {
  CampaignInput,
  CampaignPublic,
  EducationOverrideInput,
  EnrollmentInput,
  MonitorInput,
  MonitorPublic,
  OpsDb,
  PublicContent,
  StoredFile,
  SureMarkGrant,
} from "@/lib/center-ops/types";
import type { CampaignApplication, EducationEnrollment, MonitorApplication } from "@/lib/center-ops/types";

async function server<T>(load: () => Promise<T>, client: () => T | Promise<T>): Promise<T> {
  if (isStaticGitHubPages) return client();
  return load();
}

export function submitMonitorApplication(input: MonitorInput) {
  return server(
    async () => {
      const { submitMonitorLocal } = await import("./actions");
      return submitMonitorLocal({ data: input });
    },
    async () => {
      const { submitMonitorClient } = await import("./client-storage");
      return submitMonitorClient(input);
    },
  );
}

export function lookupMonitorApplication(id: string, email: string): Promise<MonitorPublic> {
  return server(
    async () => {
      const { lookupMonitorLocal } = await import("./actions");
      return lookupMonitorLocal({ data: { id, email } });
    },
    async () => {
      const { lookupMonitorClient } = await import("./client-storage");
      return lookupMonitorClient(id, email);
    },
  );
}

export function listMonitorApplications(adminKey: string): Promise<MonitorApplication[]> {
  return server(
    async () => {
      const { listMonitorLocal } = await import("./actions");
      return listMonitorLocal({ data: { adminKey } });
    },
    async () => {
      const { listMonitorClient } = await import("./client-storage");
      return listMonitorClient();
    },
  );
}

export function updateMonitorApplication(
  adminKey: string,
  id: string,
  patch: Partial<Pick<MonitorApplication, "status" | "publicNote" | "adminMemo" | "alertUnread">>,
) {
  return server(
    async () => {
      const { updateMonitorLocal } = await import("./actions");
      await updateMonitorLocal({ data: { adminKey, id, ...patch } });
    },
    async () => {
      const { updateMonitorClient } = await import("./client-storage");
      updateMonitorClient(id, patch);
    },
  );
}

export function submitCampaignApplication(input: CampaignInput) {
  return server(
    async () => {
      const { submitCampaignLocal } = await import("./actions");
      return submitCampaignLocal({ data: input });
    },
    async () => {
      const { submitCampaignClient } = await import("./client-storage");
      return submitCampaignClient(input);
    },
  );
}

export function lookupCampaignApplication(id: string, email: string): Promise<CampaignPublic> {
  return server(
    async () => {
      const { lookupCampaignLocal } = await import("./actions");
      return lookupCampaignLocal({ data: { id, email } });
    },
    async () => {
      const { lookupCampaignClient } = await import("./client-storage");
      return lookupCampaignClient(id, email);
    },
  );
}

export function supplementCampaignApplication(id: string, email: string, note: string, file?: StoredFile) {
  return server(
    async () => {
      const { supplementCampaignLocal } = await import("./actions");
      await supplementCampaignLocal({ data: { id, email, note, file } });
    },
    async () => {
      const { supplementCampaignClient } = await import("./client-storage");
      supplementCampaignClient(id, email, note, file);
    },
  );
}

export function listCampaignApplications(adminKey: string): Promise<CampaignApplication[]> {
  return server(
    async () => {
      const { listCampaignLocal } = await import("./actions");
      return listCampaignLocal({ data: { adminKey } });
    },
    async () => {
      const { listCampaignClient } = await import("./client-storage");
      return listCampaignClient();
    },
  );
}

export function updateCampaignApplication(
  adminKey: string,
  id: string,
  patch: Partial<Pick<CampaignApplication, "status" | "publicNote" | "adminMemo" | "licenseCode" | "alertUnread">>,
) {
  return server(
    async () => {
      const { updateCampaignLocal } = await import("./actions");
      await updateCampaignLocal({ data: { adminKey, id, ...patch } });
    },
    async () => {
      const { updateCampaignClient } = await import("./client-storage");
      updateCampaignClient(id, patch);
    },
  );
}

export function submitEducationEnrollment(input: EnrollmentInput) {
  return server(
    async () => {
      const { submitEnrollmentLocal } = await import("./actions");
      return submitEnrollmentLocal({ data: input });
    },
    async () => {
      const { submitEnrollmentClient } = await import("./client-storage");
      return submitEnrollmentClient(input);
    },
  );
}

export function listEducationEnrollments(adminKey: string): Promise<EducationEnrollment[]> {
  return server(
    async () => {
      const { listEnrollmentLocal } = await import("./actions");
      return listEnrollmentLocal({ data: { adminKey } });
    },
    async () => {
      const { listEnrollmentClient } = await import("./client-storage");
      return listEnrollmentClient();
    },
  );
}

export function loadPublicContent(): Promise<PublicContent> {
  return server(
    async () => {
      const { getPublicContentLocal } = await import("./actions");
      return getPublicContentLocal();
    },
    async () => {
      const { getPublicContentClient } = await import("./client-storage");
      return getPublicContentClient(Date.now());
    },
  );
}

export function loadOps(adminKey: string): Promise<OpsDb> {
  return server(
    async () => {
      const { getOpsLocal } = await import("./actions");
      return getOpsLocal({ data: { adminKey } });
    },
    async () => {
      const { getOpsClient } = await import("./client-storage");
      return getOpsClient();
    },
  );
}

export function saveOps(adminKey: string, db: OpsDb) {
  return server(
    async () => {
      const { saveOpsLocal } = await import("./actions");
      await saveOpsLocal({ data: { adminKey, db } });
    },
    async () => {
      const { saveOpsClient } = await import("./client-storage");
      saveOpsClient(db);
    },
  );
}

export function patchEducation(adminKey: string, input: EducationOverrideInput) {
  return loadOps(adminKey).then(async (db) => {
    const { applyEducationOverride } = await import("./logic");
    await saveOps(adminKey, applyEducationOverride(db, input));
  });
}

export function verifyMark(code: string): Promise<SureMarkGrant | null> {
  return server(
    async () => {
      const { verifySureMarkLocal } = await import("./actions");
      return verifySureMarkLocal({ data: { code } });
    },
    async () => {
      const { verifySureMarkClient } = await import("./client-storage");
      return verifySureMarkClient(code);
    },
  );
}
