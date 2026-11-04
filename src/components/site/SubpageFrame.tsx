import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  FileCheck,
  FileText,
  Flag,
  GraduationCap,
  Handshake,
  History,
  House,
  Info,
  Landmark,
  LayoutGrid,
  Link2,
  List,
  ListChecks,
  Megaphone,
  Newspaper,
  Play,
  Printer,
  Rss,
  Scale,
  ScanSearch,
  Search,
  ShieldCheck,
  Target,
  Trophy,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

import { privacyOffice } from "@/data/kcf";
import {
  FOUNDATION_NAV,
  PRIVACY_NAV,
  childHref,
  isNavHrefCurrent,
  isNavItemActive,
  type SiteNavItem,
} from "@/data/site-nav";
import type { SubpageVisual } from "@/components/site/subpage-visuals";

const LNB_ICONS: Record<string, LucideIcon> = {
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  Download,
  Eye,
  FileCheck,
  FileText,
  Flag,
  GraduationCap,
  Handshake,
  History,
  Info,
  Landmark,
  LayoutGrid,
  List,
  ListChecks,
  Megaphone,
  Newspaper,
  Play,
  Rss,
  Scale,
  ScanSearch,
  Search,
  ShieldCheck,
  Target,
  Trophy,
  UserPlus,
  Users,
};

function NavGlyph({ name, className }: { name?: string; className?: string }) {
  const Icon = name ? LNB_ICONS[name] : undefined;
  if (!Icon) return null;
  return <Icon className={className} aria-hidden="true" strokeWidth={1.75} />;
}

type SubpageFrameProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  badge?: string;
  crumbLabel?: string;
  middleCrumbs?: readonly { label: string; to: string }[];
  showLnb?: boolean;
  area: "foundation" | "privacy";
  visual?: SubpageVisual;
};

function normalizeHash(hash: string) {
  return hash.replace(/^#/, "");
}

function LnbLinks({
  nav,
  pathname,
  hash,
  onNavigate,
}: {
  nav: SiteNavItem[];
  pathname: string;
  hash: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="lnb-list">
      {nav.map((item) => {
        const childCurrent = item.children?.some((child) =>
          isNavHrefCurrent(pathname, hash, childHref(item.to, child)),
        );
        const sectionCurrent = isNavItemActive(pathname, item);
        const selfCurrent = isNavHrefCurrent(pathname, hash, item.to) && !childCurrent;
        const compact = item.label.length >= 10 || Boolean(item.badge && item.label.length >= 8);
        const tight = item.label.length >= 14;
        return (
          <li key={item.to}>
            <a
              href={item.to}
              aria-current={selfCurrent ? "page" : undefined}
              title={item.label}
              onClick={onNavigate}
              className={[
                "lnb-link",
                sectionCurrent ? "is-current" : "",
                compact ? "is-compact" : "",
                tight ? "is-tight" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <NavGlyph name={item.icon} className="lnb-ico" />
              <span className="lnb-label">{item.label}</span>
              {item.badge ? <span className="lnb-badge">{item.badge}</span> : null}
              <ChevronRight className="lnb-chev" aria-hidden="true" />
            </a>
            {item.children?.length ? (
              <ul className="lnb-sublist">
                {item.children.map((child) => {
                  const href = childHref(item.to, child);
                  const current = isNavHrefCurrent(pathname, hash, href);
                  const subCompact = child.label.length >= 12;
                  return (
                    <li key={href}>
                      <a
                        href={href}
                        aria-current={current ? "page" : undefined}
                        title={child.label}
                        onClick={onNavigate}
                        className={["lnb-sub", current ? "is-current" : "", subCompact ? "is-compact" : ""]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {current ? <span className="lnb-dot" aria-hidden="true" /> : null}
                        <span className="lnb-label">{child.label}</span>
                        {child.badge ? <span className="lnb-badge">{child.badge}</span> : null}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function SubpageFrame({
  eyebrow,
  title,
  description,
  badge,
  crumbLabel,
  middleCrumbs,
  showLnb = true,
  area,
  visual,
}: SubpageFrameProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = normalizeHash(useRouterState({ select: (s) => s.location.hash }));
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuRootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const nav = area === "privacy" ? PRIVACY_NAV : FOUNDATION_NAV;
  const currentTop = nav.find((item) => isNavItemActive(pathname, item)) ?? nav[0];
  const crumbTitle = crumbLabel ?? (typeof title === "string" ? title : "현재 페이지");
  const orgLabel = area === "privacy" ? "개인정보보호진흥원" : "한국컨설팅산업재단";

  let currentLeaf = { label: currentTop?.label ?? "", icon: currentTop?.icon };
  for (const item of nav) {
    const child = item.children?.find((entry) => isNavHrefCurrent(pathname, hash, childHref(item.to, entry)));
    if (child) {
      currentLeaf = { label: child.label, icon: child.icon ?? item.icon };
      break;
    }
    if (!item.children?.length && isNavItemActive(pathname, item)) {
      currentLeaf = { label: item.label, icon: item.icon };
      break;
    }
  }

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    }
    function onPointer(event: PointerEvent) {
      if (!menuRootRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  async function copyLink() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function onMenuButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setMenuOpen(true);
      window.requestAnimationFrame(() => {
        menuPanelRef.current?.querySelector("a")?.focus();
      });
    }
  }

  function onMenuPanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const links = [...(menuPanelRef.current?.querySelectorAll("a") ?? [])];
    const index = links.findIndex((link) => link === document.activeElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      links[Math.min(links.length - 1, index + 1)]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (index <= 0) menuButtonRef.current?.focus();
      else links[index - 1]?.focus();
    }
  }

  return (
    <div className="contents">
      <section className={`subvisual bg-[#0B3A6E] text-white${visual ? " has-visual" : ""}`}>
        {visual?.kind === "photo" ? (
          <img src={visual.src} alt="" aria-hidden="true" className="subvisual-photo" />
        ) : null}
        <div className="container-page subvisual-inner">
          <div className={`subvisual-copy${visual?.kind === "photo" ? " is-photo" : ""}`}>
            {eyebrow ? (
              <p className="text-[13px] font-semibold tracking-wide text-[#E8EEF6]">{eyebrow}</p>
            ) : null}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h1 className="text-white">{title}</h1>
              {badge ? (
                <p className="inline-flex items-center rounded-md bg-[#E6F4F2] px-2.5 py-1 text-[13px] font-bold leading-none text-[#0F766E]">
                  {badge}
                </p>
              ) : null}
            </div>
            {description ? (
              <p className="mt-2 max-w-3xl text-[16px] leading-[1.7] text-[#E8EEF6]">{description}</p>
            ) : null}
          </div>
          {visual && visual.kind !== "photo" ? (
            <div className="subvisual-art">
              {visual.kind === "hero" ? (
                <img src={visual.src} alt="" aria-hidden="true" className="subvisual-hero" />
              ) : (
                <span className="subvisual-circle">
                  <img
                    src={visual.src}
                    alt={visual.kind === "mark" ? visual.alt : ""}
                    aria-hidden={visual.kind === "mark" ? undefined : true}
                    className="subvisual-circle-img"
                  />
                </span>
              )}
            </div>
          ) : null}
        </div>
      </section>

      <div className="breadcrumb-bar">
        <div className="container-page breadcrumb-row">
          <nav aria-label="현재 위치">
            <ol className="breadcrumb-list">
              <li>
                <Link to="/" className="breadcrumb-home" aria-label="홈">
                  <House aria-hidden="true" />
                </Link>
              </li>
              {area === "privacy" ? (
                <li className="breadcrumb-part">
                  <ChevronRight aria-hidden="true" />
                  <Link to="/privacy-center">개인정보보호진흥원</Link>
                </li>
              ) : null}
              {middleCrumbs?.map((crumb) => (
                <li key={crumb.to} className="breadcrumb-part">
                  <ChevronRight aria-hidden="true" />
                  <Link to={crumb.to}>{crumb.label}</Link>
                </li>
              ))}
              <li className="breadcrumb-part">
                <ChevronRight aria-hidden="true" />
                <span className="breadcrumb-current">{crumbTitle}</span>
              </li>
            </ol>
          </nav>
          <div className="breadcrumb-tools">
            <button type="button" onClick={() => window.print()} className="subpage-tool" aria-label="인쇄" data-tooltip="인쇄">
              <Printer aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => void copyLink()}
              className="subpage-tool"
              aria-label={copied ? "링크를 복사했습니다" : "링크 복사"}
              data-tooltip={copied ? "복사됨" : "링크 복사"}
            >
              {copied ? <Check aria-hidden="true" /> : <Link2 aria-hidden="true" />}
            </button>
          </div>
        </div>
        {showLnb ? (
          <div className="container-page lnb-mobile" ref={menuRootRef}>
            <button
              ref={menuButtonRef}
              type="button"
              className="lnb-mobile-btn"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((open) => !open)}
              onKeyDown={onMenuButtonKeyDown}
            >
              <NavGlyph name={currentLeaf.icon} className="lnb-ico" />
              <span className="sr-only">현재 메뉴</span>
              <span className="lnb-mobile-label">{currentLeaf.label}</span>
              <ChevronDown className="lnb-chevron" aria-hidden="true" />
            </button>
            <div
              id={menuId}
              ref={menuPanelRef}
              hidden={!menuOpen}
              className="lnb-mobile-panel"
              onKeyDown={onMenuPanelKeyDown}
            >
              <LnbLinks nav={nav} pathname={pathname} hash={hash} onNavigate={() => setMenuOpen(false)} />
            </div>
          </div>
        ) : null}
      </div>

      {showLnb && currentTop ? (
        <aside className="subpage-lnb" aria-label="같은 메뉴">
          <div className="lnb-card">
            <div className="lnb-head">
              <div className="min-w-0">
                <p className="lnb-head-kicker">{orgLabel}</p>
                <p className="lnb-head-title">{currentTop.label}</p>
              </div>
              <NavGlyph name={currentTop.icon} className="lnb-head-icon" />
            </div>
            <LnbLinks nav={nav} pathname={pathname} hash={hash} />
          </div>
          <div className="lnb-help">
            <p className="lnb-help-title">도움이 필요하신가요?</p>
            <a className="lnb-help-tel" href={`tel:${privacyOffice.tel.replace(/-/g, "")}`}>
              {privacyOffice.tel}
            </a>
            <a className="lnb-help-mail" href={`mailto:${privacyOffice.email}`}>
              {privacyOffice.email}
            </a>
            <Link to="/contact" className="lnb-help-btn">
              문의하기
            </Link>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
