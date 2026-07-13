export type ApplicationStatus =
  | "접수완료"
  | "검토중"
  | "연락완료"
  | "협약서 발송"
  | "협약완료"
  | "보류";

export type ApplicationKind = "association" | "enterprise" | "public";

export const APPLICATION_KIND_LABELS: Record<ApplicationKind, string> = {
  association: "협단체",
  enterprise: "기업",
  public: "공공기관",
};

/** 협단체 신청 확장 필드 */
export type AssociationExtendedFields = {
  websiteUrl?: string;
  memberCompanyCount?: number;
  representativeName?: string;
  businessNumber?: string;
  establishedYear?: string;
  address?: string;
  industry?: string;
  smallBusinessMemberCount?: string;
  managerPosition?: string;
  preferredContactMethod?: string;
  newsletterConsent?: boolean;
};

export interface AssociationApplication {
  id: string;
  createdAt: string;
  kind?: ApplicationKind;
  associationName: string;
  websiteUrl?: string;
  memberCompanyCount?: number;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  representativeName?: string;
  businessNumber?: string;
  establishedYear?: string;
  address?: string;
  industry?: string;
  smallBusinessMemberCount?: string;
  managerPosition?: string;
  preferredContactMethod?: string;
  message?: string;
  privacyConsent: boolean;
  newsletterConsent?: boolean;
  status: ApplicationStatus;
  adminMemo?: string;
  updatedAt?: string;
}

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "접수완료",
  "검토중",
  "연락완료",
  "협약서 발송",
  "협약완료",
  "보류",
];

export type SupportApplicationInput = {
  kind: ApplicationKind;
  associationName: string;
  managerName: string;
  managerPhone: string;
  managerEmail: string;
  message?: string;
  privacyConsent: boolean;
} & AssociationExtendedFields;

export function resolveApplicationKind(app: AssociationApplication): ApplicationKind {
  return app.kind ?? "association";
}

export function organizationFieldLabel(kind: ApplicationKind): string {
  switch (kind) {
    case "enterprise":
      return "기업명";
    case "public":
      return "기관명";
    default:
      return "협회·단체명";
  }
}

export function buildApplicationRecord(
  data: SupportApplicationInput,
  id: string,
  now: string,
): AssociationApplication {
  return {
    id,
    createdAt: now,
    updatedAt: now,
    kind: data.kind,
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
  };
}
