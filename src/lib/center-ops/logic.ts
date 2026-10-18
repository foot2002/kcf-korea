import {
  CAMPAIGN_STATUSES,
  DEFAULT_LICENSE_SETTINGS,
  EDUCATION_SEED,
  KOREA_REGIONS,
  MONITOR_INTERESTS,
  MONITOR_MODES,
  MONITOR_STATUSES,
  POLICY_ITEMS,
  POLICY_STATUSES,
  PUBLICATION_SEED,
  type CampaignStatus,
  type EducationItem,
  type LicenseSettings,
  type PolicyItem,
  type PublicationItem,
} from "@/data/privacy-program";
import type {
  BoardPost,
  CampaignApplication,
  CampaignInput,
  CampaignPublic,
  EducationEnrollment,
  EducationOverrideInput,
  EnrollmentInput,
  MonitorApplication,
  MonitorInput,
  MonitorPublic,
  OpsDb,
  PublicContent,
  StoredFile,
  SureMarkGrant,
} from "@/lib/center-ops/types";

const MAX_DATA_URL = 1_800_000;

export function emptyDb(): OpsDb {
  return {
    monitorApplications: [],
    campaignApplications: [],
    educationEnrollments: [],
    notices: null,
    activities: null,
    educationOverrides: {},
    extraEducation: [],
    deletedEducationSlugs: [],
    publicationOverrides: {},
    extraPublications: [],
    deletedPublicationSlugs: [],
    policyOverrides: {},
    licenseSettings: null,
    publishedStats: null,
    sureMarks: [],
  };
}

function stamp(existing: number, prefix: string, now: string) {
  const date = now.slice(0, 10).replace(/-/g, "");
  return `${prefix}-${date}-${String(existing + 1).padStart(4, "0")}`;
}

function emailOf(value: string) {
  return value.trim().toLowerCase();
}

function oneOf(list: readonly string[], value: string) {
  return list.includes(value);
}

function requireText(value: string, label: string) {
  if (!value.trim()) throw new Error(`${label}을(를) 입력해 주세요.`);
}

function assertEmail(value: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    throw new Error("이메일 형식을 확인해 주세요.");
  }
}

function assertFile(file?: StoredFile) {
  if (!file) return;
  if (!file.name || !file.dataUrl.startsWith("data:")) {
    throw new Error("첨부파일 형식을 확인해 주세요.");
  }
  if (file.dataUrl.length > MAX_DATA_URL) {
    throw new Error("첨부파일은 1MB 이하로 올려 주세요.");
  }
}

export function submitMonitor(db: OpsDb, input: MonitorInput, now: string): { db: OpsDb; id: string } {
  requireText(input.name, "이름 또는 활동명");
  assertEmail(input.email);
  if (!oneOf(KOREA_REGIONS, input.region)) {
    throw new Error("거주 시도를 선택해 주세요.");
  }
  if (!input.interests.length || input.interests.some((item) => !oneOf(MONITOR_INTERESTS, item))) {
    throw new Error("관심 분야를 한 가지 이상 선택해 주세요.");
  }
  if (!oneOf(MONITOR_MODES, input.participationMode)) {
    throw new Error("희망 활동방식을 선택해 주세요.");
  }
  requireText(input.motivation, "참여 동기");
  if (input.privacyConsent !== true) throw new Error("개인정보 수집·이용에 동의해 주세요.");

  const id = stamp(db.monitorApplications.length, "MON", now);
  const record: MonitorApplication = {
    id,
    createdAt: now,
    updatedAt: now,
    name: input.name.trim(),
    email: emailOf(input.email),
    phone: input.phone?.trim() ?? "",
    region: input.region,
    interests: input.interests,
    motivation: input.motivation.trim(),
    participationMode: input.participationMode,
    privacyConsent: true,
    notifyConsent: Boolean(input.notifyConsent),
    status: "접수",
    publicNote: "",
    adminMemo: "",
    alertUnread: true,
  };
  return { id, db: { ...db, monitorApplications: [...db.monitorApplications, record] } };
}

export function lookupMonitor(db: OpsDb, id: string, email: string): MonitorPublic {
  const row = db.monitorApplications.find((item) => item.id === id.trim() && item.email === emailOf(email));
  if (!row) throw new Error("접수번호와 이메일이 일치하는 신청이 없습니다.");
  return { id: row.id, status: row.status, createdAt: row.createdAt, updatedAt: row.updatedAt, publicNote: row.publicNote };
}

export function updateMonitor(
  db: OpsDb,
  id: string,
  patch: Partial<Pick<MonitorApplication, "status" | "publicNote" | "adminMemo" | "alertUnread">>,
  now: string,
): OpsDb {
  if (patch.status && !MONITOR_STATUSES.includes(patch.status)) throw new Error("상태 값이 올바르지 않습니다.");
  return {
    ...db,
    monitorApplications: db.monitorApplications.map((item) =>
      item.id === id ? { ...item, ...patch, updatedAt: now } : item,
    ),
  };
}

export function submitCampaign(db: OpsDb, input: CampaignInput, now: string): { db: OpsDb; id: string } {
  requireText(input.organizationName, "모임명");
  requireText(input.managerName, "담당자");
  assertEmail(input.email);
  requireText(input.phone, "연락처");
  requireText(input.purpose, "신청 목적");
  requireText(input.municipality, "관할 지자체");
  requireText(input.department, "지원부서");
  requireText(input.eventName, "행사명");
  requireText(input.eventPurpose, "행사 목적");
  requireText(input.eventPeriod, "행사 기간");
  requireText(input.expectedParticipants, "예상 참여자");
  requireText(input.collectedItems, "개인정보 수집 항목");
  if (input.privacyConsent !== true) throw new Error("개인정보 수집·이용에 동의해 주세요.");
  assertFile(input.attachment);

  const id = stamp(db.campaignApplications.length, "CIV", now);
  const record: CampaignApplication = {
    id,
    createdAt: now,
    updatedAt: now,
    organizationName: input.organizationName.trim(),
    managerName: input.managerName.trim(),
    email: emailOf(input.email),
    phone: input.phone.trim(),
    purpose: input.purpose.trim(),
    municipality: input.municipality.trim(),
    department: input.department.trim(),
    eventName: input.eventName.trim(),
    eventPurpose: input.eventPurpose.trim(),
    eventPeriod: input.eventPeriod.trim(),
    expectedParticipants: input.expectedParticipants.trim(),
    collectedItems: input.collectedItems.trim(),
    attachment: input.attachment,
    privacyConsent: true,
    status: "접수",
    publicNote: "",
    adminMemo: "",
    licenseCode: "",
    supplements: [],
    alertUnread: true,
  };
  return { id, db: { ...db, campaignApplications: [...db.campaignApplications, record] } };
}

export function lookupCampaign(db: OpsDb, id: string, email: string): CampaignPublic {
  const row = db.campaignApplications.find((item) => item.id === id.trim() && item.email === emailOf(email));
  if (!row) throw new Error("접수번호와 이메일이 일치하는 신청이 없습니다.");
  const showLicense = row.status === "사용권발급" || row.status === "이용종료" || row.status === "파기확인";
  return {
    id: row.id,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    publicNote: row.publicNote,
    licenseCode: showLicense ? row.licenseCode : "",
    eventName: row.eventName,
    organizationName: row.organizationName,
  };
}

export function supplementCampaign(
  db: OpsDb,
  id: string,
  email: string,
  note: string,
  file: StoredFile | undefined,
  now: string,
): OpsDb {
  requireText(note, "보완 내용");
  assertFile(file);
  const index = db.campaignApplications.findIndex((item) => item.id === id.trim() && item.email === emailOf(email));
  if (index < 0) throw new Error("접수번호와 이메일이 일치하는 신청이 없습니다.");
  const current = db.campaignApplications[index]!;
  if (current.status !== "보완요청") throw new Error("보완요청 상태에서만 추가 자료를 제출할 수 있습니다.");
  const next: CampaignApplication = {
    ...current,
    updatedAt: now,
    status: "서류확인",
    alertUnread: true,
    supplements: [...current.supplements, { at: now, note: note.trim(), fileName: file?.name }],
    attachment: file ?? current.attachment,
  };
  const campaignApplications = [...db.campaignApplications];
  campaignApplications[index] = next;
  return { ...db, campaignApplications };
}

export function updateCampaign(
  db: OpsDb,
  id: string,
  patch: Partial<Pick<CampaignApplication, "status" | "publicNote" | "adminMemo" | "licenseCode" | "alertUnread">>,
  now: string,
): OpsDb {
  if (patch.status && !CAMPAIGN_STATUSES.includes(patch.status)) throw new Error("상태 값이 올바르지 않습니다.");
  return {
    ...db,
    campaignApplications: db.campaignApplications.map((item) =>
      item.id === id ? { ...item, ...patch, updatedAt: now } : item,
    ),
  };
}

function visibleEducation(db: OpsDb): EducationItem[] {
  const seed = EDUCATION_SEED.filter((item) => !db.deletedEducationSlugs.includes(item.slug)).map((item) => ({
    ...item,
    ...db.educationOverrides[item.slug],
  }));
  return [...seed, ...db.extraEducation];
}

export function submitEnrollment(db: OpsDb, input: EnrollmentInput, now: string): { db: OpsDb; id: string } {
  const education = visibleEducation(db).find((item) => item.slug === input.educationSlug);
  if (!education || !education.published) throw new Error("신청할 수 있는 교육이 아닙니다.");
  if (education.status !== "접수중") throw new Error("지금은 접수 기간이 아닙니다.");
  requireText(input.name, "이름");
  requireText(input.organization, "소속");
  assertEmail(input.email);
  if (input.privacyConsent !== true) throw new Error("개인정보 수집·이용에 동의해 주세요.");
  const email = emailOf(input.email);
  const duplicate = db.educationEnrollments.some(
    (item) => item.educationSlug === input.educationSlug && item.email === email,
  );
  if (duplicate) throw new Error("같은 교육에 이미 신청한 이메일입니다.");
  if (education.capacity != null) {
    const count = db.educationEnrollments.filter((item) => item.educationSlug === input.educationSlug).length;
    if (count >= education.capacity) throw new Error("정원이 마감되었습니다.");
  }
  const id = stamp(db.educationEnrollments.length, "EDU", now);
  const record: EducationEnrollment = {
    id,
    educationSlug: input.educationSlug,
    createdAt: now,
    name: input.name.trim(),
    organization: input.organization.trim(),
    email,
    phone: input.phone?.trim() ?? "",
    privacyConsent: true,
  };
  return { id, db: { ...db, educationEnrollments: [...db.educationEnrollments, record] } };
}

export function isItemVisible(published: boolean, publishAt: string | undefined, now: number | null) {
  if (!published) return false;
  if (!publishAt) return true;
  if (now == null) return false;
  const time = Date.parse(publishAt);
  return Number.isFinite(time) && time <= now;
}

export function buildPublicContent(db: OpsDb, now: number | null): PublicContent {
  const education = visibleEducation(db)
    .filter((item) => isItemVisible(item.published, item.publishAt, now))
    .sort((a, b) => b.date.localeCompare(a.date));
  const publications = [
    ...PUBLICATION_SEED.filter((item) => !db.deletedPublicationSlugs.includes(item.slug)).map((item) => ({
      ...item,
      ...db.publicationOverrides[item.slug],
    })),
    ...db.extraPublications,
  ]
    .filter((item) => isItemVisible(item.published, item.publishAt, now))
    .sort((a, b) => b.date.localeCompare(a.date));
  const policies = POLICY_ITEMS.map((item) => ({ ...item, ...db.policyOverrides[item.slug] }));
  const seedNotices: BoardPost[] = [
    {
      id: "notice-recruit-planned",
      title: "국민 개인정보보호 모니터링단은 모집 예정입니다",
      body: "선발 일정이 정해지면 이 게시판에 올립니다. 그 전에 남긴 신청은 사전 참여 의사로 접수됩니다.",
      createdAt: "2026-10-18T00:00:00.000Z",
      published: true,
    },
  ];
  const enrollmentCounts: Record<string, number> = {};
  for (const row of db.educationEnrollments) {
    enrollmentCounts[row.educationSlug] = (enrollmentCounts[row.educationSlug] ?? 0) + 1;
  }
  return {
    education,
    publications,
    policies,
    notices: (db.notices ?? seedNotices).filter((item) => item.published),
    activities: (db.activities ?? []).filter((item) => item.published),
    licenseSettings: db.licenseSettings ?? { ...DEFAULT_LICENSE_SETTINGS },
    publishedStats: db.publishedStats ?? [],
    sureMarks: db.sureMarks,
    enrollmentCounts,
  };
}

export function verifySureMark(db: OpsDb, code: string): SureMarkGrant | null {
  const normalized = code.trim().toLowerCase();
  if (!normalized) return null;
  return db.sureMarks.find((item) => item.code.trim().toLowerCase() === normalized) ?? null;
}

export function applyEducationOverride(db: OpsDb, input: EducationOverrideInput): OpsDb {
  const known = EDUCATION_SEED.some((item) => item.slug === input.slug) || db.extraEducation.some((item) => item.slug === input.slug);
  if (!known) throw new Error("교육을 찾을 수 없습니다.");
  if (db.extraEducation.some((item) => item.slug === input.slug)) {
    return {
      ...db,
      extraEducation: db.extraEducation.map((item) => (item.slug === input.slug ? { ...item, ...input } : item)),
    };
  }
  return {
    ...db,
    educationOverrides: { ...db.educationOverrides, [input.slug]: { ...db.educationOverrides[input.slug], ...input } },
  };
}

export function applyPublicationPatch(db: OpsDb, slug: string, patch: Partial<PublicationItem>): OpsDb {
  if (db.extraPublications.some((item) => item.slug === slug)) {
    return { ...db, extraPublications: db.extraPublications.map((item) => (item.slug === slug ? { ...item, ...patch } : item)) };
  }
  if (!PUBLICATION_SEED.some((item) => item.slug === slug)) throw new Error("자료를 찾을 수 없습니다.");
  return {
    ...db,
    publicationOverrides: { ...db.publicationOverrides, [slug]: { ...db.publicationOverrides[slug], ...patch } },
  };
}

export function applyPolicyPatch(db: OpsDb, slug: string, patch: Partial<PolicyItem>): OpsDb {
  if (patch.status && !POLICY_STATUSES.includes(patch.status)) throw new Error("정책 상태가 올바르지 않습니다.");
  if (!POLICY_ITEMS.some((item) => item.slug === slug)) throw new Error("정책 제안을 찾을 수 없습니다.");
  return { ...db, policyOverrides: { ...db.policyOverrides, [slug]: { ...db.policyOverrides[slug], ...patch } } };
}

export function campaignStatusLabel(status: CampaignStatus) {
  return status;
}

export function licenseFrom(settings: LicenseSettings | null): LicenseSettings {
  return settings ?? { ...DEFAULT_LICENSE_SETTINGS };
}
