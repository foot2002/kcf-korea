import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

import { KcfLogo } from "@/components/site/KcfLogo";

type NavChild = { label: string; hash?: string; to?: string };
type NavItem = { label: string; to: string; children?: NavChild[] };

const NAV: NavItem[] = [
  {
    label: "소개",
    to: "/about",
    children: [
      { label: "설립목적", hash: "purpose" },
      { label: "비전 및 미션", hash: "vision" },
      { label: "일반현황", hash: "status" },
      { label: "일반현황", hash: "status" },
    ],
  },
  { label: "연혁", to: "/history" },
  {
    label: "개인정보보호진흥원",
    to: "/privacy-center",
  },
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
  {
    label: "찾아오시는 길",
    to: "/contact",
    children: [
      { label: "오시는 길", hash: "directions" },
      { label: "연락처", hash: "info" },
    ],
  },
];

function navLinkClass(isActive: boolean) {
  return [
    "relative flex items-center gap-1 rounded-lg px-3.5 py-2 text-[15px] font-medium transition-colors",
    isActive
      ? "text-trust-blue"
      : "text-text-primary hover:text-trust-blue",
  ].join(" ");
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
        className="container-page flex items-center justify-between"
        style={{ height: "var(--header-height)" }}
      >
        <Link to="/" className="group flex shrink-0 items-center">
          <KcfLogo
            variant="header"
            className="transition-transform group-hover:scale-[1.01]"
          />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((item) => {
            const isActive =
              pathname === item.to ||
              (item.to !== "/" && pathname.startsWith(item.to));
            return (
              <div key={item.to} className="group relative">
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
                  <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="min-w-[240px] rounded-xl border border-border bg-white p-2 shadow-[0_16px_40px_rgba(15,23,42,0.1)]">
                      {item.children.map((c) => (
                        <Link
                          key={c.label}
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
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="btn-primary-kcf hidden !px-5 !py-2.5 text-[14px] md:inline-flex"
          >
            문의하기
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border transition-colors hover:bg-blue-gray lg:hidden"
            aria-label="메뉴 열기"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-white lg:hidden">
          <div className="container-page space-y-1 py-4">
            {NAV.map((item) => (
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
                        key={c.label}
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
            <Link to="/contact" className="btn-primary-kcf mt-3 w-full">
              문의하기
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
