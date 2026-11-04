import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  GraduationCap,
  Landmark,
  Phone,
  ShieldCheck,
  Trophy,
} from "lucide-react";

import { HomeBoard } from "@/components/privacy/home/HomeBoard";
import { HomeIcon } from "@/components/privacy/home/icons";
import { HomePartners } from "@/components/privacy/home/HomePartners";
import { HomeSlider } from "@/components/privacy/home/HomeSlider";
import { CountUp } from "@/components/site/CountUp";
import { SectionTitle } from "@/components/site/SectionTitle";
import { SitePathLink } from "@/components/site/SitePathLink";
import { useStats } from "@/lib/content/load";
import {
  FOUNDATION_PRIVACY_BANNER,
  FOUNDATION_PRIVACY_RIBBON,
  FOUNDATION_PUBLIC_BAND,
  FOUNDATION_SLIDES,
  businesses,
  coreValues,
  foundation,
  heroBadges,
  historySummary,
} from "@/data/kcf";
import cardConsulting from "@/assets/card-consulting.jpg";
import cardNbo from "@/assets/card-nbo.jpg";
import cardYouth from "@/assets/card-youth.jpg";
import cardValue1 from "@/assets/card-value-1.jpg";
import cardValue2 from "@/assets/card-value-2.jpg";
import cardValue3 from "@/assets/card-value-3.jpg";
import cardValue4 from "@/assets/card-value-4.jpg";

const valueImages = [cardValue1, cardValue2, cardValue3, cardValue4];

const businessIcons = {
  privacy: ShieldCheck,
  nbo: Trophy,
  consulting: Briefcase,
  youth: GraduationCap,
} as const;

const privacyActivities = [
  { t: "서비스 추천 기준", d: "안전한 개인정보 처리 서비스의 평가·추천 기준 제공" },
  { t: "신고 및 모니터링", d: "개인정보 침해 신고 접수와 상시 모니터링 운영" },
  { t: "정책연구·법제화", d: "개인정보 보호 정책 연구 및 법제화 의제 제안" },
  { t: "포럼·단체 활동", d: "산·학·관 협력 포럼과 전문가 네트워크 운영" },
];

const introFacts = [
  { k: "설립일", v: foundation.founded, icon: Calendar },
  { k: "기관 성격", v: "비영리 재단", icon: Landmark },
  { k: "주요 분야", v: "컨설팅 · 교육 · 개인정보보호", icon: ShieldCheck },
  { k: "문의 전화", v: foundation.tel, icon: Phone },
];

const heroShortcuts = [
  { slug: "consulting", photo: cardConsulting },
  { slug: "youth", photo: cardYouth },
  { slug: "nbo", photo: cardNbo },
  { slug: "privacy", photo: "" },
] as const;

function FoundationHeroShortcuts() {
  return (
    <nav className="border-b border-[#E2E8F0] bg-white" aria-label="주요 사업 바로가기">
      <ul className="container-page grid grid-cols-1 gap-3 py-4 md:grid-cols-4">
        {heroShortcuts.map((item) => {
          const business = businesses.find((entry) => entry.slug === item.slug);
          if (!business) return null;
          const privacy = item.slug === "privacy";
          return (
            <li key={item.slug}>
              <SitePathLink
                to={privacy ? "/privacy-center" : "/business"}
                hash={privacy ? undefined : item.slug}
                className={`flex h-full items-start gap-3 rounded-[8px] bg-white p-3 ${privacy ? "border-2 border-[#0F766E]" : "border border-[#E2E8F0]"}`}
              >
                {item.photo ? (
                  <img src={item.photo} alt="" className="h-16 w-16 shrink-0 rounded-[6px] object-cover" />
                ) : (
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[6px] bg-[#E6F4F2]">
                    <ShieldCheck className="h-7 w-7 text-[#0F766E]" aria-hidden="true" />
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block text-[16px] font-bold leading-snug text-[#0B3A6E]">{business.name}</span>
                  <span className="mt-1 block text-[13px] leading-snug text-[#475569]">{business.summary}</span>
                  {privacy ? (
                    <span className="mt-1 block text-[13px] font-bold leading-snug text-[#0F766E]">
                      {FOUNDATION_PRIVACY_BANNER.lines[1]}
                    </span>
                  ) : null}
                </span>
              </SitePathLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function FoundationHome() {
  const stats = useStats();
  return (
    <>
      <HomeSlider slides={FOUNDATION_SLIDES} variant="foundation" />
      <FoundationHeroShortcuts />

      <section className="border-b border-[#D1D5DB] bg-white">
        <div className="container-page py-12 md:py-16">
          <SectionTitle
            eyebrow="주요 사업"
            title={
              <>
                기업, 공공기관, 청소년을 연결하는
                <br />
                지식서비스 플랫폼
              </>
            }
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {businesses.map((item) => {
              const Icon = businessIcons[item.slug as keyof typeof businessIcons];
              const highlight = item.highlight;
              return (
                <SitePathLink
                  key={item.slug}
                  to={highlight ? "/privacy-center" : "/business"}
                  hash={highlight ? undefined : item.slug}
                  className={`relative flex h-full flex-col rounded-md border bg-white p-5 ${
                    highlight ? "border-[#0F766E]" : "border-[#D1D5DB]"
                  }`}
                >
                  {highlight ? (
                    <span className="absolute right-3 top-3 rounded-md bg-[#E6F4F2] px-2 py-1 text-[12px] font-bold text-[#0F766E]">
                      {FOUNDATION_PRIVACY_RIBBON}
                    </span>
                  ) : null}
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#0B3A6E] text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 pr-16 text-[18px] font-bold text-navy">{item.name}</h3>
                  {highlight ? (
                    <p className="mt-1 text-[13px] font-semibold text-[#0F766E]">국민 개인정보 안심센터</p>
                  ) : null}
                  <p className="mt-3 text-[15px] leading-relaxed text-[#374151]">
                    {highlight
                      ? "협단체 회원사를 위한 적법 온라인조사서비스 지원사업, WiseON CSAP 인증 온라인 정보 수집 SaaS 안내, 개인정보 안심 조사 마크 부여, 신고 및 모니터링, 정책연구와 포럼 활동을 수행합니다."
                      : item.summary}
                  </p>
                  {highlight ? (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {["회원사 지원사업", "WiseON", "CSAP 인증", "안심 조사 마크"].map((chip) => (
                        <li
                          key={chip}
                          className="rounded-md border border-[#0F766E]/30 bg-[#E6F4F2] px-2 py-1 text-[12px] font-semibold text-[#0F766E]"
                        >
                          {chip}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <span className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold text-navy">
                    {highlight ? "개인정보보호진흥원 바로가기" : "자세히 보기"}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </SitePathLink>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-[#D1D5DB] bg-[#F3F4F6]" aria-label="성과">
        <div className="container-page py-12 md:py-16">
          <SectionTitle eyebrow="성과" title="숫자로 보는 KCF의 성과" />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <li key={item.label} className="rounded-md border border-[#D1D5DB] bg-white px-5 py-5">
                <p className="text-[32px] font-bold leading-none tracking-tight text-navy">
                  <CountUp value={item.value} />
                </p>
                <p className="mt-3 text-[14px] text-[#374151]">{item.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-[#D1D5DB] bg-white">
        <div className="container-page grid min-w-0 gap-8 py-12 md:py-16 lg:grid-cols-2 [&>*]:min-w-0">
          <HomeBoard />
          <aside className="flex min-w-0 flex-col justify-between rounded-md border border-[#0F766E] bg-[#E6F4F2] p-6">
            <div>
              <p className="text-[13px] font-bold text-[#0F766E]">부설 기관</p>
              <h2 className="mt-2 text-navy">{FOUNDATION_PRIVACY_BANNER.title}</h2>
              <ul className="mt-4 space-y-2">
                {FOUNDATION_PRIVACY_BANNER.lines.map((line) => (
                  <li key={line} className="text-[16px] font-semibold text-[#111827]">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <SitePathLink to={FOUNDATION_PRIVACY_BANNER.primary.to} className="btn-primary-kcf">
                {FOUNDATION_PRIVACY_BANNER.primary.label}
              </SitePathLink>
              <SitePathLink
                to={FOUNDATION_PRIVACY_BANNER.secondary.to}
                hash={FOUNDATION_PRIVACY_BANNER.secondary.hash}
                className="btn-secondary-kcf"
              >
                {FOUNDATION_PRIVACY_BANNER.secondary.label}
              </SitePathLink>
            </div>
          </aside>
        </div>
      </section>

      <HomePartners />

      <section className="border-t border-[#D1D5DB] bg-white">
        <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-2">
          <div>
            <SectionTitle
              eyebrow="재단 소개"
              title={
                <>
                  컨설팅을 통해
                  <br />
                  지식산업의 성장을 이끕니다
                </>
              }
              desc={
                <>
                  재단법인 한국컨설팅산업재단은 2010년 4월 1일 설립된 비영리 재단입니다. 민법 제32조 및 관련
                  비영리법인 설립·감독 규칙에 근거하여 설립되었으며, 컨설팅을 통해 선도적 지식산업을 창출하고
                  산업계의 지식고도화 및 지식시장 창출을 촉진하는 것을 목적으로 합니다.
                </>
              }
            />
            <Link to="/about" className="mt-6 inline-flex items-center gap-2 font-semibold text-navy">
              재단 소개 자세히 보기 <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <ul className="mt-6 flex flex-wrap gap-2">
              {heroBadges.map((badge) => (
                <li key={badge} className="rounded-md border border-[#D1D5DB] px-3 py-1.5 text-[13px] font-semibold text-[#374151]">
                  {badge}
                </li>
              ))}
            </ul>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {introFacts.map((fact) => {
              const Icon = fact.icon;
              return (
                <li key={fact.k} className="rounded-md border border-[#D1D5DB] bg-white p-4">
                  <p className="flex items-center gap-2 text-[13px] font-semibold text-[#4B5563]">
                    <Icon className="h-4 w-4 text-navy" aria-hidden="true" />
                    {fact.k}
                  </p>
                  <p className="mt-2 text-[18px] font-bold text-navy">{fact.v}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="border-t border-[#D1D5DB] bg-[#0B3A6E] text-white">
        <div className="container-page py-12 md:py-16">
          <div className="max-w-3xl">
            <p className="text-[13px] font-bold text-[#E6F4F2]">중점 사업 · 개인정보보호진흥원</p>
            <h2 className="mt-3 text-white">
              국민 개인정보 안심센터,
              <br />
              개인정보보호진흥원
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-white">
              데이터 경제 시대의 핵심 과제인 개인정보 보호를 위해 컨설팅·교육·정책연구·포럼 활동을 종합적으로
              수행하는 재단의 대표 중점 사업입니다.
            </p>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {privacyActivities.map((item, index) => (
              <li key={item.t} className="rounded-md border border-white p-5">
                <HomeIcon name="ShieldCheck" className="h-5 w-5 text-white" />
                <p className="mt-4 text-[13px] font-bold text-[#E6F4F2]">0{index + 1}</p>
                <h3 className="mt-1 text-[17px] font-bold text-white">{item.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white">{item.d}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Link to="/privacy-center" className="btn-hero-light">
              개인정보보호진흥원 센터 페이지로 이동
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="mt-3 text-[13px] text-white">서비스 추천 기준 · 신고 안내 · 정책연구 · 포럼 정보 제공</p>
          </div>
        </div>
      </section>

      <section className="border-t border-[#D1D5DB] bg-[#F3F4F6]">
        <div className="container-page py-12 md:py-16">
          <SectionTitle eyebrow="핵심 가치" title="전문성, 공익성, 혁신, 신뢰를 기반으로 합니다" />
          <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, index) => (
              <li key={value.title} className="overflow-hidden rounded-md border border-[#D1D5DB] bg-white">
                <img src={valueImages[index]} alt="" className="aspect-[4/3] w-full object-cover" />
                <div className="p-4">
                  <p className="text-[12px] font-bold text-[#0F766E]">
                    0{index + 1} · {value.en}
                  </p>
                  <h3 className="mt-1 text-[18px] font-bold text-navy">{value.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#374151]">{value.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-[#D1D5DB] bg-white">
        <div className="container-page py-12 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle eyebrow="연혁" title="2010년부터 이어온 발자취" />
            <Link to="/history" className="inline-flex items-center gap-1 font-semibold text-navy">
              전체 연혁 보기 <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ol className="mt-8 border-l border-[#D1D5DB]">
            {historySummary.map((item, index) => (
              <li key={`${item.year}-${index}`} className="grid gap-2 py-3 pl-5 md:grid-cols-[8rem_1fr] md:pl-6">
                <p className="text-[15px] font-bold text-navy">{item.year}</p>
                <p className="rounded-md border border-[#D1D5DB] px-4 py-3 text-[15px] text-[#111827]">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-[#D1D5DB] bg-[#0B3A6E] text-white">
        <div className="container-page max-w-3xl py-12 text-center md:py-16">
          <h2 className="text-white">
            컨설팅·교육·개인정보보호,
            <br />
            무엇이든 문의해 주세요
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-white">
            기업, 공공기관, 교육 현장의 어떤 요청이라도 재단의 전문 네트워크가 성실히 답변드립니다.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-hero-light">
              문의하기
            </Link>
            <a href={`tel:${foundation.tel}`} className="btn-hero-outline">
              {foundation.tel}
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-[#D1D5DB] bg-[#E8EEF6]">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-8">
          <p className="text-[16px] font-bold leading-relaxed text-navy">{FOUNDATION_PUBLIC_BAND}</p>
          <Link to="/contact" className="btn-primary-kcf">
            문의하기
          </Link>
        </div>
      </section>
    </>
  );
}
