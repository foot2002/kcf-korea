import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import { KcfLogo } from "@/components/site/KcfLogo";
import { FOUNDATION_NAV, PRIVACY_NAV, isNavItemActive, type SiteNavItem } from "@/data/site-nav";

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPrivacy = pathname.startsWith("/privacy-center");
  const menu = isPrivacy ? PRIVACY_NAV : FOUNDATION_NAV;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [megaOpen, setMegaOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const skipOpenRef = useRef(false);
  const megaId = useId();
  const hasSubmenu = menu.some((item) => item.children?.length);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setOpenGroup(null);
  }, [pathname]);

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
  }, []);

  function openMega() {
    if (skipOpenRef.current || !hasSubmenu) return;
    setMegaOpen(true);
  }

  function closeMega(restoreFocus = false) {
    setMegaOpen(false);
    if (!restoreFocus) return;
    skipOpenRef.current = true;
    navRef.current?.querySelector<HTMLElement>("[data-gnb-top]")?.focus();
    queueMicrotask(() => {
      skipOpenRef.current = false;
    });
  }

  return (
    <header ref={headerRef} className="site-header sticky top-0 z-50 border-b border-[#D1D5DB] bg-white">
      <div className="h-9 overflow-x-auto border-b border-[#D1D5DB] bg-[#F3F4F6]">
        <div className="container-page flex h-9 min-w-max items-center justify-between gap-4 text-[13px] text-[#374151]">
          <div className="flex items-center gap-2">
            <Link to="/" className={!isPrivacy ? "font-bold text-navy" : "hover:text-navy hover:underline"}>
              재단 홈
            </Link>
            <span aria-hidden="true">|</span>
            <Link
              to="/privacy-center"
              className={isPrivacy ? "font-bold text-navy" : "hover:text-navy hover:underline"}
            >
              개인정보보호진흥원
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/sitemap" className="hover:text-navy hover:underline">
              사이트맵
            </Link>
            <span aria-hidden="true">|</span>
            <Link to="/contact" className="hover:text-navy hover:underline">
              문의
            </Link>
            <span aria-hidden="true">|</span>
            <Link to="/privacy-policy" className="font-bold text-[#0F766E] hover:underline">
              개인정보처리방침
            </Link>
          </div>
        </div>
      </div>

      <div className="container-page flex items-start justify-between gap-3 py-3">
        <Link
          to={isPrivacy ? "/privacy-center" : "/"}
          className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3"
        >
          <KcfLogo variant="header" className="h-9 w-auto shrink-0 sm:h-10" />
          <span className="leading-snug [word-break:keep-all]">
            <span className="block text-[14px] font-bold text-navy sm:text-[15px]">
              공익법인 (재)한국컨설팅산업재단
            </span>
            {isPrivacy ? (
              <span className="mt-0.5 block text-[13px] font-bold text-[#0F766E]">
                (부설) 개인정보보호진흥원
              </span>
            ) : null}
          </span>
        </Link>
        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#D1D5DB] lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">{mobileOpen ? "메뉴 닫기" : "메뉴 열기"}</span>
        </button>
      </div>

      <nav
        ref={navRef}
        className="relative hidden border-t border-[#E5E7EB] lg:block"
        aria-label={isPrivacy ? "개인정보보호진흥원 메뉴" : "재단 메뉴"}
        onMouseEnter={openMega}
        onMouseLeave={() => closeMega()}
        onFocus={openMega}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeMega();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeMega(true);
          }
        }}
      >
        <ul className="container-page flex flex-nowrap items-center">
          {menu.map((item) => {
            const active = isNavItemActive(pathname, item);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  data-gnb-top=""
                  aria-expanded={hasSubmenu ? megaOpen : undefined}
                  aria-controls={hasSubmenu ? megaId : undefined}
                  onFocus={openMega}
                  className={
                    active
                      ? "inline-flex h-11 items-center whitespace-nowrap border-b-2 border-navy px-2 text-[14px] font-bold text-navy"
                      : "inline-flex h-11 items-center whitespace-nowrap border-b-2 border-transparent px-2 text-[14px] font-medium text-[#374151] hover:text-navy"
                  }
                >
                  {item.label}
                  {item.badge ? <NavBadge>{item.badge}</NavBadge> : null}
                </Link>
              </li>
            );
          })}
        </ul>
        {hasSubmenu && megaOpen ? <MegaPanel id={megaId} items={menu} /> : null}
      </nav>

      {mobileOpen ? (
        <div id="mobile-menu" className="border-t border-[#D1D5DB] bg-white lg:hidden">
          <div className="container-page py-2">
            <MobileAccordion
              label="재단"
              items={FOUNDATION_NAV}
              openGroup={openGroup}
              setOpenGroup={setOpenGroup}
            />
            <MobileAccordion
              label="개인정보보호진흥원"
              items={PRIVACY_NAV}
              openGroup={openGroup}
              setOpenGroup={setOpenGroup}
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}

function MegaPanel({ id, items }: { id: string; items: SiteNavItem[] }) {
  return (
    <div id={id} className="absolute inset-x-0 top-full z-40 border-b border-[#D1D5DB] bg-white">
      <div className="container-page grid gap-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.to}>
            <Link to={item.to} className="inline-flex items-center text-[15px] font-bold text-navy hover:underline">
              {item.label}
              {item.badge ? <NavBadge>{item.badge}</NavBadge> : null}
            </Link>
            {item.children?.length ? (
              <ul className="mt-2 space-y-1">
                {item.children.map((child) => (
                  <li key={`${item.to}-${child.label}`}>
                    <Link
                      to={child.to ?? item.to}
                      hash={child.hash}
                      className="block py-1 text-[14px] leading-[1.7] text-[#374151] hover:text-navy hover:underline"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileAccordion({
  label,
  items,
  openGroup,
  setOpenGroup,
}: {
  label: string;
  items: SiteNavItem[];
  openGroup: string | null;
  setOpenGroup: (value: string | null) => void;
}) {
  return (
    <section className="border-b border-[#E5E7EB] py-2">
      <h2 className="px-1 py-2 text-[13px] font-bold text-[#6B7280]">{label}</h2>
      <ul>
        {items.map((item) => {
          const key = `${label}-${item.to}`;
          const expanded = openGroup === key;
          return (
            <li key={key} className="border-t border-[#F3F4F6]">
              {item.children?.length ? (
                <>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-1 py-3 text-left text-[16px] font-bold text-navy"
                    aria-expanded={expanded}
                    onClick={() => setOpenGroup(expanded ? null : key)}
                  >
                    <span className="inline-flex items-center">
                      {item.label}
                      {item.badge ? <NavBadge>{item.badge}</NavBadge> : null}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition ${expanded ? "rotate-180" : ""}`} />
                  </button>
                  {expanded ? (
                    <ul className="pb-2 pl-3">
                      {item.children.some((child) => child.to) ? null : (
                        <li>
                          <Link to={item.to} className="block py-2 text-[15px] text-[#374151]">
                            {item.label} 개요
                          </Link>
                        </li>
                      )}
                      {item.children.map((child) => (
                        <li key={`${item.to}-${child.label}`}>
                          <Link
                            to={child.to ?? item.to}
                            hash={child.hash}
                            className="block py-2 text-[15px] text-[#374151]"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </>
              ) : (
                <Link to={item.to} className="flex items-center px-1 py-3 text-[16px] font-bold text-navy">
                  {item.label}
                  {item.badge ? <NavBadge>{item.badge}</NavBadge> : null}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function NavBadge({ children }: { children: string }) {
  return (
    <span className="ml-1.5 inline-flex shrink-0 items-center rounded-sm bg-[#E6F4F2] px-1.5 py-0.5 text-[11px] font-bold leading-none text-[#0F766E]">
      {children}
    </span>
  );
}
