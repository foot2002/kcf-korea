import type { ContactInquiry, ContactInquiryInput, ContactInquiryStatus } from "./types";

export async function submitContactInquiry(
  data: ContactInquiryInput,
  _honeypot?: string,
): Promise<{ id: string }> {
  const { submitContactInquiryClient } = await import("./client-storage");
  return submitContactInquiryClient(data);
}

export async function fetchContactInquiries(): Promise<ContactInquiry[]> {
  const { listContactInquiriesClient } = await import("./client-storage");
  return listContactInquiriesClient();
}

export async function updateContactInquiryStatus(
  id: string,
  status: ContactInquiryStatus,
): Promise<void> {
  const { updateContactInquiryStatusClient } = await import("./client-storage");
  updateContactInquiryStatusClient(id, status);
}

export async function updateContactInquiryMemo(id: string, adminMemo: string): Promise<void> {
  const { updateContactInquiryMemoClient } = await import("./client-storage");
  updateContactInquiryMemoClient(id, adminMemo);
}

export async function removeContactInquiry(id: string): Promise<void> {
  const { deleteContactInquiryClient } = await import("./client-storage");
  deleteContactInquiryClient(id);
}
