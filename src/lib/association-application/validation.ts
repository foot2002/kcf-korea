import type { ApplicationKind, SupportApplicationInput } from "./types";
import { organizationFieldLabel } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PHONE_DIGITS = 9;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_NAME_LENGTH = 200;

function trimOptional(value: string | undefined | null): string | undefined {
  const trimmed = String(value ?? "").trim();
  return trimmed || undefined;
}

export function validateSupportApplicationForm(
  kind: ApplicationKind,
  input: Partial<SupportApplicationInput> & { honeypot?: string },
):
  | { ok: true; data: SupportApplicationInput }
  | { ok: false; error: string } {
  if (input.honeypot?.trim()) {
    return { ok: false, error: "신청 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }

  const orgLabel = organizationFieldLabel(kind);
  const associationName = input.associationName?.trim() ?? "";
  if (!associationName) {
    return { ok: false, error: `${orgLabel}을(를) 입력해 주세요.` };
  }
  if (associationName.length > MAX_NAME_LENGTH) {
    return { ok: false, error: `${orgLabel}은(는) ${MAX_NAME_LENGTH}자 이내로 입력해 주세요.` };
  }

  const managerName = input.managerName?.trim() ?? "";
  if (!managerName) {
    return { ok: false, error: "담당자명을 입력해 주세요." };
  }

  const managerPhone = input.managerPhone?.trim() ?? "";
  const phoneDigits = managerPhone.replace(/\D/g, "");
  if (!managerPhone || phoneDigits.length < MIN_PHONE_DIGITS) {
    return { ok: false, error: "연락처를 올바르게 입력해 주세요." };
  }

  const managerEmail = input.managerEmail?.trim() ?? "";
  if (!managerEmail || !EMAIL_RE.test(managerEmail)) {
    return { ok: false, error: "이메일을 올바르게 입력해 주세요." };
  }

  const message = trimOptional(input.message);
  if (message && message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: `남기는 글은 ${MAX_MESSAGE_LENGTH}자 이내로 입력해 주세요.` };
  }

  if (!input.privacyConsent) {
    return { ok: false, error: "개인정보 수집·이용에 동의해 주세요." };
  }

  return {
    ok: true,
    data: {
      kind,
      associationName,
      managerName,
      managerPhone,
      managerEmail,
      message,
      privacyConsent: true,
    },
  };
}

/** @deprecated Use validateSupportApplicationForm */
export function validateAssociationApplicationForm(
  input: Partial<SupportApplicationInput> & { honeypot?: string },
) {
  return validateSupportApplicationForm("association", input);
}
