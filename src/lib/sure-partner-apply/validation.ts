import type { SurePartnerApplyInput } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSurePartnerApplyForm(
  input: Partial<SurePartnerApplyInput> & { privacyConsent?: boolean; honeypot?: string },
):
  | { ok: true; data: SurePartnerApplyInput }
  | { ok: false; error: string } {
  if (input.honeypot?.trim()) {
    return { ok: false, error: "요청을 처리할 수 없습니다." };
  }

  const companyName = input.companyName?.trim() ?? "";
  const managerName = input.managerName?.trim() ?? "";
  const phone = input.phone?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const serviceName = input.serviceName?.trim() ?? "";
  const strengths = input.strengths?.trim() ?? "";

  if (!companyName) return { ok: false, error: "기업명을 입력해 주세요." };
  if (!managerName) return { ok: false, error: "담당자명을 입력해 주세요." };
  if (!phone) return { ok: false, error: "연락처를 입력해 주세요." };
  if (email && !EMAIL_RE.test(email)) {
    return { ok: false, error: "이메일 형식을 확인해 주세요." };
  }
  if (!serviceName) return { ok: false, error: "보유 개인정보 서비스명을 입력해 주세요." };
  if (strengths.length < 10) {
    return { ok: false, error: "특징 및 장점을 10자 이상 입력해 주세요." };
  }
  if (!input.privacyConsent) {
    return { ok: false, error: "개인정보 수집·이용 동의가 필요합니다." };
  }

  return {
    ok: true,
    data: { companyName, managerName, phone, email, serviceName, strengths },
  };
}
