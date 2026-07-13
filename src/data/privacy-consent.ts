import { foundation } from "@/data/kcf";
import type { ApplicationKind } from "@/lib/association-application/types";

/** 개인정보 처리자 — 개인정보보호진흥원을 운영하는 재단 */
export const PRIVACY_CONTROLLER = {
  name: foundation.nameKo,
  operator: "개인정보보호진흥원",
  address: foundation.addressOfficial,
  tel: foundation.tel,
} as const;

export const PRIVACY_COLLECTION_METHOD =
  "홈페이지 온라인 문의·신청 양식을 통한 정보 주체의 직접 입력";

export const PRIVACY_RETENTION_PERIOD =
  "문의·신청 접수 및 관련 업무 처리 완료 후 3년 (단, 「개인정보 보호법」 등 관계 법령에 보존 의무가 있는 경우 해당 법령에서 정한 기간)";

export const PRIVACY_DISPOSAL_METHOD =
  "보유기간 경과 또는 처리 목적 달성 시 지체 없이 파기합니다. 전자적 파일은 복구·재생이 불가능한 방법으로 영구 삭제하고, 종이 문서는 분쇄 또는 소각합니다.";

export const PRIVACY_THIRD_PARTY =
  "해당 없음 (원칙적으로 제3자에게 제공하지 않습니다)";

export const PRIVACY_REFUSAL_NOTICE =
  "정보 주체는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다. 다만, 필수 항목에 대한 동의를 거부할 경우 문의·신청 접수 및 답변·안내가 제한될 수 있습니다.";

export type PrivacyConsentVariant =
  | "contact-inquiry"
  | "privacy-inquiry"
  | `support-application-${ApplicationKind}`;

export type PrivacyConsentNotice = {
  title: string;
  purpose: string;
  requiredItems: string;
  optionalItems?: string;
};

const SUPPORT_NOTICES: Record<ApplicationKind, PrivacyConsentNotice> = {
  association: {
    title: "개인정보 수집·이용 동의 (필수)",
    purpose:
      "SURE START 협단체 지원사업 협약·바우처 신청 접수, 신청 내용 확인, 담당자 연락 및 지원사업 안내",
    requiredItems: "협회·단체명, 담당자명, 연락처, 이메일",
    optionalItems: "남기는 글",
  },
  enterprise: {
    title: "개인정보 수집·이용 동의 (필수)",
    purpose: "기업 지원 신청 접수, 신청 내용 확인, 담당자 연락 및 지원사업 안내",
    requiredItems: "기업명, 담당자명, 연락처, 이메일",
    optionalItems: "남기는 글",
  },
  public: {
    title: "개인정보 수집·이용 동의 (필수)",
    purpose: "공공기관 지원 신청 접수, 신청 내용 확인, 담당자 연락 및 지원사업 안내",
    requiredItems: "기관명, 담당자명, 연락처, 이메일",
    optionalItems: "남기는 글",
  },
};

const NOTICES: Record<PrivacyConsentVariant, PrivacyConsentNotice> = {
  "contact-inquiry": {
    title: "개인정보 수집·이용 동의 (필수)",
    purpose:
      "Contact Us 문의 접수, 문의 내용 확인, 답변 및 관련 업무 처리 (재단·개인정보보호진흥원 문의 구분에 따른 담당 부서 연계 포함)",
    requiredItems: "소속, 이름, 연락처, 문의 유형, 문의 내용",
    optionalItems: "이메일",
  },
  "privacy-inquiry": {
    title: "개인정보 수집·이용 동의 (필수)",
    purpose:
      "개인정보보호진흥원 문의·제보 접수, 문의 내용 확인, 답변 및 관련 업무 처리",
    requiredItems: "이름 또는 기관명, 이메일, 문의 유형, 문의 내용",
    optionalItems: "연락처, 첨부파일(파일명·내용에 포함된 개인정보)",
  },
  "support-application-association": SUPPORT_NOTICES.association,
  "support-application-enterprise": SUPPORT_NOTICES.enterprise,
  "support-application-public": SUPPORT_NOTICES.public,
};

export function getPrivacyConsentNotice(variant: PrivacyConsentVariant): PrivacyConsentNotice {
  return NOTICES[variant];
}

export function supportApplicationConsentVariant(kind: ApplicationKind): PrivacyConsentVariant {
  return `support-application-${kind}`;
}
