import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp,
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
  Menu,
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
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { KcfLogo } from "@/components/site/KcfLogo";
import kcfMark from "@/assets/kcf-mark.png";
import {
  FOUNDATION_NAV,
  PRIVACY_NAV,
  childHref,
  isNavHrefCurrent,
  isNavItemActive,
  navCards,
  type SiteNavChild,
  type SiteNavItem,
} from "@/data/site-nav";

const ICONS: Record<string, LucideIcon> = {
  ArrowRight,
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

function NavIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = name ? ICONS[name] : undefined;
  if (!Icon) return null;
  return <Icon className={className} aria-hidden="true" />;
}

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });
  const isPrivacy = pathname.startsWith("/privacy-center");
  const menu = isPrivacy ? PRIVACY_NAV : FOUNDATION_NAV;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSite, setMobileSite] = useState<"foundation" | "privacy">(isPrivacy ? "privacy" : "foundation");
  const [openId, setOpenId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tabHidden, setTabHidden] = useState(false);
  const [reduced, setReduced] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef(new Map<string, HTMLAnchorElement>());
  const closeTimer = useRef(0);
  const panelId = useId();

  useEffect(() => {
    setMobileOpen(false);
    setOpenId(null);
    setMobileSite(isPrivacy ? "privacy" : "foundation");
    const current = menu.find((item) => isNavItemActive(pathname, item));
    setExpanded(current && navCards(current).length ? current.to : null);
  }, [pathname, hash, isPrivacy, menu]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const apply = () => {
      document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(header);
    return () => observer.disconnect();
  }, [tabHidden, mobileOpen]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > last && y > 48) setTabHidden(true);
      else if (y < last) setTabHidden(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!openId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      cancelClose();
      setOpenId(null);
      triggerRefs.current.get(openId)?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("[data-dialog-close]")?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  function cancelClose() {
    window.clearTimeout(closeTimer.current);
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      const nav = headerRef.current?.querySelector("[data-gnb]");
      const active = document.activeElement;
      if (nav && active instanceof Node && nav.contains(active)) return;
      setOpenId(null);
    }, 150);
  }

  function closeMega(restore = false) {
    cancelClose();
    const current = openId;
    setOpenId(null);
    if (restore && current) triggerRefs.current.get(current)?.focus();
  }

  function closeMobile() {
    setMobileOpen(false);
    menuButtonRef.current?.focus();
  }

  function trapDialog(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMobile();
      return;
    }
    if (event.key !== "Tab") return;
    const root = dialogRef.current;
    if (!root) return;
    const items = [...root.querySelectorAll<HTMLElement>("a, button")].filter((el) => !el.hasAttribute("disabled"));
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const openItem = menu.find((item) => item.to === openId) ?? null;

  return (
    <header ref={headerRef} className="site-header sticky top-0 z-50 bg-white">
      <div
        className={`site-org-bar relative z-50 h-10 overflow-hidden border-b border-[#E2E8F0] bg-[#F3F5F8] lg:h-11 ${
          tabHidden ? "!h-0 !border-b-0" : ""
        } ${reduced ? "" : "transition-[height] duration-200"}`}
        inert={tabHidden ? true : undefined}
      >
        <div className="h-full">
          <nav className="grid h-full grid-cols-2 lg:hidden" aria-label="기관 선택">
            <OrgTab to="/" current={!isPrivacy} site="foundation" compact>
              한국컨설팅산업재단
            </OrgTab>
            <OrgTab to="/privacy-center" current={isPrivacy} site="privacy" compact badge>
              개인정보보호진흥원
            </OrgTab>
          </nav>
          <div className="mx-auto hidden h-full max-w-[1200px] items-stretch justify-between px-6 lg:flex">
            <nav className="flex" aria-label="기관 선택">
              <OrgTab to="/" current={!isPrivacy} site="foundation">
                한국컨설팅산업재단
              </OrgTab>
              <OrgTab to="/privacy-center" current={isPrivacy} site="privacy" badge>
                개인정보보호진흥원
              </OrgTab>
            </nav>
            <p className="flex items-center text-[13px] text-[#475569]">
              <Link to="/sitemap" className="hover:underline">
                사이트맵
              </Link>
              <span className="px-2" aria-hidden="true">
                |
              </span>
              <Link to="/contact" className="hover:underline">
                문의
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-50 border-b-[3px] border-[var(--site-accent)] bg-white">
        <div className="mx-auto flex h-[60px] max-w-[1200px] items-center gap-3 px-4 lg:h-[76px] lg:gap-9 lg:px-6">
          {isPrivacy ? <PrivacyLogo /> : <FoundationLogo />}
          <nav
            data-gnb=""
            className="relative z-50 ml-auto hidden h-full self-stretch lg:block"
            aria-label={isPrivacy ? "개인정보보호진흥원 메뉴" : "재단 메뉴"}
            onMouseLeave={scheduleClose}
            onBlur={(event) => {
              const next = event.relatedTarget;
              if (next instanceof Node && event.currentTarget.contains(next)) return;
              closeMega();
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closeMega(true);
              }
            }}
          >
            <ul className="flex h-full items-stretch gap-[30px] xl:gap-9">
              {menu.map((item) => {
                const active = isNavItemActive(pathname, item);
                const opened = openId === item.to;
                return (
                  <li
                    key={item.to}
                    className="flex"
                    onMouseEnter={() => {
                      cancelClose();
                      setOpenId(item.to);
                    }}
                  >
                    <Link
                      to={item.to}
                      data-gnb-top=""
                      ref={(node) => {
                        if (node) triggerRefs.current.set(item.to, node);
                        else triggerRefs.current.delete(item.to);
                      }}
                      aria-expanded={opened}
                      aria-controls={opened ? panelId : undefined}
                      onFocus={() => {
                        cancelClose();
                        setOpenId(item.to);
                      }}
                      className={`inline-flex h-full items-center gap-1 whitespace-nowrap text-[16px] font-bold ${
                        active ? "text-[var(--site-accent)] shadow-[inset_0_-3px_0_var(--site-accent)]" : "text-[#1F2937]"
                      }`}
                    >
                      {item.gnbLabel ?? item.label}
                      {opened ? <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                    </Link>
                    {opened ? (
                      <MegaPanel
                        id={panelId}
                        item={item}
                        pathname={pathname}
                        hash={hash}
                        privacy={isPrivacy}
                        onEnter={cancelClose}
                        onLeave={scheduleClose}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>
          <Link
            to={isPrivacy ? "/privacy-center/security-services" : "/contact"}
            hash={isPrivacy ? "apply" : undefined}
            className="relative z-50 hidden shrink-0 items-center gap-1.5 rounded-md bg-[var(--site-accent)] px-[18px] py-3 text-[15px] font-bold text-white lg:inline-flex"
          >
            {isPrivacy ? "무상제공 신청" : "문의하기"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            className="relative z-50 ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#CBD5E1] lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "전체 메뉴 닫기" : "전체 메뉴 열기"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {openItem ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[rgba(15,23,42,0.45)]"
          aria-label="메뉴 닫기"
          onClick={() => closeMega()}
        />
      ) : null}

      {mobileOpen ? (
        <div
          id="mobile-menu"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
          className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden"
          onKeyDown={trapDialog}
        >
          <div className="flex h-14 items-center justify-between border-b border-[#E2E8F0] px-4">
            <h2 id="mobile-menu-title" className="text-[16px] font-bold text-[#0B3A6E]">
              전체 메뉴
            </h2>
            <button
              type="button"
              data-dialog-close=""
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#CBD5E1]"
              aria-label="전체 메뉴 닫기"
              onClick={closeMobile}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="px-4 pt-4">
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-[#F3F5F8] p-1">
              <button
                type="button"
                className={`h-10 rounded-md text-[13px] font-bold ${mobileSite === "foundation" ? "bg-[#0B3A6E] text-white" : "text-[#475569]"}`}
                aria-pressed={mobileSite === "foundation"}
                onClick={() => setMobileSite("foundation")}
              >
                한국컨설팅산업재단
              </button>
              <button
                type="button"
                className={`h-10 rounded-md text-[13px] font-bold ${mobileSite === "privacy" ? "bg-[#0F766E] text-white" : "text-[#475569]"}`}
                aria-pressed={mobileSite === "privacy"}
                onClick={() => setMobileSite("privacy")}
              >
                개인정보보호진흥원
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
            <MobileList
              items={mobileSite === "privacy" ? PRIVACY_NAV : FOUNDATION_NAV}
              pathname={pathname}
              hash={hash}
              privacy={mobileSite === "privacy"}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          </div>
          <div className="border-t border-[#E2E8F0] px-4 py-4">
            <Link
              to={mobileSite === "privacy" ? "/privacy-center/security-services" : "/contact"}
              hash={mobileSite === "privacy" ? "apply" : undefined}
              className={`flex h-12 items-center justify-center gap-1.5 rounded-md text-[15px] font-bold text-white ${mobileSite === "privacy" ? "bg-[#0F766E]" : "bg-[#0B3A6E]"}`}
            >
              {mobileSite === "privacy" ? "무상제공 신청" : "문의하기"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="mt-3 text-center text-[13px] text-[#475569]">02-501-2906 · cs@kcf-korea.org</p>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function FoundationLogo() {
  return (
    <Link to="/" className="shrink-0" aria-label="한국컨설팅산업재단 홈">
      <KcfLogo variant="header" className="!h-8 !max-w-none lg:!h-11" />
    </Link>
  );
}

function PrivacyLogo() {
  return (
    <Link
      to="/privacy-center"
      className="flex shrink-0 items-center gap-2"
      aria-label="개인정보보호진흥원 한국컨설팅산업재단 부설 홈"
    >
      <img src={kcfMark} alt="" className="h-[26px] w-auto lg:h-[34px]" />
      <span className="hidden h-8 w-px bg-[#CBD5E1] lg:block" aria-hidden="true" />
      <span className="leading-tight">
        <span className="whitespace-nowrap text-[16px] font-extrabold leading-tight text-[#0B3A6E] lg:text-[20px]">
          개인정보보호진흥원
        </span>
        <br />
        <span className="whitespace-nowrap text-[11px] leading-tight text-[#64748B] lg:text-[12px]">
          한국컨설팅산업재단 부설
        </span>
      </span>
    </Link>
  );
}

function OrgTab({
  to,
  current,
  site,
  badge,
  compact,
  children,
}: {
  to: "/" | "/privacy-center";
  current: boolean;
  site: "foundation" | "privacy";
  badge?: boolean;
  compact?: boolean;
  children: string;
}) {
  const activeClass = site === "privacy" ? "bg-[#0F766E] text-white" : "bg-[#0B3A6E] text-white";
  const hoverClass = site === "privacy" ? "hover:text-[#0F766E]" : "hover:text-[#0B3A6E]";
  return (
    <Link
      to={to}
      aria-current={current ? "true" : undefined}
      className={`inline-flex h-full min-w-0 items-center justify-center whitespace-nowrap font-bold ${
        compact ? "gap-1 px-1.5 text-[13px]" : "gap-1.5 px-5 text-[14px]"
      } ${current ? activeClass : `text-[#475569] ${hoverClass}`}`}
    >
      {site === "privacy" ? (
        <ShieldCheck className={`shrink-0 ${compact ? "h-4 w-4" : "h-[18px] w-[18px]"}`} aria-hidden="true" />
      ) : (
        <Landmark className={`shrink-0 ${compact ? "h-4 w-4" : "h-[18px] w-[18px]"}`} aria-hidden="true" />
      )}
      <span>{children}</span>
      {badge ? (
        <span
          className={`shrink-0 rounded-[10px] px-1.5 py-0.5 text-[11px] font-bold leading-none ${
            current ? "bg-white text-[#0F766E]" : "bg-[#0F766E] text-white"
          }`}
        >
          무상제공
        </span>
      ) : null}
    </Link>
  );
}

function MegaPanel({
  id,
  item,
  pathname,
  hash,
  privacy,
  onEnter,
  onLeave,
}: {
  id: string;
  item: SiteNavItem;
  pathname: string;
  hash: string;
  privacy: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const cards = navCards(item);
  const hoverBg = privacy ? "hover:bg-[#F0FAF8]" : "hover:bg-[#EEF3F9]";
  return (
    <div
      id={id}
      className="fixed inset-x-0 z-50 border-b border-[#E2E8F0] bg-white shadow-[0_16px_32px_rgba(15,23,42,0.12)]"
      style={{ top: "var(--header-height)" }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 pb-9 pt-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-lg bg-[#F6F1E7] p-5">
          {item.image ? (
            <img src={item.image} alt="" className="w-full rounded-md object-contain" />
          ) : null}
          <p className="mt-4 text-[20px] font-extrabold text-[#0B3A6E]">
            {item.label}
            {item.badge ? <MenuBadge>{item.badge}</MenuBadge> : null}
          </p>
          {item.description ? <p className="mt-2 text-[14px] leading-relaxed text-[#374151]">{item.description}</p> : null}
          <Link to={item.to} className="mt-4 inline-flex text-[14px] font-bold text-[var(--site-accent)]">
            전체 보기 →
          </Link>
        </div>
        <div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {cards.map((card) => (
              <li key={`${item.to}-${card.label}`}>
                <MegaCard card={card} parentTo={item.to} pathname={pathname} hash={hash} hoverBg={hoverBg} />
              </li>
            ))}
          </ul>
          {item.shortcuts?.length ? (
            <div className="mt-5 border-t border-[#E2E8F0] pt-4">
              <p className="text-[13px] text-[#64748B]">바로가기</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {item.shortcuts.map((shortcut) => (
                  <li key={shortcut.label}>
                    <Link
                      to={shortcut.to ?? item.to}
                      hash={shortcut.hash}
                      className="inline-flex rounded-[20px] border border-[#CBD5E1] px-3.5 py-2 text-[14px] font-bold text-[#0B3A6E]"
                    >
                      {shortcut.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function MegaCard({
  card,
  parentTo,
  pathname,
  hash,
  hoverBg,
}: {
  card: SiteNavChild;
  parentTo: string;
  pathname: string;
  hash: string;
  hoverBg: string;
}) {
  const href = childHref(parentTo, card);
  const current = isNavHrefCurrent(pathname, hash, href);
  return (
    <Link
      to={card.to ?? parentTo}
      hash={card.hash}
      className={`flex h-full gap-3 rounded-lg border p-[22px] ${hoverBg} hover:border-[var(--site-accent)] ${
        current ? "border-[var(--site-accent)]" : "border-[#E2E8F0]"
      }`}
    >
      {card.mark ? (
        <img
          src={`${import.meta.env.BASE_URL}downloads/sure-mark.png`}
          alt="SURE MARK"
          className="h-[52px] w-[52px] shrink-0 object-contain"
        />
      ) : (
        <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-lg bg-[var(--site-accent)] text-white">
          <NavIcon name={card.icon} className="h-[26px] w-[26px]" />
        </span>
      )}
      <span>
        <span className="inline-flex flex-wrap items-center text-[17px] font-extrabold text-[#111827]">
          {card.label}
          {card.badge ? <MenuBadge>{card.badge}</MenuBadge> : null}
        </span>
        {card.description ? <span className="mt-1 block text-[14px] leading-relaxed text-[#475569]">{card.description}</span> : null}
      </span>
    </Link>
  );
}

function MenuBadge({ children }: { children: string }) {
  return (
    <span className="ml-2 inline-flex rounded-[10px] bg-[#0F766E] px-1.5 py-0.5 text-[11px] font-bold leading-none text-white">
      {children}
    </span>
  );
}

function MobileList({
  items,
  pathname,
  hash,
  privacy,
  expanded,
  setExpanded,
}: {
  items: SiteNavItem[];
  pathname: string;
  hash: string;
  privacy: boolean;
  expanded: string | null;
  setExpanded: (value: string | null) => void;
}) {
  const tint = privacy ? "bg-[#E6F4F2] text-[#0F766E]" : "bg-[#E8EEF6] text-[#0B3A6E]";
  const currentBg = privacy ? "bg-[#E6F4F2]" : "bg-[#E8EEF6]";
  return (
    <ul>
      {items.map((item) => {
        const cards = navCards(item);
        const active = isNavItemActive(pathname, item);
        const open = expanded === item.to;
        return (
          <li key={item.to} className="border-b border-[#E2E8F0]">
            {cards.length ? (
              <>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 py-3 text-left"
                  aria-expanded={open}
                  onClick={() => setExpanded(open ? null : item.to)}
                >
                  <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${tint}`}>
                    <NavIcon name={item.icon} className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-[16px] font-bold text-[#111827]">{item.label}</span>
                  <ChevronDown className={`h-4 w-4 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
                {open ? (
                  <ul className="pb-2">
                    {cards.map((card) => {
                      const href = childHref(item.to, card);
                      const current = isNavHrefCurrent(pathname, hash, href);
                      return (
                        <li key={`${item.to}-${card.label}`}>
                          <Link
                            to={card.to ?? item.to}
                            hash={card.hash}
                            className={`block py-2 pl-[52px] text-[15px] font-bold text-[#0B3A6E] ${current ? currentBg : ""}`}
                          >
                            {card.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </>
            ) : (
              <Link to={item.to} className="flex items-center gap-3 py-3">
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${tint}`}>
                  <NavIcon name={item.icon} className="h-4 w-4" />
                </span>
                <span className={`text-[16px] font-bold ${active ? "text-[var(--site-accent)]" : "text-[#111827]"}`}>{item.label}</span>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
