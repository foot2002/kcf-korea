export const SURE_CHECK_URL = "https://sure-check.vercel.app/";

/** 진흥원 페이지 공통 — 온라인 설문·수집 추천 수단 명칭 */
export const SECURE_COLLECTION_TOOL = "보안 인증 수집도구";

export const PRIVACY_CENTER_PAGES = [
  { label: "진흥원 홈", to: "/privacy-center" },
  { label: "개인정보보호법/제도", to: "/privacy-center/law" },
  { label: "안심 인증 SURE Mark", to: "/privacy-center/sure-mark" },
  { label: "안심인증 기업", to: "/privacy-center/sure-certified" },
  { label: "협단체 지원 바우처 사업소개", to: "/privacy-center/voucher" },
  { label: "협약/바우처 신청하기", to: "/privacy-center/association-apply" },
  { label: "설문안심 SURE 자가진단", to: "/privacy-center/self-check" },
] as const;
