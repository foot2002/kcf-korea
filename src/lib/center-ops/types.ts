import type { CampaignStatus, EducationItem, EducationStatus, LicenseSettings, MonitorStatus, PolicyItem, PolicyStatus, PublicationItem } from "@/data/privacy-program";

export type StoredFile = {
  name: string;
  mimeType: string;
  dataUrl: string;
};

export type MonitorApplication = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  interests: string[];
  motivation: string;
  participationMode: string;
  privacyConsent: true;
  notifyConsent: boolean;
  status: MonitorStatus;
  publicNote: string;
  adminMemo: string;
  alertUnread: boolean;
};

export type CampaignApplication = {
  id: string;
  createdAt: string;
  updatedAt: string;
  organizationName: string;
  managerName: string;
  email: string;
  phone: string;
  purpose: string;
  municipality: string;
  department: string;
  eventName: string;
  eventPurpose: string;
  eventPeriod: string;
  expectedParticipants: string;
  collectedItems: string;
  attachment?: StoredFile;
  privacyConsent: true;
  status: CampaignStatus;
  publicNote: string;
  adminMemo: string;
  licenseCode: string;
  supplements: { at: string; note: string; fileName?: string }[];
  alertUnread: boolean;
};

export type EducationEnrollment = {
  id: string;
  educationSlug: string;
  createdAt: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  privacyConsent: true;
};

export type BoardPost = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  published: boolean;
};

export type SureMarkGrant = {
  id: string;
  code: string;
  organization: string;
  grantedAt: string;
  expiresAt: string;
  status: "유효" | "갱신필요" | "취소";
};

export type PublishedStat = { id: string; label: string; value: string };

export type OpsDb = {
  monitorApplications: MonitorApplication[];
  campaignApplications: CampaignApplication[];
  educationEnrollments: EducationEnrollment[];
  notices: BoardPost[] | null;
  activities: BoardPost[] | null;
  educationOverrides: Record<string, Partial<EducationItem>>;
  extraEducation: EducationItem[];
  deletedEducationSlugs: string[];
  publicationOverrides: Record<string, Partial<PublicationItem>>;
  extraPublications: PublicationItem[];
  deletedPublicationSlugs: string[];
  policyOverrides: Record<string, Partial<PolicyItem>>;
  licenseSettings: LicenseSettings | null;
  publishedStats: PublishedStat[] | null;
  sureMarks: SureMarkGrant[];
};

export type MonitorInput = {
  name: string;
  email: string;
  phone?: string;
  region: string;
  interests: string[];
  motivation: string;
  participationMode: string;
  privacyConsent: true;
  notifyConsent: boolean;
};

export type CampaignInput = {
  organizationName: string;
  managerName: string;
  email: string;
  phone: string;
  purpose: string;
  municipality: string;
  department: string;
  eventName: string;
  eventPurpose: string;
  eventPeriod: string;
  expectedParticipants: string;
  collectedItems: string;
  attachment?: StoredFile;
  privacyConsent: true;
};

export type EnrollmentInput = {
  educationSlug: string;
  name: string;
  organization: string;
  email: string;
  phone?: string;
  privacyConsent: true;
};

export type PublicContent = {
  education: EducationItem[];
  publications: PublicationItem[];
  policies: PolicyItem[];
  notices: BoardPost[];
  activities: BoardPost[];
  licenseSettings: LicenseSettings;
  publishedStats: PublishedStat[];
  sureMarks: SureMarkGrant[];
  enrollmentCounts: Record<string, number>;
};

export type MonitorPublic = Pick<
  MonitorApplication,
  "id" | "status" | "createdAt" | "updatedAt" | "publicNote"
>;

export type CampaignPublic = Pick<
  CampaignApplication,
  | "id"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "publicNote"
  | "licenseCode"
  | "eventName"
  | "organizationName"
>;

export type EducationOverrideInput = {
  slug: string;
  status?: EducationStatus;
  capacity?: number | null;
  recordedApplicants?: number | null;
  recordedParticipants?: number | null;
  figuresAreApproximate?: boolean;
  materialUrl?: string;
  materialName?: string;
  videoUrl?: string;
  published?: boolean;
  publishAt?: string;
  summary?: string;
};
