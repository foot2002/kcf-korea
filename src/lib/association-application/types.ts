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
};

/** @deprecated Use SupportApplicationInput */
export type AssociationApplicationInput = SupportApplicationInput;

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
