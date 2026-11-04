import cardConsulting from "@/assets/card-consulting.jpg";
import cardNbo from "@/assets/card-nbo.jpg";
import cardValue1 from "@/assets/card-value-1.jpg";
import cardYouth from "@/assets/card-youth.jpg";
import heroFreePlatform from "@/assets/illustrations/hero-free-platform.svg";
import heroResearch from "@/assets/illustrations/hero-research.svg";
import heroWebinar from "@/assets/illustrations/hero-webinar.svg";
import illMonitor from "@/assets/illustrations/ill-monitor.svg";
import illOrgAccount from "@/assets/illustrations/ill-org-account.svg";
import illPolicy from "@/assets/illustrations/ill-policy.svg";
import { PRIVACY_CENTER_PAGES } from "@/data/privacy-center";

export type SiteNavChild = {
  label: string;
  to?: string;
  hash?: string;
  description?: string;
  icon?: string;
  badge?: string;
  mark?: boolean;
};

export type SiteNavShortcut = { label: string; to?: string; hash?: string };

export type SiteNavItem = {
  label: string;
  gnbLabel?: string;
  to: string;
  badge?: string;
  description?: string;
  image?: string;
  icon?: string;
  children?: SiteNavChild[];
  cards?: SiteNavChild[];
  shortcuts?: SiteNavShortcut[];
};

export const FOUNDATION_NAV: SiteNavItem[] = [
  {
    label: "재단 소개",
    to: "/about",
    icon: "Landmark",
    image: cardConsulting,
    description:
      "2010년 설립 이후 한국컨설팅산업재단은 컨설팅 산업 육성, 기업 경쟁력 강화, 미래 인재 양성을 통해 국가 지식경제 발전에 기여하고 있습니다.",
    children: [
      { label: "설립목적", hash: "purpose", icon: "Target", description: "컨설팅 산업 육성과 지식경제 발전에 기여하는 설립 목적입니다." },
      { label: "비전 및 미션", hash: "vision", icon: "Eye", description: "비전, 미션, 핵심가치를 안내합니다." },
      { label: "일반현황", hash: "status", icon: "Building2", description: "설립일, 지정번호, 소재지 등 일반 현황입니다." },
    ],
  },
  {
    label: "연혁",
    to: "/history",
    icon: "History",
    image: cardValue1,
    description: "설립 이후 컨설팅·교육·개인정보보호·NBO 사무국 운영 등 다양한 영역에서 축적해 온 재단의 주요 연혁입니다.",
    cards: [
      { label: "2010 설립", hash: "year-2010", icon: "Flag", description: "재단법인 한국컨설팅산업재단 설립" },
      { label: "2011 NBO", hash: "year-2011", icon: "Trophy", description: "전국상업경진대회(NBO) 사무국 운영 참여 개시" },
      { label: "2024", hash: "year-2024", icon: "Handshake", description: "NBO·꿈꾸는사람들 3자 MOU와 해외 대학 설립 참여" },
      { label: "현재", hash: "year-현재", icon: "ShieldCheck", description: "개인정보보호 진흥, 청소년 경영교육, 기업 컨설팅 아카데미 운영" },
    ],
  },
  {
    label: "사업",
    to: "/business",
    icon: "Briefcase",
    image: cardNbo,
    description: "전국상업경진대회(NBO) 사무국 운영, 기업 컨설팅 교육, 청소년 경영교육의 3대 핵심 사업을 운영합니다.",
    children: [
      { label: "전국상업경진대회(NBO) 사무국", hash: "nbo", icon: "Trophy", description: "교육부 주최 전국상업경진대회의 재정 사무국 업무입니다." },
      { label: "기업컨설팅교육", hash: "consulting", icon: "Briefcase", description: "기업 경쟁력을 높이는 컨설팅 교육입니다." },
      { label: "청소년경영교육", hash: "youth", icon: "GraduationCap", description: "청소년 경영·경제 교육과 진로 체험입니다." },
    ],
  },
  {
    label: "실적·자료",
    to: "/achievements",
    icon: "Award",
    image: cardYouth,
    description:
      "2006년부터 현재까지 청소년, 단체, 기업, 지자체, 대학교, 교사·교육공무원을 대상으로 축적해 온 실적입니다.",
    children: [
      { label: "청소년교육 실적", hash: "youth", icon: "GraduationCap", description: "정부정책사업으로 쌓아 온 청소년 교육 실적입니다." },
      { label: "단체교육 실적", hash: "group", icon: "Users", description: "단체 대상 정부정책사업 교육 실적입니다." },
      { label: "기업교육 실적", hash: "corporate", icon: "Briefcase", description: "기업 교육 수행 실적입니다." },
      { label: "지자체·대학교 연계교육", hash: "university", icon: "Building2", description: "지자체와 대학교 연계 교육 실적입니다." },
      { label: "교사/교장/교육청 공무원 연수", hash: "teacher", icon: "BookOpen", description: "교사·교장·교육청 공무원 연수 실적입니다." },
    ],
  },
];

const PRIVACY_MEGA: Record<string, Omit<SiteNavItem, "label" | "to" | "badge">> = {
  "/privacy-center": {
    icon: "Landmark",
    image: heroFreePlatform,
    description: "실태조사부터 교육·보급·감시까지, 개인정보보호진흥원의 네 가지 사업",
    cards: [
      { label: "주요사업", hash: "businesses", icon: "LayoutGrid", description: "개인정보보호진흥원의 네 가지 사업" },
      { label: "성과", hash: "achievements", icon: "Award", description: "국정감사 인용, 안전조치 안내, 협약과 우수기관 선정" },
      { label: "협력 협단체", hash: "partners", icon: "Handshake", description: "진흥원과 함께하는 협단체" },
    ],
  },
  "/privacy-center/research": {
    icon: "Search",
    image: heroResearch,
    description: "공공기관 1,347곳 전수조사 결과와 국정감사 인용, 개선 과제",
    cards: [
      { label: "핵심 결과", hash: "headline", icon: "BarChart3", description: "수집 설문 149건, 모두 보안인증 없는 서비스" },
      { label: "국정감사", hash: "audit", icon: "Landmark", description: "국회 정무위원회 국정감사에서 인용된 조사" },
      { label: "개선 과제", hash: "policy", icon: "ListChecks", description: "조사에서 도출한 개선 과제" },
      { label: "SURE-CHECK 자가진단", to: "/privacy-center/sure-check", icon: "ScanSearch", description: "공개된 신청·설문 화면을 같은 기준으로 살피는 도구" },
    ],
  },
  "/privacy-center/education": {
    icon: "GraduationCap",
    image: heroWebinar,
    description: "강화된 개인정보보호법 대응 웨비나 다시보기와 자료",
    cards: [
      { label: "다시보기", hash: "replay", icon: "Play", description: "웨비나 다시보기" },
      { label: "세션별 보기", hash: "sessions", icon: "List", description: "법률·업무흐름·정보수집·내부협업·시스템DB" },
      { label: "자료 내려받기", hash: "materials", icon: "Download", description: "세션 자료 내려받기" },
    ],
  },
  "/privacy-center/security-services": {
    icon: "ShieldCheck",
    image: illOrgAccount,
    description: "검증된 수집 도구를 보급해 국민의 정보가 들어오는 첫 단계를 지킵니다.",
    children: [
      {
        label: "무상제공 안내·신청",
        to: "/privacy-center/security-services",
        icon: "FileCheck",
        badge: "상시 접수",
        description: "CSAP 인증 온라인조사플랫폼을 공공기관·협단체·국회·언론사에 무상으로 제공합니다.",
      },
      {
        label: "우수기관·SURE MARK",
        to: "/privacy-center/sure-mark",
        mark: true,
        description: "2026 개인정보보호실천 우수기관 7곳과 인증서 진위확인, SURE MARK 자료실",
      },
    ],
    shortcuts: [
      { label: "실천선언", hash: "pledge" },
      { label: "신청 방법", hash: "apply" },
      { label: "CPO 특별 지원", hash: "cpo" },
      { label: "인증 구분 안내", hash: "criteria" },
      { label: "인증서 진위확인", to: "/privacy-center/sure-mark", hash: "verify" },
    ],
  },
  "/privacy-center/rights": {
    gnbLabel: "지키미 모니터링단",
    icon: "Users",
    image: illMonitor,
    description: "국민이 공개된 신청·설문 화면을 함께 살피고, 우려가 있으면 알립니다.",
    cards: [
      { label: "활동 안내", hash: "about", icon: "Info", description: "모니터링단이 하는 일" },
      { label: "사전 신청", hash: "pre-apply", icon: "UserPlus", description: "활동 사전 신청" },
      { label: "활동 원칙", hash: "rules", icon: "Scale", description: "함께 지키는 활동 원칙" },
    ],
  },
  "/privacy-center/publications": {
    icon: "Newspaper",
    image: illPolicy,
    description: "공지사항, 보도자료, 보고서와 관련 보도",
    cards: [
      { label: "공지사항", hash: "notices", icon: "Megaphone", description: "진흥원 공지" },
      { label: "보도자료", hash: "press", icon: "Newspaper", description: "보도자료와 첨부" },
      { label: "보고서·자료", hash: "reports", icon: "FileText", description: "조사 보고서와 자료" },
      { label: "관련 보도", hash: "news", icon: "Rss", description: "관련 보도" },
    ],
  },
};

export const PRIVACY_NAV: SiteNavItem[] = PRIVACY_CENTER_PAGES.map((page) => {
  const extra = PRIVACY_MEGA[page.to];
  return {
    label: page.label,
    to: page.to,
    badge: page.badge,
    gnbLabel: extra?.gnbLabel,
    description: extra?.description,
    image: extra?.image,
    icon: extra?.icon,
    children: extra?.children ?? page.children?.map((child) => ({ label: child.label, to: child.to })),
    cards: extra?.cards,
    shortcuts: extra?.shortcuts,
  };
});

export function childHref(parentTo: string, child: SiteNavChild) {
  const to = child.to ?? parentTo;
  return child.hash ? `${to}#${child.hash}` : to;
}

function pathOf(href: string) {
  return href.split("#")[0];
}

function pathIsCurrent(pathname: string, path: string) {
  if (path === "/privacy-center") return pathname === "/privacy-center" || pathname === "/privacy-center/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function isNavItemActive(pathname: string, item: SiteNavItem) {
  if (pathIsCurrent(pathname, item.to)) return true;
  return (
    item.children?.some((child) => {
      const path = pathOf(childHref(item.to, child));
      return path !== item.to && pathIsCurrent(pathname, path);
    }) ?? false
  );
}

export function lnbForPath(
  pathname: string,
  area: "foundation" | "privacy",
): { label: string; href: string; badge?: string }[] {
  const nav = area === "privacy" ? PRIVACY_NAV : FOUNDATION_NAV;
  const current = nav.find((item) => isNavItemActive(pathname, item));
  if (current?.children?.length) {
    return current.children.map((child) => ({
      label: child.label,
      href: childHref(current.to, child),
      badge: child.badge,
    }));
  }
  return nav.map((item) => ({ label: item.label, href: item.to, badge: item.badge }));
}

export function isNavHrefCurrent(pathname: string, hash: string, href: string) {
  const [path, hrefHash] = href.split("#");
  if (hrefHash) return pathname === path && hash === hrefHash;
  if (path === "/privacy-center") return pathname === "/privacy-center" || pathname === "/privacy-center/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function navCards(item: SiteNavItem) {
  return item.children?.length ? item.children : (item.cards ?? []);
}
