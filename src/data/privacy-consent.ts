import { foundation } from "@/data/kcf";

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
  | "monitor-apply"
  | "free-apply"
  | "cpo-apply"
  | "pledge-submit";

export type PrivacyConsentNotice = {
  title: string;
  purpose: string;
  requiredItems: string;
  optionalItems?: string;
};

const NOTICES: Record<PrivacyConsentVariant, PrivacyConsentNotice> = {
  "contact-inquiry": {
    title: "개인정보 수집·이용 동의 (필수)",
    purpose: "문의 접수, 내용 확인, 답변 및 관련 업무 처리",
    requiredItems: "문의 유형, 이름, 이메일, 제목, 내용",
    optionalItems: "소속, 연락처, 첨부파일",
  },
  "monitor-apply": {
    title: "개인정보 수집·이용 동의 (필수)",
    purpose: "국민 개인정보보호 모니터링단 사전 신청 접수, 선발 연락 및 활동 안내",
    requiredItems: "이름 또는 활동명, 이메일, 거주 시·도, 관심 분야, 참여 동기, 희망 활동 방식",
    optionalItems: "연락처, 모집 소식 알림 수신",
  },
  "free-apply": {
    title: "개인정보 수집·이용 동의 (필수)",
    purpose: "온라인조사플랫폼 무상제공 신청 접수, 약정 진행, 계정 안내 및 운영 연락",
    requiredItems: "기관·단체명, 구분, 대표자, 개인정보 보호책임자와 계정 관리자의 성명·직위·연락처·이메일",
    optionalItems: "실천선언서 서명본, 남길 말",
  },
  "cpo-apply": {
    title: "개인정보 수집·이용 동의 (필수)",
    purpose: "기업 CPO 특별 지원 신청 접수, 검토, 선정 안내 및 지원 연락",
    requiredItems: "기업명, 대표자, CPO 성명·직위·연락처·이메일, 개인정보 수집 업무 설명, 실천선언 홍보 방식",
    optionalItems: "실천선언서 서명본",
  },
  "pledge-submit": {
    title: "개인정보 수집·이용 동의 (필수)",
    purpose: "개인정보보호 실천선언 참여 접수, 확인 및 실천기관 명단 게시",
    requiredItems: "기관명, 대표자, 개인정보 보호책임자, 담당자 이름·이메일, 서명본",
    optionalItems: "담당자 연락처",
  },
};

const RETENTION_BY_VARIANT: Partial<Record<PrivacyConsentVariant, string>> = {
  "contact-inquiry": "상태가 '답변 완료'가 된 날부터 3년",
  "monitor-apply": "접수일부터 18개월. '미선발'이 되면 그날부터 6개월",
  "free-apply": "상태가 '이용 종료' 또는 '반려'가 된 날 즉시 파기. 그 전에는 만료일 없음",
  "cpo-apply": "상태가 '지원 종료' 또는 '반려'가 된 날 즉시 파기",
  "pledge-submit": "상태가 '게시 종료' 또는 '반려'가 된 날부터 1년",
};

export function consentRetention(variant: PrivacyConsentVariant) {
  return RETENTION_BY_VARIANT[variant] ?? PRIVACY_RETENTION_PERIOD;
}

export function getPrivacyConsentNotice(variant: PrivacyConsentVariant): PrivacyConsentNotice {
  return NOTICES[variant];
}
