import type { ContactInquiryCategory, ContactInquiryInput } from "./types";
import { CONTACT_INQUIRY_CATEGORIES } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactInquiryForm(
  input: Partial<ContactInquiryInput> & { privacyConsent?: boolean; honeypot?: string },
):
  | { ok: true; data: ContactInquiryInput }
  | { ok: false; error: string } {
  if (input.honeypot?.trim()) {
    return { ok: false, error: "요청을 처리할 수 없습니다." };
  }

  const category = input.category as ContactInquiryCategory;
  if (!CONTACT_INQUIRY_CATEGORIES.includes(category)) {
    return { ok: false, error: "문의 유형을 선택해 주세요." };
  }

  const organization = input.organization?.trim() ?? "";
  const name = input.name?.trim() ?? "";
  const phone = input.phone?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const message = input.message?.trim() ?? "";

  if (!organization) return { ok: false, error: "소속을 입력해 주세요." };
  if (!name) return { ok: false, error: "이름을 입력해 주세요." };
  if (!phone) return { ok: false, error: "연락처를 입력해 주세요." };
  if (email && !EMAIL_RE.test(email)) {
    return { ok: false, error: "이메일 형식을 확인해 주세요." };
  }
  if (message.length < 10) {
    return { ok: false, error: "문의 내용을 10자 이상 입력해 주세요." };
  }
  if (!input.privacyConsent) {
    return { ok: false, error: "개인정보 수집·이용 동의가 필요합니다." };
  }

  return {
    ok: true,
    data: { category, organization, name, phone, email, message },
  };
}
