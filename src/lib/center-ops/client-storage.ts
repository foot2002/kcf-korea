import { buildPublicContent, emptyDb, lookupCampaign, lookupMonitor, submitCampaign, submitEnrollment, submitMonitor, supplementCampaign, updateCampaign, updateMonitor, verifySureMark } from "@/lib/center-ops/logic";
import type { CampaignInput, EnrollmentInput, MonitorInput, OpsDb, StoredFile } from "@/lib/center-ops/types";

const STORAGE_KEY = "kcf-privacy-center-ops-v1";

function readDb(): OpsDb {
  if (typeof window === "undefined") return emptyDb();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyDb();
    return { ...emptyDb(), ...(JSON.parse(raw) as OpsDb) };
  } catch {
    return emptyDb();
  }
}

function writeDb(db: OpsDb) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function submitMonitorClient(input: MonitorInput) {
  const now = new Date().toISOString();
  const result = submitMonitor(readDb(), input, now);
  writeDb(result.db);
  return { id: result.id };
}

export function lookupMonitorClient(id: string, email: string) {
  return lookupMonitor(readDb(), id, email);
}

export function listMonitorClient() {
  return [...readDb().monitorApplications].reverse();
}

export function updateMonitorClient(id: string, patch: Parameters<typeof updateMonitor>[2]) {
  writeDb(updateMonitor(readDb(), id, patch, new Date().toISOString()));
}

export function submitCampaignClient(input: CampaignInput) {
  const result = submitCampaign(readDb(), input, new Date().toISOString());
  writeDb(result.db);
  return { id: result.id };
}

export function lookupCampaignClient(id: string, email: string) {
  return lookupCampaign(readDb(), id, email);
}

export function supplementCampaignClient(id: string, email: string, note: string, file?: StoredFile) {
  writeDb(supplementCampaign(readDb(), id, email, note, file, new Date().toISOString()));
}

export function listCampaignClient() {
  return [...readDb().campaignApplications].reverse();
}

export function updateCampaignClient(id: string, patch: Parameters<typeof updateCampaign>[2]) {
  writeDb(updateCampaign(readDb(), id, patch, new Date().toISOString()));
}

export function submitEnrollmentClient(input: EnrollmentInput) {
  const result = submitEnrollment(readDb(), input, new Date().toISOString());
  writeDb(result.db);
  return { id: result.id };
}

export function listEnrollmentClient() {
  return [...readDb().educationEnrollments].reverse();
}

export function getPublicContentClient(now: number | null) {
  return buildPublicContent(readDb(), now);
}

export function getOpsClient(): OpsDb {
  return readDb();
}

export function saveOpsClient(db: OpsDb) {
  writeDb(db);
}

export function verifySureMarkClient(code: string) {
  return verifySureMark(readDb(), code);
}
