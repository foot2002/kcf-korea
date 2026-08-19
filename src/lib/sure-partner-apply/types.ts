export const SURE_PARTNER_APPLY_STATUSES = [
  "접수완료",
  "검토중",
  "연락완료",
  "승인",
  "보류",
] as const;

export type SurePartnerApplyStatus = (typeof SURE_PARTNER_APPLY_STATUSES)[number];

export type SurePartnerApplyInput = {
  companyName: string;
  managerName: string;
  phone: string;
  email: string;
  serviceName: string;
  strengths: string;
};

export type SurePartnerApplication = SurePartnerApplyInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: SurePartnerApplyStatus;
  adminMemo?: string;
};

export function buildSurePartnerApplication(
  data: SurePartnerApplyInput,
  id: string,
  now: string,
): SurePartnerApplication {
  return {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
    status: "접수완료",
  };
}
