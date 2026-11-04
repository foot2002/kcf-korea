export const SURE_CHECK_URL = "https://sure-check.vercel.app/";

export type PrivacyNavChild = { label: string; to: string };
export type PrivacyNavItem = {
  label: string;
  to: string;
  badge?: string;
  children?: PrivacyNavChild[];
};

export const PRIVACY_CENTER_PAGES: PrivacyNavItem[] = [
  { label: "진흥원 소개", to: "/privacy-center" },
  { label: "실태조사·분석", to: "/privacy-center/research" },
  { label: "교육·웨비나", to: "/privacy-center/education" },
  {
    label: "인증도구 보급·확산",
    to: "/privacy-center/security-services",
    badge: "무상제공",
    children: [
      { label: "무상제공 안내·신청", to: "/privacy-center/security-services" },
      { label: "우수기관·SURE MARK", to: "/privacy-center/sure-mark" },
    ],
  },
  { label: "개인정보 지키미 모니터링단", to: "/privacy-center/rights", badge: "모집 예정" },
  { label: "소식·자료", to: "/privacy-center/publications" },
];
