import { PRIVACY_CENTER_PAGES } from "@/data/privacy-center";

export type SiteNavChild = { label: string; to?: string; hash?: string };
export type SiteNavItem = {
  label: string;
  to: string;
  badge?: string;
  children?: SiteNavChild[];
};

export const FOUNDATION_NAV: SiteNavItem[] = [
  {
    label: "소개",
    to: "/about",
    children: [
      { label: "설립목적", hash: "purpose" },
      { label: "비전 및 미션", hash: "vision" },
      { label: "일반현황", hash: "status" },
    ],
  },
  { label: "연혁", to: "/history" },
  {
    label: "사업",
    to: "/business",
    children: [
      { label: "전국상업경진대회(NBO) 사무국", hash: "nbo" },
      { label: "기업컨설팅교육", hash: "consulting" },
      { label: "청소년경영교육", hash: "youth" },
    ],
  },
  {
    label: "실적/자료",
    to: "/achievements",
    children: [
      { label: "청소년교육 실적", hash: "youth" },
      { label: "단체교육 실적", hash: "group" },
      { label: "기업교육 실적", hash: "corporate" },
      { label: "지자체·대학교 연계교육", hash: "university" },
      { label: "교사/교장/교육청 공무원 연수", hash: "teacher" },
    ],
  },
  { label: "Contact Us", to: "/contact" },
];

export const PRIVACY_NAV: SiteNavItem[] = PRIVACY_CENTER_PAGES.map((page) => ({
  label: page.label,
  to: page.to,
  badge: page.badge,
  children: page.children?.map((child) => ({ label: child.label, to: child.to })),
}));

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
