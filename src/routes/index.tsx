import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, GraduationCap, Briefcase, Trophy, CheckCircle2, Calendar, Landmark, Sparkles, Phone } from "lucide-react";
import {
  heroBadges,
  coreValues,
  businesses,
  stats,
  historySummary,
  foundation,
} from "@/data/kcf";
import heroHome from "@/assets/hero-home.jpg";
import cardConsulting from "@/assets/card-consulting.jpg";
import cardYouth from "@/assets/card-youth.jpg";
import cardPrivacy from "@/assets/card-privacy.jpg";
import cardNbo from "@/assets/card-nbo.jpg";
import cardValue1 from "@/assets/card-value-1.jpg";
import cardValue2 from "@/assets/card-value-2.jpg";
import cardValue3 from "@/assets/card-value-3.jpg";
import cardValue4 from "@/assets/card-value-4.jpg";
import { CountUp } from "@/components/site/CountUp";
import { KcfLogo } from "@/components/site/KcfLogo";
import { SectionTitle } from "@/components/site/SectionTitle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "한국컨설팅산업재단 | 대한민국 지식서비스산업을 선도하는 재단" },
      {
        name: "description",
        content:
          "재단법인 한국컨설팅산업재단(KCF)은 컨설팅 산업 육성, 기업 경쟁력 강화, 미래 인재 양성을 통해 국가 지식경제 발전에 기여하는 비영리 재단입니다.",
      },
      { property: "og:title", content: "한국컨설팅산업재단 (KCF)" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const businessIcons = {
  privacy: ShieldCheck,
  nbo: Trophy,
  consulting: Briefcase,
  youth: GraduationCap,
} as const;

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-navy-deep">
        <img
          src={heroHome}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-95 motion-safe:animate-hero-home-zoom"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(110deg, rgba(7,21,41,0.7) 0%, rgba(7,21,41,0.5) 45%, rgba(7,21,41,0.2) 100%)",
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="container-page relative grid gap-12 py-24 md:py-36 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <div className="hero-eyebrow">재단 · Knowledge Service Industry</div>
            <h1 className="mt-5 text-white">
              대한민국 지식서비스산업을<br />선도하는 재단
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/82">
              한국컨설팅산업재단은 컨설팅 산업 육성, 기업 경쟁력 강화,
              미래 인재 양성을 통해 국가 지식경제 발전에 기여합니다.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/business" className="btn-hero-light">
                주요 사업 보기 <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/about" className="btn-hero-outline">
                재단 소개
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-2">
              {heroBadges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-[12.5px] font-medium text-white/85 backdrop-blur"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Abstract visual */}
          <HeroVisual />
        </div>
      </section>

      {/* INTRO SUMMARY */}
      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <SectionTitle
              eyebrow="재단 소개"
              title={
                <>
                  컨설팅을 통해<br />지식산업의 성장을 이끕니다
                </>
              }
              desc={
                <>
                  재단법인 한국컨설팅산업재단은 2010년 4월 1일 설립된
                  비영리 재단입니다.
                  민법 제32조 및 관련 비영리법인 설립·감독 규칙에 근거하여
                  설립되었으며, 컨설팅을 통해 선도적 지식산업을 창출하고
                  산업계의 지식고도화 및 지식시장 창출을 촉진하는 것을
                  목적으로 합니다.
                </>
              }
            />
            <div className="mt-8">
              <Link to="/about" className="inline-flex items-center gap-2 font-semibold text-trust-blue transition-colors hover:text-navy">
                재단 소개 자세히 보기 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { k: "설립일", v: foundation.founded, icon: Calendar },
              { k: "기관 성격", v: "비영리 재단", icon: Landmark },
              { k: "주요 분야", v: "컨설팅 · 교육 · 개인정보보호", icon: Sparkles },
              { k: "문의 전화", v: foundation.tel, icon: Phone },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.k} className="kcf-stat-card">
                  <div className="kcf-stat-label">
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    {c.k}
                  </div>
                  <div className="kcf-stat-value">{c.v}</div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* PRIVACY HIGHLIGHT — 별도 중점 사업 섹션 */}
      <section className="relative overflow-hidden bg-navy-deep-bg text-white">
        {/* 배경 이미지 */}
        <img
          src={cardPrivacy}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(4,16,31,0.96) 0%, rgba(4,16,31,0.85) 45%, rgba(15,118,110,0.55) 100%)",
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-10" />

        {/* 상단/하단 강조 라인 */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-accent-teal to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-accent-teal to-transparent" />

        <div className="container-page relative section-y">
          {/* 섹션 헤더 */}
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-privacy-green/30 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-accent-teal ring-1 ring-accent-teal/40">
              ● 중점 사업 · 개인정보보호진흥원
            </div>
            <h2 className="mt-6 max-w-4xl text-white">
              국민 개인정보 안심센터,<br />
              <span className="bg-gradient-to-r from-accent-teal to-accent-sky bg-clip-text text-transparent">
                개인정보보호진흥원
              </span>
            </h2>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/80">
              데이터 경제 시대의 핵심 과제인 개인정보 보호를 위해
              컨설팅·교육·정책연구·포럼 활동을 종합적으로 수행하는
              재단의 핵심 중점 사업입니다.
            </p>
          </div>

          {/* 4가지 핵심 활동 */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "서비스 추천 기준", d: "안전한 개인정보 처리 서비스의 평가·추천 기준 제공" },
              { t: "신고 및 모니터링", d: "개인정보 침해 신고 접수와 상시 모니터링 운영" },
              { t: "정책연구·법제화", d: "개인정보 보호 정책 연구 및 법제화 의제 제안" },
              { t: "포럼·단체 활동", d: "산·학·관 협력 포럼과 전문가 네트워크 운영" },
            ].map((it, i) => (
              <div
                key={it.t}
                className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-[#5EEAD4]/50 hover:bg-white/[0.09]"
              >
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#5EEAD4]/10 blur-2xl transition group-hover:bg-[#5EEAD4]/25" />
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F766E] to-[#5EEAD4] text-white shadow-[0_10px_24px_rgba(15,118,110,0.45)]">
                  <ShieldCheck className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="relative mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5EEAD4]">
                  0{i + 1}
                </div>
                <div className="relative mt-1.5 text-[17px] font-bold text-white">{it.t}</div>
                <p className="relative mt-2 text-[13.5px] leading-relaxed text-white/70">{it.d}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <Link
              to="/privacy-center"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#5EEAD4] to-[#0F766E] px-8 py-4 text-[15px] font-bold text-[#04101F] shadow-[0_18px_40px_rgba(15,118,110,0.5)] transition hover:shadow-[0_22px_50px_rgba(94,234,212,0.55)]"
            >
              개인정보보호진흥원 센터 페이지로 이동
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <div className="text-[12.5px] text-white/55">
              서비스 추천 기준 · 신고 안내 · 정책연구 · 포럼 정보 제공
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="section-y border-y border-border bg-section-bg">
        <div className="container-page">
          <SectionTitle
            eyebrow="핵심 가치"
            title="전문성, 사회적 책임, 혁신, 신뢰를 기반으로 합니다"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((v, i) => {
              const imgs = [cardValue1, cardValue2, cardValue3, cardValue4];
              return (
                <div key={v.title} className="kcf-media-card">
                  <div className="kcf-media" style={{ aspectRatio: "4 / 3" }}>
                    <img src={imgs[i]} alt="" loading="lazy" width={1024} height={768} />
                    <div className="kcf-media-badge">0{i + 1} · {v.en}</div>
                  </div>
                  <div className="kcf-body">
                    <div className="text-card-title">{v.title}</div>
                    <p className="text-[15px] leading-relaxed text-text-secondary">
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* BUSINESSES */}
      <section className="section-y">
        <div className="container-page">
          <SectionTitle
            eyebrow="주요 사업"
            title={
              <>
                기업, 공공기관, 청소년을 연결하는<br />지식서비스 플랫폼
              </>
            }
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {businesses.map((b) => {
              const Icon = businessIcons[b.slug as keyof typeof businessIcons];
              const isHighlight = b.highlight;
              const imageMap: Record<string, string> = {
                privacy: cardPrivacy,
                nbo: cardNbo,
                consulting: cardConsulting,
                youth: cardYouth,
              };
              const linkProps =
                b.slug === "privacy"
                  ? ({ to: "/privacy-center" } as const)
                  : ({ to: "/business" as const, hash: b.slug });
              return (
                <Link
                  key={b.slug}
                  {...linkProps}
                  className={`kcf-media-card group ${
                    isHighlight ? "lg:col-span-2" : ""
                  }`}
                >
                  <div
                    className="kcf-media"
                    style={{ aspectRatio: isHighlight ? "21 / 9" : "16 / 10" }}
                  >
                    <img
                      src={imageMap[b.slug]}
                      alt={b.name}
                      loading="lazy"
                      width={1280}
                      height={896}
                    />
                    {isHighlight && (
                      <div
                        className="kcf-media-badge"
                        style={{ background: "rgba(15,118,110,0.95)", color: "#fff" }}
                      >
                        ● 중점 사업 · WiseON · CSAP 인증
                      </div>
                    )}
                    <div className="kcf-media-icon">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>
                  </div>
                  <div className="kcf-body">
                    <div className="text-card-title">{b.name}</div>
                    {isHighlight && (
                      <div className="text-[13px] font-semibold text-privacy-green">
                        국민 개인정보 안심센터
                      </div>
                    )}
                    <p className="text-[15px] leading-relaxed text-text-secondary">
                      {isHighlight
                        ? "협단체 회원사를 위한 적법 온라인조사서비스 지원사업, WiseON CSAP 인증 온라인 정보 수집 SaaS 안내, 개인정보 안심 조사 마크 부여, 신고 및 모니터링, 정책연구와 포럼 활동을 수행합니다."
                        : b.summary}
                    </p>
                    {isHighlight && (
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {["회원사 지원사업", "WiseON", "CSAP 인증", "안심 조사 마크"].map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center rounded-md bg-[#ECFEFB] px-2 py-1 text-[11.5px] font-semibold text-[#0F766E] ring-1 ring-[#0F766E]/20"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-2 inline-flex items-center gap-1 text-[14px] font-semibold text-trust-blue">
                      {isHighlight ? "개인정보보호진흥원 바로가기" : "자세히 보기"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>


      {/* STATS */}
      <section className="section-y border-y border-border bg-blue-gray">
        <div className="container-page">
          <SectionTitle eyebrow="성과" title="숫자로 보는 KCF의 성과" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="relative overflow-hidden rounded-2xl border border-border bg-white p-7 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)]"
              >
                <div
                  className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full opacity-10"
                  style={{
                    background:
                      i % 2 === 0
                        ? "radial-gradient(circle, #1D4ED8 0%, transparent 70%)"
                        : "radial-gradient(circle, #0F766E 0%, transparent 70%)",
                  }}
                />
                <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-trust-blue">
                  0{i + 1}
                </div>
                <div className="mt-3 text-[36px] font-bold text-navy leading-none tracking-tight">
                  <CountUp value={s.value} />
                </div>
                <div className="mt-3 text-[14px] text-text-secondary">{s.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* HISTORY SUMMARY */}
      <section className="section-y">
        <div className="container-page">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <SectionTitle eyebrow="연혁" title="2010년부터 이어온 발자취" />
            <Link to="/history" className="inline-flex items-center gap-1 font-semibold text-trust-blue">
              전체 연혁 보기 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border md:left-[120px]" />
            <ul className="space-y-6">
              {historySummary.map((h, i) => (
                <li key={i} className="grid grid-cols-[24px_1fr] md:grid-cols-[140px_1fr] items-start gap-4">
                  <div className="relative pt-1.5">
                    <div className="hidden md:block text-[14px] font-semibold text-trust-blue">{h.year}</div>
                    <div className="absolute left-[3px] top-2 h-2 w-2 rounded-full bg-trust-blue md:left-[113px]" />
                  </div>
                  <div className="kcf-card !p-5">
                    <div className="md:hidden text-[12px] font-semibold text-trust-blue mb-1">{h.year}</div>
                    <div className="text-[15.5px] text-text-primary">{h.text}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-y bg-navy text-white">
        <div className="container-page text-center max-w-3xl mx-auto">
          <h2 className="text-white">
            컨설팅·교육·개인정보보호,<br />무엇이든 문의해 주세요
          </h2>
          <p className="mt-5 text-white/80">
            기업, 공공기관, 교육 현장의 어떤 요청이라도 재단의 전문 네트워크가
            성실히 답변드립니다.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="btn-hero-light">
              문의하기
            </Link>
            <a href={`tel:${foundation.tel}`} className="btn-hero-outline">
              {foundation.tel}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function HeroVisual() {
  const pillars = [
    { k: "컨설팅", v: "1,200+" },
    { k: "교육", v: "850+" },
    { k: "개인정보", v: "320+" },
  ];

  return (
    <div className="relative aspect-square w-full max-w-[520px] mx-auto">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-[40px]"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 25%, rgba(94,234,212,0.18) 0%, rgba(7,21,41,0) 60%), radial-gradient(70% 70% at 80% 80%, rgba(29,78,216,0.28) 0%, rgba(7,21,41,0) 65%)",
        }}
      />

      {/* Main glass card */}
      <div
        className="absolute left-4 top-4 right-10 bottom-24 rounded-3xl overflow-hidden border border-white/15 p-6"
        style={{
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 50%, rgba(11,31,58,0.35) 100%)",
          backdropFilter: "blur(18px) saturate(140%)",
          WebkitBackdropFilter: "blur(18px) saturate(140%)",
          boxShadow:
            "0 30px 80px rgba(2, 8, 23, 0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold tracking-[0.18em] text-[#93C5FD] uppercase">
            Knowledge Network
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white/80">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-[#5EEAD4] opacity-70 motion-safe:animate-ping" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-[#5EEAD4]" />
            </span>
            LIVE
          </span>
        </div>

        <div className="mt-2 text-white font-semibold text-[16px] leading-snug tracking-tight">
          컨설팅 · 교육 · 개인정보보호
        </div>

        {/* Constellation */}
        <div className="relative mt-4 h-[170px] rounded-2xl overflow-hidden">
          <svg viewBox="0 0 280 170" className="absolute inset-0 w-full h-full">
            <defs>
              <radialGradient id="bgGrad" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#0B2A55" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#071529" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="lineGrad" x1="0" x2="1">
                <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0" />
                <stop offset="50%" stopColor="#93C5FD" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#5EEAD4" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#93C5FD" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width="280" height="170" fill="url(#bgGrad)" />

            {/* Orbits */}
            <g fill="none" stroke="rgba(147,197,253,0.18)" strokeWidth="0.75">
              <ellipse cx="140" cy="85" rx="58" ry="22" />
              <ellipse cx="140" cy="85" rx="92" ry="36" />
              <ellipse cx="140" cy="85" rx="125" ry="52" />
            </g>

            {/* Connection lines from center to outer nodes */}
            {[
              [48, 58], [232, 56], [60, 122], [225, 124], [140, 28], [140, 148],
              [100, 45], [185, 130],
            ].map(([x, y], i) => (
              <line
                key={i}
                x1="140"
                y1="85"
                x2={x}
                y2={y}
                stroke="url(#lineGrad)"
                strokeWidth="1"
              />
            ))}

            {/* Outer nodes */}
            {[
              [48, 58], [232, 56], [60, 122], [225, 124], [140, 28], [140, 148],
              [100, 45], [185, 130],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="8" fill="url(#nodeGlow)" />
                <circle cx={x} cy={y} r="2.2" fill="#E0F2FE" />
              </g>
            ))}

            {/* Center hub */}
            <g>
              <circle cx="140" cy="85" r="26" fill="url(#nodeGlow)" />
              <circle
                cx="140"
                cy="85"
                r="20"
                fill="#FFFFFF"
                stroke="#5EEAD4"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
              <foreignObject x="120" y="65" width="40" height="40">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
                  <KcfLogo variant="mark" className="!h-8 !w-10 scale-110 origin-left" />
                </div>
              </foreignObject>
            </g>
          </svg>
        </div>

        {/* Pillars */}
        <div className="mt-4 grid grid-cols-3 gap-1.5">
          {pillars.map((p) => (
            <div
              key={p.k}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2 backdrop-blur-sm"
            >
              <div className="text-[10px] tracking-wide text-white/55">{p.k}</div>
              <div className="text-[13px] font-bold text-white leading-tight mt-0.5">
                {p.v}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy badge card */}
      <div
        className="absolute right-2 bottom-2 w-[58%] rounded-3xl p-6 text-white overflow-hidden border border-white/10"
        style={{
          background:
            "linear-gradient(140deg, #0B1F3A 0%, #122A52 60%, #0B1F3A 100%)",
          boxShadow:
            "0 24px 60px rgba(2,8,23,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div
          className="absolute -right-10 -top-10 h-32 w-32 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(94,234,212,0.25) 0%, rgba(94,234,212,0) 70%)",
          }}
        />
        <ShieldCheck className="h-7 w-7 text-[#5EEAD4]" strokeWidth={1.75} />
        <div className="mt-4 text-[12px] tracking-[0.14em] uppercase text-white/60">
          Privacy Protection
        </div>
        <div className="mt-1 text-[17px] font-bold">개인정보보호진흥원</div>
        <div className="mt-4 flex gap-1.5">
          <span className="h-1 w-8 rounded-full bg-[#5EEAD4]" />
          <span className="h-1 w-3 rounded-full bg-white/25" />
          <span className="h-1 w-3 rounded-full bg-white/25" />
        </div>
      </div>
    </div>
  );
}
