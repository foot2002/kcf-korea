export type PrivacyInquiryAttachment = {
  id: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
};

export type PrivacyInquiryRecord = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: string;
  content: string;
  attachments: PrivacyInquiryAttachment[];
  createdAt: string;
  status: "new" | "read";
};

export type PrivacyInquiryAttachmentInput = {
  name: string;
  mimeType: string;
  size: number;
  dataBase64: string;
};

export type SubmitPrivacyInquiryInput = {
  name: string;
  email: string;
  phone?: string;
  type: string;
  content: string;
  consent: boolean;
  attachments?: PrivacyInquiryAttachmentInput[];
};
