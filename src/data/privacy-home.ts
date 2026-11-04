import partnerLogoEdutech from "@site-image/logo_edutech.png";
import partnerLogoEngineering from "@site-image/logo_engineering.png";
import partnerLogoFranchise from "@site-image/logo_franchise.png";
import partnerLogoHiseoul from "@site-image/logo_hiseoul.png";
import partnerLogoHospital from "@site-image/logo_hospital.png";
import partnerLogoIp from "@site-image/logo_ip.png";
import partnerLogoItservice from "@site-image/logo-itservice.png";
import partnerLogoMice from "@site-image/logo_mice.png";
import partnerLogoPco from "@site-image/logo_pco.png";
import partnerServiceIndustry from "@site-image/logo_서비스산업총연합회.gif";
import partnerSwict from "@site-image/logo_swict총연합회.gif";
import heroFreePlatform from "@/assets/illustrations/hero-free-platform.svg";
import heroResearch from "@/assets/illustrations/hero-research.svg";
import heroWebinar from "@/assets/illustrations/hero-webinar.svg";
import { FREE_PLATFORM, HERO } from "@/data/free-platform";

export type HomeSlide = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  tab: string;
  layout: "visual" | "split";
  visual?: string;
  photo?: string;
  panel?: "navy" | "teal";
  eyebrowTone?: "teal" | "navy" | "mint";
  stats?: readonly { value: string; label: string }[];
  chips?: readonly string[];
  mark?: boolean;
  figures?: readonly { value: string; label: string; inverse?: boolean }[];
  primary: { label: string; to: string; hash?: string };
  secondary?: { label: string; to: string; hash?: string };
};

const csapNumber = FREE_PLATFORM.cert.csap.split(" ")[0];
const nisChip = FREE_PLATFORM.cert.nisList.includes("도입 가능")
  ? "국정원 도입 가능 목록 등재"
  : FREE_PLATFORM.cert.nisList;

export const SLIDES: readonly HomeSlide[] = [
  {
    id: "free-platform",
    eyebrow: HERO.eyebrow,
    title: HERO.headline.replace(", ", ",\n"),
    body: HERO.sub,
    tab: "무상제공 상시 접수",
    layout: "visual",
    visual: heroFreePlatform,
    stats: HERO.stats,
    chips: [`CSAP 인증 · ${csapNumber}`, nisChip],
    mark: true,
    primary: { label: "무상제공 신청하기", to: "/privacy-center/security-services", hash: "apply-form" },
    secondary: { label: "실천선언 확인하기", to: "/privacy-center/security-services", hash: "pledge" },
  },
  {
    id: "research",
    eyebrow: "실태조사 결과 · 국정감사 인용",
    title: "공공기관 1,347곳 전수조사\n수집 설문 149건, 모두 보안인증 없어",
    body: "SURE-CHECK로 공개된 신청·설문 화면을 같은 기준에서 진단했습니다. 문제의 초점은 도구가 아니라 이용 방식입니다.",
    tab: "실태조사 결과",
    layout: "visual",
    visual: heroResearch,
    primary: { label: "조사 결과 보기", to: "/privacy-center/research" },
    secondary: { label: "SURE-CHECK 자가진단", to: "/privacy-center/sure-check" },
  },
  {
    id: "webinar",
    eyebrow: "웨비나 다시보기",
    title: "강화되는 개인정보보호법과\n기업·기관의 실전 대응",
    body: "신청 860개 이상 기관·기업. 법률·업무흐름·정보수집·내부협업·시스템DB 다섯 세션을 바로 볼 수 있습니다.",
    tab: "웨비나 다시보기",
    layout: "visual",
    visual: heroWebinar,
    primary: { label: "다시보기", to: "/privacy-center/education" },
  },
];

export const QUICK_MENU = [
  { label: "무상제공 신청", to: "/privacy-center/security-services", hash: "apply-form", icon: "FileSignature" },
  { label: "실천선언", to: "/privacy-center/security-services", hash: "pledge", icon: "ClipboardCheck" },
  { label: "SURE-CHECK 자가진단", to: "/privacy-center/sure-check", icon: "ScanSearch" },
  { label: "인증서 진위확인", to: "/privacy-center/sure-mark", hash: "verify", icon: "BadgeCheck" },
  { label: "웨비나 다시보기", to: "/privacy-center/education", icon: "PlayCircle" },
  { label: "보도자료", to: "/privacy-center/publications", hash: "press", icon: "Newspaper" },
] as const;

export const BUSINESSES = [
  {
    no: "01",
    title: "실태조사·분석",
    status: "결과 공개",
    purpose: "국민이 실제로 마주하는 온라인 신청·설문 화면을 SURE-CHECK로 같은 기준에서 진단합니다.",
    metric: "공공기관 1,347곳 전수조사 · 회신 기관 87.5% 수용·개선",
    to: "/privacy-center/research",
    icon: "Search",
  },
  {
    no: "02",
    title: "교육·웨비나",
    status: "다시보기",
    purpose: "강화된 개인정보 보호법에 맞춰 공공기관과 기업의 실무 대응을 전문가와 함께 나눕니다.",
    metric: "웨비나 신청 860개 이상 기관·기업",
    to: "/privacy-center/education",
    icon: "GraduationCap",
  },
  {
    no: "03",
    title: "인증도구 보급·확산",
    status: "무상제공 상시 접수",
    purpose: "검증된 수집 도구를 보급해 국민의 정보가 들어오는 첫 단계를 지킵니다.",
    metric: "협단체 15곳 협약 · 우수기관 7곳 선정",
    to: "/privacy-center/security-services",
    icon: "ShieldCheck",
    highlight: true,
  },
  {
    no: "04",
    title: "개인정보 지키미 모니터링단",
    status: "모집 예정",
    purpose: "국민이 공개된 신청·설문 화면을 함께 살피고, 우려가 있으면 알립니다.",
    metric: "사전 신청 접수 중",
    to: "/privacy-center/rights",
    icon: "Users",
  },
] as const;

export const FLOW = [
  { title: "진단", body: "SURE-CHECK로 공개된 수집 화면을 진단합니다." },
  { title: "교육", body: "법과 실무 대응을 교육합니다." },
  { title: "보급", body: "검증된 수집 도구를 무상으로 보급합니다." },
  { title: "감시", body: "국민과 함께 수집 현장을 살핍니다." },
];

export const ACHIEVEMENTS = [
  { date: "2026. 10. 13.", text: "국회 정무위원회 국정감사에서 실태조사 자료 인용" },
  { date: "2026. 10. 16.", text: "개인정보보호위원회, 외부 설문도구 이용 시 안전조치 준수 안내 발표" },
  { date: "2026", text: "협단체 15곳과 공동지원 협약" },
  { date: "2026. 11. 6.", text: "개인정보보호실천 우수기관 7곳 선정" },
];

export const ABOUT_NOTE =
  "개인정보보호진흥원은 (재)한국컨설팅산업재단 부설 민간 공익기구로, 정부 규제기관이 아닙니다. 조사 결과만으로 위법이나 유출을 단정하지 않습니다.";

export const HOME_UI = {
  pageTitle: "개인정보보호진흥원 | 공익법인 한국컨설팅산업재단",
  carouselLabel: "주요 소식",
  prevSlide: "이전 슬라이드",
  nextSlide: "다음 슬라이드",
  pause: "자동 전환 정지",
  play: "자동 전환 재생",
  slideMove: "번 슬라이드로 이동",
  markAlt: "개인정보보호 실천기관 SURE MARK",
  businessTitle: "주요사업 안내",
  businessLead: "개인정보보호진흥원의 네 가지 사업",
  detail: "자세히 보기",
  noticeTab: "공지사항",
  pressTab: "보도자료",
  more: "더보기 +",
  moreTo: "/privacy-center/publications",
  excellenceTitle: "2026 개인정보보호실천 우수기관",
  excellenceSelected: "개 기관 선정",
  viewExcellence: "우수기관 보기",
  verifyCert: "인증서 진위확인",
  excellenceTo: "/privacy-center/sure-mark",
  partnersTitle: "협력 협단체",
  inquiry: "문의하기",
  inquiryTo: "/contact",
  quickMenu: "바로가기",
} as const;

export const PUBLICATIONS_PAGE = {
  title: "소식·자료",
  description: "진흥원의 공지사항, 보도자료, 보고서와 관련 보도를 모았습니다.",
  metaTitle: "소식·자료 | 개인정보보호진흥원",
  tabs: [
    { id: "notices", label: "공지사항" },
    { id: "press", label: "보도자료" },
    { id: "reports", label: "보고서·자료" },
    { id: "news", label: "관련 보도" },
    { id: "law", label: "법·제도" },
  ],
  columns: { no: "번호", title: "제목", file: "첨부", date: "등록일" },
  noFile: "첨부 없음",
  pendingLink: "원문 링크 준비 중",
  empty: "등록된 자료가 없습니다.",
  pageLabel: "페이지",
  lawTitle: "개인정보보호법과 온라인 설문·수집 제도",
  lawBody:
    "온라인 설문, 행사 접수, 교육 신청 등 일상 업무에서도 개인정보 보호가 필요합니다. 개인정보보호 환경 변화와 실무에서 자주 묻는 질문을 정리했습니다.",
  lawLink: "법·제도 보기",
  researchLink: "조사 페이지",
  detailBack: "소식·자료",
  external: "외부 자료 보기",
  attachment: "첨부파일 다운로드",
  noAttachment: "등록된 첨부파일이 없습니다.",
  related: "관련 자료",
  notFound: "자료를 찾을 수 없습니다.",
} as const;

export const PUBLICATION_EXTRAS = {
  press: [
    {
      title:
        "공공기관 홈페이지 1,347곳 전수조사 — 개인정보 수집 설문 149건, 모두 보안인증 없는 서비스 사용 (국정감사 공동 보도자료)",
      date: "2026-10-13",
      file: "downloads/research/press-2026-public-survey-final.pdf",
    },
  ],
  reports: [
    {
      title: "2026 공공기관 온라인 개인정보 수집 실태조사 결과",
      date: "2026-10-13",
      link: "/privacy-center/research",
    },
    {
      title: "정부인증 온라인조사플랫폼(WiseON) 무상지원 사업 안내",
      date: "2026-11-03",
      file: "downloads/free-platform/wiseon-free-support-guide.pdf",
    },
  ],
} as const;

export const DEFAULT_NOTICES = [
  {
    date: "2026-11-06",
    title: "2026 개인정보보호실천 우수기관 7개 기관 선정",
    to: "/privacy-center/sure-mark",
  },
  {
    date: "2026-11-03",
    title: "정부인증 온라인조사플랫폼 무상제공 사업 안내 (상시 접수)",
    to: "/privacy-center/security-services",
  },
  {
    date: "2026-10-13",
    title: "공공기관 온라인 개인정보 수집 실태조사 결과 국정감사 인용",
    to: "/privacy-center/research",
  },
] as const;

export const PARTNER_ASSOCIATIONS = [
  { name: "하이서울기업협회", logo: partnerLogoHiseoul, darkBg: true },
  { name: "한국엔지니어링협회", logo: partnerLogoEngineering, darkBg: false },
  { name: "한국지식재산서비스협회", logo: partnerLogoIp, darkBg: true },
  { name: "한국IT서비스산업협회", logo: partnerLogoItservice, darkBg: false },
  { name: "한국에듀테크산업협회", logo: partnerLogoEdutech, darkBg: false },
  { name: "한국PCO협회", logo: partnerLogoPco, darkBg: false },
  { name: "대한병원협회", logo: partnerLogoHospital, darkBg: false },
  { name: "한국프랜차이즈산업협회", logo: partnerLogoFranchise, darkBg: false },
  { name: "한국MICE협회", logo: partnerLogoMice, darkBg: false },
  { name: "서비스산업총연합회", logo: partnerServiceIndustry, darkBg: false },
  { name: "SWICT총연합회", logo: partnerSwict, darkBg: false },
];
