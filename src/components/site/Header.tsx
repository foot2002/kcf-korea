import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, ShieldCheck } from "lucide-react";

import { KcfLogo } from "@/components/site/KcfLogo";
import { PRIVACY_CENTER_PAGES } from "@/data/privacy-center";

type NavChild = { label: string; hash?: string; to?: string };
type NavItem = { label: string; to: string; children?: NavChild[] };

const FOUNDATION_NAV: NavItem[] = [
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

const PRIVACY_CENTER_NAV = {
  label: "개인정보보호진흥원",
  to: "/privacy-center",
  children: [
    ...PRIVACY_CENTER_PAGES.map((p) => ({ label: p.label, to: p.to })),
  ],
} as const;

function navLinkClass(isActive: boolean) {
  return [
    "relative flex items-center gap-1 rounded-lg px-3.5 py-2 text-[15px] font-medium transition-colors",
    isActive ? "text-trust-blue" : "text-text-primary hover:text-trust-blue",
  ].join(" ");
}

function isNavItemActive(pathname: string, to: string) {
  return pathname === to || (to !== "/" && pathname.startsWith(to));
}

function NavDropdown({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const isActive = isNavItemActive(pathname, item.to);

  return (
    <div className="group relative">
      <Link
        to={item.to}
        className={navLinkClass(isActive)}
        activeProps={{ className: navLinkClass(true) }}
      >
        {item.label}
        {item.children && (
          <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:rotate-180" />
        )}
        {isActive && (
          <span className="absolute inset-x-3.5 -bottom-[1px] h-0.5 rounded-full bg-trust-blue" />
        )}
      </Link>
      {item.children && (
        <div className="invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
          <div className="min-w-[240px] rounded-xl border border-border bg-white p-2 shadow-[0_16px_40px_rgba(15,23,42,0.1)]">
            {item.children.map((c) => (
              <Link
                key={`${c.label}-${c.hash ?? c.to ?? ""}`}
                to={c.to ?? item.to}
                hash={c.to ? undefined : c.hash}
                className="block rounded-lg px-3 py-2.5 text-[14px] text-text-secondary transition-colors hover:bg-blue-gray hover:text-navy"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PrivacyCenterNav({ pathname }: { pathname: string }) {
  const isActive = pathname.startsWith("/privacy-center");

  return (
    <div className="group relative">
      <Link
        to={PRIVACY_CENTER_NAV.to}
        className={[
          "relative inline-flex min-h-[48px] items-center gap-3 rounded-xl px-4 py-2.5 transition-colors",
          isActive
            ? "bg-[#071529] text-white shadow-[0_4px_16px_rgba(7,21,41,0.28)] ring-1 ring-[#071529]/20"
            : "bg-[#0B2540] text-white hover:bg-[#071529]",
        ].join(" ")}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
          <ShieldCheck className="h-5 w-5 text-white" strokeWidth={1.75} />
        </span>
        <span className="whitespace-nowrap text-[15px] font-semibold leading-tight tracking-[-0.01em]">
          {PRIVACY_CENTER_NAV.label}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-white/70 transition-transform group-hover:rotate-180" />
      </Link>
      <div className="invisible absolute right-0 top-full z-50 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
        <div className="min-w-[280px] overflow-hidden rounded-xl border border-[#1D4ED8]/20 bg-white shadow-[0_20px_48px_rgba(15,23,42,0.14)]">
          <div className="border-b border-[#E5E7EB] bg-gradient-to-r from-[#EFF6FF] to-[#F0FDFA] px-4 py-3.5">
            <div className="text-[15px] font-bold text-navy">{PRIVACY_CENTER_NAV.label}</div>
          </div>
          <div className="p-2">
            {PRIVACY_CENTER_NAV.children.map((c) => (
              <Link
                key={`${c.label}-${c.hash ?? c.to}`}
                to={c.to}
                hash={"hash" in c ? c.hash : undefined}
                className="block rounded-lg px-3 py-2.5 text-[14px] font-medium text-text-secondary transition-colors hover:bg-blue-gray hover:text-navy"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-[0_4px_20px_rgba(11,31,58,0.07)]" : ""
      }`}
      style={{ background: "rgba(255,255,255,0.94)" }}
    >
      <div
        className="container-page flex items-center justify-between gap-4"
        style={{ height: "var(--header-height)" }}
      >
        <Link to="/" className="group flex shrink-0 items-center">
          <KcfLogo
            variant="header"
            className="transition-transform group-hover:scale-[1.01]"
          />
        </Link>

        <div className="hidden flex-1 items-center justify-between gap-6 lg:flex">
          <nav className="flex items-center gap-0.5">
            {FOUNDATION_NAV.map((item) => (
              <NavDropdown key={item.to} item={item} pathname={pathname} />
            ))}
          </nav>

          <div className="ml-4 shrink-0 border-l border-border pl-5">
            <PrivacyCenterNav pathname={pathname} />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to={PRIVACY_CENTER_NAV.to}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0B2540] px-3.5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#071529]"
          >
            <ShieldCheck className="h-4 w-4 text-white" strokeWidth={1.75} />
            개인정보보호진흥원
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border transition-colors hover:bg-blue-gray"
            aria-label="메뉴 열기"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-white lg:hidden">
          <div className="container-page space-y-1 py-4">
            <div className="mb-4 rounded-xl border border-[#E5E7EB] bg-[#0B2540] p-4 text-white">
              <Link
                to={PRIVACY_CENTER_NAV.to}
                className="flex items-center gap-3"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <ShieldCheck className="h-5 w-5 text-white" strokeWidth={1.75} />
                </span>
                <span className="text-[16px] font-semibold leading-tight">
                  개인정보보호진흥원
                </span>
              </Link>
              <div className="mt-3 space-y-1 border-t border-white/15 pt-3">
                {PRIVACY_CENTER_NAV.children.map((c) => (
                  <Link
                    key={`mobile-${c.label}-${c.hash ?? c.to}`}
                    to={c.to}
                    hash={"hash" in c ? c.hash : undefined}
                    className="block py-1.5 text-[14px] font-medium text-white/90"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            {FOUNDATION_NAV.map((item) => (
              <div key={item.to} className="py-1">
                <Link
                  to={item.to}
                  className="block py-2 text-[15px] font-semibold text-navy"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 border-l border-border pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={`${c.label}-${c.hash ?? c.to ?? ""}`}
                        to={c.to ?? item.to}
                        hash={c.to ? undefined : c.hash}
                        className="block py-1.5 text-[14px] text-text-secondary"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
