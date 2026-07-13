export const CONTACT_INQUIRY_CATEGORIES = [
  "재단문의",
  "개인정보보호문의",
  "제안 및 제휴",
  "기타",
] as const;

export type ContactInquiryCategory = (typeof CONTACT_INQUIRY_CATEGORIES)[number];

export const CONTACT_INQUIRY_STATUSES = ["접수완료", "검토중", "답변완료"] as const;

export type ContactInquiryStatus = (typeof CONTACT_INQUIRY_STATUSES)[number];

export type ContactInquiryInput = {
  category: ContactInquiryCategory;
  organization: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

export type ContactInquiry = ContactInquiryInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: ContactInquiryStatus;
  adminMemo?: string;
};
