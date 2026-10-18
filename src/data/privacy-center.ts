export const SURE_CHECK_URL = "https://sure-check.vercel.app/";

/** 진흥원 페이지 공통 — 온라인 설문·수집 추천 수단 명칭 */
export const SECURE_COLLECTION_TOOL = "보안 인증 수집도구";

export const PRIVACY_CENTER_PAGES = [
  { label: "진흥원 소개", to: "/privacy-center" },
  { label: "개인정보보호 실태조사·연구", to: "/privacy-center/research" },
  { label: "국민 개인정보 권익 보호", to: "/privacy-center/rights" },
  { label: "우수 보안서비스 연계·보급", to: "/privacy-center/security-services" },
  { label: "정책 제안·제도 개선", to: "/privacy-center/policy" },
  { label: "기업·공공 지원·국민참여 캠페인", to: "/privacy-center/support" },
  { label: "교육·웨비나", to: "/privacy-center/education" },
  { label: "보도자료·연구보고서", to: "/privacy-center/publications" },
] as const;
