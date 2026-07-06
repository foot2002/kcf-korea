import type { AssociationApplicationInput } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PHONE_DIGITS = 9;
const MAX_MESSAGE_LENGTH = 1000;
const MAX_TEXT_LENGTH = 200;

function trimOptional(value: string | undefined | null): string | undefined {
  const trimmed = String(value ?? "").trim();
  return trimmed || undefined;
}

export function normalizeWebsiteUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const url = new URL(candidate);
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function validateAssociationApplicationForm(
  input: Partial<AssociationApplicationInput> & { honeypot?: string },
):
  | { ok: true; data: AssociationApplicationInput }
  | { ok: false; error: string } {
  if (input.honeypot?.trim()) {
    return { ok: false, error: "신청 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }

  const associationName = input.associationName?.trim() ?? "";
  if (!associationName) {
    return { ok: false, error: "협회·단체명을 입력해 주세요." };
  }

  const websiteUrl = normalizeWebsiteUrl(input.websiteUrl ?? "");
  if (!websiteUrl) {
    return {
      ok: false,
      error: "웹사이트 주소를 올바르게 입력해 주세요. (예: www.example.or.kr)",
    };
  }

  const count = input.memberCompanyCount;
  if (count == null || !Number.isFinite(count) || count < 1 || !Number.isInteger(count)) {
    return { ok: false, error: "회원사 수는 1 이상의 숫자로 입력해 주세요." };
  }

  const managerName = input.managerName?.trim() ?? "";
  if (!managerName) {
    return { ok: false, error: "담당자명을 입력해 주세요." };
  }

  const managerPhone = input.managerPhone?.trim() ?? "";
  const phoneDigits = managerPhone.replace(/\D/g, "");
  if (!managerPhone || phoneDigits.length < MIN_PHONE_DIGITS) {
    return { ok: false, error: "전화번호를 올바르게 입력해 주세요." };
  }

  const managerEmail = input.managerEmail?.trim() ?? "";
  if (!managerEmail || !EMAIL_RE.test(managerEmail)) {
    return { ok: false, error: "이메일을 올바르게 입력해 주세요." };
  }

  const message = input.message?.trim();
  if (message && message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: `문의사항은 ${MAX_MESSAGE_LENGTH}자 이내로 입력해 주세요.` };
  }

  const optionalFields = [
    input.representativeName,
    input.businessNumber,
    input.establishedYear,
    input.address,
    input.industry,
    input.managerPosition,
  ];
  for (const field of optionalFields) {
    if (field && field.trim().length > MAX_TEXT_LENGTH) {
      return { ok: false, error: `입력 항목은 ${MAX_TEXT_LENGTH}자 이내로 입력해 주세요.` };
    }
  }

  const smallRaw = trimOptional(input.smallBusinessMemberCount);
  if (smallRaw && smallRaw !== "모름") {
    const smallNum = Number(smallRaw);
    if (!Number.isFinite(smallNum) || smallNum < 0 || !Number.isInteger(smallNum)) {
      return { ok: false, error: "소기업 회원사 수는 숫자 또는 '모름'으로 입력해 주세요." };
    }
  }

  if (!input.privacyConsent) {
    return { ok: false, error: "개인정보 수집·이용에 동의해 주세요." };
  }

  return {
    ok: true,
    data: {
      associationName,
      websiteUrl,
      memberCompanyCount: count,
      managerName,
      managerPhone,
      managerEmail,
      representativeName: trimOptional(input.representativeName),
      businessNumber: trimOptional(input.businessNumber),
      establishedYear: trimOptional(input.establishedYear),
      address: trimOptional(input.address),
      industry: trimOptional(input.industry),
      smallBusinessMemberCount: smallRaw,
      managerPosition: trimOptional(input.managerPosition),
      preferredContactMethod: trimOptional(input.preferredContactMethod),
      message: message || undefined,
      privacyConsent: true,
      newsletterConsent: input.newsletterConsent === true,
    },
  };
}
