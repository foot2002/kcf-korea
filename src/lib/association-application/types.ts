export type ApplicationStatus =
  | "접수완료"
  | "검토중"
  | "연락완료"
  | "협약서 발송"
  | "협약완료"
  | "보류";

export interface AssociationApplication {
  id: string;
  createdAt: string;
  associationName: string;
  websiteUrl: string;
  memberCompanyCount: number;
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

export type AssociationApplicationInput = {
  associationName: string;
  websiteUrl: string;
  memberCompanyCount: number;
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
};
