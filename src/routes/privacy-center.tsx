import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Shield,
  ShieldCheck,
  Lock,
  FileCheck,
  Search,
  AlertTriangle,
  Scale,
  Users,
  Megaphone,
  BookOpen,
  Building2,
  ClipboardCheck,
  Network,
  CheckCircle2,
  ArrowRight,
  Phone,
  Info,
  Download,
  Cloud,
  BadgeCheck,
  Award,
  Database,
  FileSearch,
  Sparkles,
} from "lucide-react";
import heroPrivacy from "@/assets/hero-privacy.jpg";
import sureLogo from "@site-image/sure_logo.png";
import sureMark from "@site-image/sure_mark.png";
import sureDetail from "@site-image/sure_detail.png";
import partnerServiceIndustry from "@site-image/logo_서비스산업총연합회.gif";
import partnerSwict from "@site-image/logo_swict총연합회.gif";
import { PrivacyInquiryForm } from "@/components/privacy/PrivacyInquiryForm";
import { privacyOffice } from "@/data/kcf";
import {
  memberSupportPartners,
  searchMemberSupportPartners,
  formatSupportFlag,
  type MemberSupportPartner,
} from "@/data/member-support-partners";


export const Route = createFileRoute("/privacy-center")({
  head: () => ({
    meta: [
      { title: "개인정보보호진흥원 | 한국컨설팅산업재단" },
      {
        name: "description",
        content:
          "한국컨설팅산업재단 개인정보보호진흥원은 국민의 개인정보를 지키기 위해 개인정보보호 서비스 추천, 신고 및 모니터링, 정책연구, 법제화 제안, 포럼 및 단체 활동을 수행합니다.",
      },
      { property: "og:title", content: "개인정보보호진흥원 | 한국컨설팅산업재단" },
      {
        property: "og:description",
        content:
          "국민의 개인정보를 지키는 공익 플랫폼 — 서비스 추천 기준, 신고 안내, 정책연구, 포럼 운영.",
      },
      { property: "og:url", content: "/privacy-center" },
    ],
    links: [{ rel: "canonical", href: "/privacy-center" }],
  }),
  component: PrivacyCenterPage,
});

function PrivacyCenterPage() {
  return (
    <>
      <PrivacyHero />
      <PartnerLogosStrip />
      <SafeSurveyMarkDetail />
      <WiseOnTrustBanner />
      <TrustCardsThree />
      <PrivacyMissionSection />
      <PrivacyBusinessPillars />
      <PrivacySelfCheck />
      <PrivacyLawChangeSection />
      <IncidentTypeSection />
      <PrivacyFAQ />
      <PrivacyResources />
      <PrivacyContactCTA />
    </>
  );
}

/* ---------- Section 1. Hero ---------- */
function PrivacyHero() {
  return (
    <section className="relative overflow-hidden bg-[#02141A] text-white">
      <img
        src={heroPrivacy}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-105 object-cover opacity-90 motion-safe:animate-hero-privacy-zoom"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(2,20,26,0.65) 0%, rgba(7,21,41,0.5) 50%, rgba(15,118,110,0.3) 100%)",
        }}
      />
      <div className="absolute inset-0 opacity-15 grid-bg" />
      <div className="relative container-page py-20 md:py-28 grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div>
          <img
            src={sureLogo}
            alt="SURE — 개인정보보호 안심마크 Secure User Response Environment Mark"
            className="h-[120px] w-auto max-w-[min(100%,720px)] rounded-xl bg-white px-5 py-4 object-contain object-left shadow-[0_8px_28px_rgba(2,20,26,0.35)] sm:h-[140px] md:h-[160px] lg:h-[180px]"
            width={720}
            height={180}
          />
          <div className="mt-4 text-[14px] font-medium text-white/70">국민 개인정보 안심센터</div>
          <h1 className="mt-3 text-white">
            국민의 개인정보를<br />지키는 공익 플랫폼
          </h1>
          <p className="mt-7 max-w-xl text-[17px] leading-[1.8] text-white/80">
            한국컨설팅산업재단 개인정보보호진흥원은 개인정보보호 서비스 추천,
            신고 및 모니터링, 정책연구, 법제화 제안, 포럼 및 단체 활동을 통해
            안전한 데이터 사회를 만들어갑니다.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#pillars" className="btn-hero-light !px-5 !py-3 text-[14px]">
              서비스 추천 기준 보기 <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#report" className="btn-hero-outline !px-5 !py-3 text-[14px]">
              개인정보 침해 신고 안내
            </a>
            <a href="#research" className="btn-hero-outline !px-5 !py-3 text-[14px]">
              정책연구·포럼 보기
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {[
              "공익재단 기반 개인정보보호 진흥사업",
              "개인정보보호 컨설팅·교육·정책연구",
              "국민 권리 보호 중심",
              "기업·공공기관·개인 대상 지원",
            ].map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-[12.5px] font-medium text-white/85 backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <HeroShieldVisual />
      </div>
    </section>
  );
}

function HeroShieldVisual() {
  const nodes = [
    { label: "국민", x: "12%", y: "20%" },
    { label: "기업", x: "85%", y: "18%" },
    { label: "공공기관", x: "8%", y: "72%" },
    { label: "법제도", x: "88%", y: "75%" },
    { label: "데이터", x: "50%", y: "8%" },
    { label: "포럼", x: "50%", y: "92%" },
  ];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[540px]">
      {/* Outer ring */}
      <div className="absolute inset-6 rounded-full border border-white/15" />
      <div className="absolute inset-16 rounded-full border border-white/10" />
      {/* Nodes */}
      {nodes.map((n) => (
        <div
          key={n.label}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/8 border border-white/25 px-3 py-1.5 text-[12px] font-semibold text-white backdrop-blur"
          style={{ left: n.x, top: n.y }}
        >
          {n.label}
        </div>
      ))}
      {/* Central shield */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-44 w-44 rounded-[44px] bg-gradient-to-br from-trust-blue to-privacy-green shadow-[0_30px_60px_rgba(13,148,136,0.35)] flex items-center justify-center">
          <Shield className="h-20 w-20 text-white" strokeWidth={1.5} />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#5EEAD4] px-3 py-1 text-[11px] font-bold text-navy">
            PROTECT
          </div>
        </div>
      </div>
      {/* Dashboard card */}
      <div className="absolute -right-2 bottom-6 hidden sm:block w-[58%] rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#5EEAD4]">
            Monitoring
          </div>
          <div className="h-2 w-2 rounded-full bg-[#5EEAD4] animate-pulse" />
        </div>
        <div className="mt-3 space-y-1.5">
          {[70, 45, 88].map((w, i) => (
            <div key={i} className="h-1.5 w-full rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#5EEAD4] to-trust-blue"
                style={{ width: `${w}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Section 1B. Partner Logos Strip ---------- */
function PartnerLogosStrip() {
  const partners = [
    {
      name: "서비스산업총연합회",
      logo: partnerServiceIndustry,
    },
    {
      name: "SWICT총연합회",
      logo: partnerSwict,
    },
  ] as const;

  return (
    <section className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
      <div className="container-page py-10 md:py-12">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.16em] text-trust-blue ring-1 ring-[#E5E7EB]">
            <Users className="h-3.5 w-3.5" />
            개인정보보호진흥원 협력 협단체
          </div>
          <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-text-secondary">
            협력 협단체와 함께 회원사의 안전한 온라인 조사·접수 환경을 지원합니다.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5 md:gap-8">
          {partners.map((p) => (
            <div
              key={p.name}
              title={p.name}
              aria-label={`${p.name} 로고`}
              className="flex h-24 w-[min(100%,280px)] flex-col items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-6 py-4 transition hover:border-trust-blue hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] sm:h-28 sm:w-[300px]"
            >
              <img
                src={p.logo}
                alt={p.name}
                className="max-h-14 w-full object-contain sm:max-h-16"
              />
              <span className="mt-2 text-[12px] font-semibold text-navy">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 1C. WiseON Trust Banner + Search ---------- */
function MemberSupportResultCard({ partner }: { partner: MemberSupportPartner }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 text-[14px] text-white/90">
      <div className="text-[16px] font-bold text-white">{partner.name}</div>
      <ul className="mt-3 space-y-1.5 text-[13.5px] text-white/75">
        <li>회원사 여부: {formatSupportFlag(partner.member)}</li>
        <li>무료 지원 대상: {formatSupportFlag(partner.free, "대상", "비대상")}</li>
        <li>할인 적용: {formatSupportFlag(partner.discount, "적용", "미적용")}</li>
        <li>신청 가능 여부: {formatSupportFlag(partner.available, "가능", "문의 필요")}</li>
      </ul>
      <div className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[#5EEAD4]">
        지원 안내 보기 <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}

function WiseOnTrustBanner() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<MemberSupportPartner[]>([]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResults(searchMemberSupportPartners(query));
    setSearched(true);
  };

  return (
    <section id="wiseon-detail" className="relative overflow-hidden bg-gradient-to-br from-[#04101F] via-[#071529] to-[#0B2540] text-white scroll-mt-24">
      <div className="absolute inset-0 grid-bg opacity-[0.07]" />
      <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#1D4ED8]/20 blur-3xl" />
      <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#0F766E]/25 blur-3xl" />

      <div className="container-page relative section-y">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-stretch">
          {/* LEFT: Message */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#5EEAD4]/10 px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#5EEAD4] ring-1 ring-[#5EEAD4]/30">
              <Sparkles className="h-3.5 w-3.5" />
              협단체 회원사 지원사업 안내
            </div>
            <h2 className="mt-5 text-white">
              협단체 적법 온라인조사서비스<br />지원사업 안내
            </h2>
            <p className="mt-5 text-[16px] font-semibold text-[#93C5FD]">
              회원사를 위한 정부인증 온라인조사 서비스 지원
            </p>
            <p className="mt-4 max-w-xl text-[15.5px] leading-[1.85] text-white/80">
              개인정보보호진흥원은 협력 협단체와 함께 회원사의 개인정보보호법
              대응을 지원하며, <strong className="text-white">WiseON</strong> 기반의
              안전한 온라인 정보 수집 환경 구축을 돕습니다.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {[
                "정부인증 온라인조사 서비스",
                "WiseON",
                "CSAP 인증 온라인 정보 수집 SaaS",
                "회원사 무료·할인 적용",
                "개인정보 안심 조사 마크 부여",
              ].map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full border border-white/20 bg-white/[0.06] px-3 py-1.5 text-[12.5px] font-semibold text-white/90 backdrop-blur"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT: WiseON Highlight Block */}
          <WiseOnHighlightBlock />
        </div>

        {/* SEARCH AREA */}
        <div id="member-search" className="mt-12 rounded-3xl border border-white/15 bg-white/[0.05] p-6 md:p-8 backdrop-blur scroll-mt-24">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#1D4ED8]/30 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#93C5FD]">
                Member Support Search
              </div>
              <h3 className="mt-3 text-[22px] font-bold text-white">
                회원사 무료 및 할인 적용 검색
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/70">
                소속 협회·단체명 또는 기관명을 입력하면 지원 대상 여부와 적용 혜택을
                확인할 수 있습니다.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="소속 협회·단체명 또는 기관명을 입력하세요"
                className="h-12 w-full rounded-full border border-white/20 bg-white/[0.08] pl-11 pr-4 text-[14.5px] text-white placeholder:text-white/45 outline-none focus:border-[#5EEAD4]/60 focus:bg-white/[0.12]"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5EEAD4] to-[#0F766E] px-6 text-[14.5px] font-bold text-[#04101F] shadow-[0_10px_30px_rgba(15,118,110,0.45)] transition hover:shadow-[0_14px_36px_rgba(94,234,212,0.55)]"
            >
              무료 및 할인 적용 검색하기
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Search results */}
          {searched && (
            <div className="mt-6">
              {results.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/25 bg-white/[0.03] px-6 py-8 text-center text-[14px] text-white/70">
                  검색 결과가 없습니다. 협력 협단체 명단을 확인하거나
                  개인정보보호진흥원으로 문의해 주세요.
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {results.map((r) => (
                    <MemberSupportResultCard key={r.id} partner={r} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Registered partners table */}
          <div className="mt-8">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#93C5FD]">
                  Partner List
                </div>
                <h4 className="mt-1 text-[17px] font-bold text-white">
                  협력 협단체 명단
                </h4>
              </div>
              <p className="text-[13px] text-white/60">
                등록 {memberSupportPartners.length}개 기관
              </p>
            </div>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-white/15 bg-white/[0.04]">
              <table className="w-full min-w-[640px] text-left text-[13.5px]">
                <thead>
                  <tr className="border-b border-white/15 bg-white/[0.06] text-[12px] uppercase tracking-wider text-[#93C5FD]">
                    <th className="px-5 py-3.5 font-bold">기관명</th>
                    <th className="px-4 py-3.5 font-bold">회원사</th>
                    <th className="px-4 py-3.5 font-bold">무료 지원</th>
                    <th className="px-4 py-3.5 font-bold">할인 적용</th>
                    <th className="px-4 py-3.5 font-bold">신청 가능</th>
                  </tr>
                </thead>
                <tbody>
                  {memberSupportPartners.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-white/10 last:border-0 text-white/90"
                    >
                      <td className="px-5 py-4 font-semibold text-white">{p.name}</td>
                      <td className="px-4 py-4">{formatSupportFlag(p.member)}</td>
                      <td className="px-4 py-4">
                        {formatSupportFlag(p.free, "대상", "비대상")}
                      </td>
                      <td className="px-4 py-4">
                        {formatSupportFlag(p.discount, "적용", "미적용")}
                      </td>
                      <td className="px-4 py-4">
                        {formatSupportFlag(p.available, "가능", "문의 필요")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WiseOnHighlightBlock() {
  return (
    <div className="relative h-full overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-7 backdrop-blur">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#5EEAD4]/15 blur-2xl" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F766E] to-[#5EEAD4] text-white shadow-lg">
            <Cloud className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#5EEAD4]">
              정부인증 온라인조사 서비스
            </div>
            <div className="text-[22px] font-extrabold text-white leading-tight">
              WiseON
            </div>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md border border-[#5EEAD4]/40 bg-[#0F766E]/20 px-2 py-1 text-[10px] font-bold tracking-[0.14em] text-[#5EEAD4]">
          <BadgeCheck className="h-3 w-3" />
          CSAP CERTIFIED
        </span>
      </div>

      <div className="relative mt-4 text-[14px] font-semibold text-white/90">
        CSAP 인증 온라인 정보 수집 SaaS
      </div>
      <p className="relative mt-2 text-[13.5px] leading-[1.8] text-white/75">
        WiseON은 온라인 설문조사, 행사 신청, 교육 접수, 고객만족도 조사, 내부 직원
        조사 등 다양한 온라인 정보 수집 업무를 보다 안전하고 체계적으로 운영할 수
        있도록 지원하는 온라인 정보 수집 SaaS입니다.
      </p>

      <ul className="relative mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {[
          { i: BadgeCheck, t: "CSAP 인증" },
          { i: Cloud, t: "온라인 정보 수집 SaaS" },
          { i: Shield, t: "국내 데이터 보안 기준 대응" },
          { i: Lock, t: "접근권한 및 로그 관리" },
          { i: FileCheck, t: "개인정보보호 대응형 운영" },
          { i: Award, t: "개인정보 안심 조사 마크 부여 대상" },
        ].map(({ i: Icon, t }) => (
          <li
            key={t}
            className="flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2 text-[12.5px] text-white/85"
          >
            <Icon className="h-3.5 w-3.5 shrink-0 text-[#5EEAD4]" />
            {t}
          </li>
        ))}
      </ul>

      <div className="relative mt-6 flex flex-wrap gap-2">
        <a
          href="https://www.wiseon.io"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[12.5px] font-bold text-[#04101F] hover:bg-soft-sky"
        >
          WiseON 서비스 안내 보기 <ArrowRight className="h-3.5 w-3.5" />
        </a>
        <a
          href="#member-search"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-4 py-2 text-[12.5px] font-bold text-white hover:bg-white/10"
        >
          회원사 지원 대상 검색하기
        </a>
      </div>
    </div>
  );
}

/* ---------- Section 1D. Trust Cards x3 ---------- */
function TrustCardsThree() {
  return (
    <section className="bg-white border-b border-[#E5E7EB]">
      <div className="container-page section-y">
        <div className="grid gap-5 md:grid-cols-3">
          {/* Card 1 */}
          <div className="group relative flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-7 transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.10)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#0B2540] text-white">
              <Users className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <div className="mt-5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-trust-blue">
              01 · Member Support
            </div>
            <div className="mt-1.5 text-[20px] font-bold text-navy leading-snug">
              협단체 회원사 지원
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
              협력 협단체 소속 회원사는 적법 온라인조사서비스 지원사업을 통해
              무료 또는 할인 적용 혜택을 확인할 수 있습니다.
            </p>
            <ul className="mt-4 space-y-1.5 text-[13.5px] text-text-secondary">
              {[
                "회원사 대상 지원",
                "무료 적용 여부 확인",
                "할인 적용 여부 확인",
                "협단체별 지원사업 확인",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-trust-blue" />
                  {t}
                </li>
              ))}
            </ul>
            <a
              href="#member-search"
              className="mt-6 inline-flex items-center gap-1 text-[13.5px] font-semibold text-trust-blue"
            >
              회원사 지원 검색 <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Card 2 - Government Certified WiseON */}
          <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#0F766E]/30 bg-gradient-to-br from-[#04101F] to-[#0B2540] p-7 text-white transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,118,110,0.35)]">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#5EEAD4]/15 blur-2xl" />
            <div className="relative flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F766E] to-[#5EEAD4] text-white">
                <Cloud className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <span className="rounded-md border border-[#5EEAD4]/40 bg-[#0F766E]/20 px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-[#5EEAD4]">
                CSAP CERTIFIED
              </span>
            </div>
            <div className="relative mt-5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#5EEAD4]">
              02 · Gov-Certified Online Survey
            </div>
            <div className="relative mt-1.5 text-[20px] font-bold text-white leading-snug">
              정부인증 온라인조사 서비스
            </div>
            <div className="relative mt-1 text-[13px] font-semibold text-[#93C5FD]">
              WiseON · CSAP 인증 온라인 정보 수집 SaaS
            </div>
            <p className="relative mt-3 text-[14px] leading-relaxed text-white/80">
              개인정보보호진흥원은 정부·공공 보안인증 기준에 기반한 안전한 온라인
              정보 수집 환경을 지원합니다. WiseON은 CSAP 인증을 기반으로
              온라인 조사·접수·정보 수집 업무를 안전하게 운영할 수 있도록 지원하는
              SaaS입니다.
            </p>
            <ul className="relative mt-4 grid grid-cols-2 gap-1.5 text-[12.5px] text-white/85">
              {[
                "CSAP 인증",
                "온라인 정보 수집 SaaS",
                "접근권한 관리",
                "로그 기록 관리",
                "개인정보보호 대응형 운영",
                "협단체 회원사 지원 연계",
              ].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 shrink-0 text-[#5EEAD4]" />
                  {t}
                </li>
              ))}
            </ul>
            <a
              href="https://www.wiseon.io"
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-6 inline-flex items-center gap-1 text-[13.5px] font-bold text-[#5EEAD4]"
            >
              WiseON 안내 보기 <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Card 3 - Privacy Safe Survey Mark */}
          <div className="group relative flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-7 transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.10)]">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-privacy-green to-[#0F766E] text-white">
                <Award className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <SafeSurveyBadge size={68} />
            </div>
            <div className="mt-5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-privacy-green">
              03 · SURE Mark
            </div>
            <div className="mt-1.5 text-[20px] font-bold text-navy leading-snug">
              개인정보보호 SURE 안심마크
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
              <strong className="text-navy">WiseON을 사용하는 기관과 기업은</strong>{" "}
              개인정보보호진흥원이 제시하는 안전한 조사 운영 기준에 따라
              ‘개인정보 안심 조사 마크’를 부여받을 수 있습니다.
            </p>
            <ul className="mt-4 space-y-1.5 text-[13.5px] text-text-secondary">
              {[
                "WiseON 사용 기관/기업 대상",
                "안전한 온라인 조사 운영 상징",
                "개인정보 최소수집",
                "접근권한 및 로그관리",
                "파기 및 보호조치 기준 반영",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-privacy-green" />
                  {t}
                </li>
              ))}
            </ul>
            <a
              href="#safe-mark-detail"
              className="mt-6 inline-flex items-center gap-1 text-[13.5px] font-semibold text-privacy-green"
            >
              안심 조사 마크 안내 <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- SURE Mark — official certification badge ---------- */
function SafeSurveyBadge({
  size = 160,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={sureMark}
      alt="개인정보보호 SURE 안심마크"
      width={size}
      height={size}
      className={`object-contain ${className}`.trim()}
      style={{ width: size, height: size }}
    />
  );
}

/* ---------- Section 1E. Safe Survey Mark Detail ---------- */
function SafeSurveyMarkDetail() {
  return (
    <section
      id="safe-mark-detail"
      className="relative overflow-hidden bg-[#F5F8FC] border-y border-[#E5E7EB] scroll-mt-24"
    >
      <div className="container-page section-y">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          {/* SURE mark (large) + CSAP 안내 */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-accent-teal/35 via-trust-blue/20 to-privacy-green/25 blur-3xl" />
              <div className="flex h-[320px] w-[320px] items-center justify-center rounded-full bg-white p-10 shadow-[0_24px_60px_rgba(11,31,58,0.12)] ring-1 ring-border sm:h-[360px] sm:w-[360px] sm:p-12">
                <img
                  src={sureMark}
                  alt="개인정보보호 SURE 안심마크"
                  className="h-[240px] w-[240px] object-contain sm:h-[280px] sm:w-[280px]"
                />
              </div>
            </div>
            <div className="relative mt-10 w-full max-w-lg">
              <img
                src={sureDetail}
                alt="개인정보보호 SURE 안심마크 — CSAP 인증 온라인 조사 솔루션 적용 안내"
                className="w-full rounded-2xl bg-white p-4 shadow-[0_16px_40px_rgba(11,31,58,0.08)] ring-1 ring-border object-contain"
              />
            </div>
            <div className="mt-8 rounded-full border border-[#0F766E]/30 bg-white px-4 py-2 text-[12.5px] font-bold text-[#0F766E]">
              WiseON 사용 기관/기업 부여 SURE 마크
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="label-eyebrow mb-4">SURE Mark</div>
            <h2 className="text-navy">개인정보보호 SURE 안심마크란?</h2>
            <p className="mt-5 text-[15.5px] leading-[1.85] text-text-secondary">
              SURE(Secure User Response Environment) 안심마크는 개인정보보호진흥원이{" "}
              <strong className="text-navy">WiseON</strong>을 활용하여 안전한 온라인 조사·접수
              환경을 운영하는 기관 및 기업에 부여하는 인증 마크입니다. 정부 CSAP 인증
              온라인 조사 솔루션을 적용한 설문·접수 과정에서 개인정보보호 기준을
              반영한 운영을 상징합니다.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
                <div className="text-[12px] font-bold uppercase tracking-wider text-trust-blue">
                  마크 부여 대상
                </div>
                <ul className="mt-3 space-y-1.5 text-[13.5px] text-text-secondary">
                  {[
                    "WiseON을 사용하는 기관",
                    "WiseON을 사용하는 기업",
                    "WiseON을 사용하는 협단체 회원사",
                    "WiseON 기반 온라인 조사·접수 운영 기관",
                  ].map((t) => (
                    <li key={t} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-trust-blue" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
                <div className="text-[12px] font-bold uppercase tracking-wider text-privacy-green">
                  부여 기준 예시
                </div>
                <ul className="mt-3 space-y-1.5 text-[13.5px] text-text-secondary">
                  {[
                    "개인정보 최소수집 원칙 반영",
                    "적법한 온라인 조사·접수 운영",
                    "안전한 접근권한 관리",
                    "로그 및 이력 관리",
                    "개인정보 보호조치 반영",
                    "조사 운영 시 보안 기준 준수",
                  ].map((t) => (
                    <li key={t} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-privacy-green" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Flow */}
            <div className="mt-8">
              <div className="text-[12px] font-bold uppercase tracking-wider text-navy">
                마크 부여 운영 흐름
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-5">
                {[
                  "WiseON 사용",
                  "온라인 조사·접수 운영",
                  "개인정보보호 기준 확인",
                  "안심 조사 마크 부여",
                  "기관/기업 활용",
                ].map((t, i) => (
                  <div
                    key={t}
                    className="relative rounded-xl border border-[#E5E7EB] bg-white p-4 text-center"
                  >
                    <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
                      {i + 1}
                    </div>
                    <div className="mt-2 text-[12.5px] font-semibold text-text-primary leading-snug">
                      {t}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-[13.5px] font-bold text-white hover:bg-[#0B2540]"
              >
                마크 부여 기준 문의 <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="#member-search"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#0B2540]/20 bg-white px-5 py-2.5 text-[13.5px] font-bold text-navy hover:bg-soft-sky"
              >
                회원사 지원 검색
              </a>
              <a
                href="https://www.wiseon.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#0F766E]/30 bg-white px-5 py-2.5 text-[13.5px] font-bold text-[#0F766E] hover:bg-[#ECFEFB]"
              >
                WiseON 안내 보기
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 2. Why ---------- */
function PrivacyMissionSection() {
  const items = [
    {
      icon: Network,
      title: "개인정보 범위 확대",
      desc: "이름·연락처·이메일뿐 아니라 부서, 직급, 나이, 지역, IP, 기기정보, 주관식 응답 등도 결합 시 개인정보가 될 수 있습니다.",
    },
    {
      icon: ClipboardCheck,
      title: "온라인 수집 리스크 증가",
      desc: "설문, 행사 접수, 교육 신청, 이벤트, 고객 만족도 조사 등 일상적 업무에서도 개인정보 처리가 발생할 수 있습니다.",
    },
    {
      icon: Search,
      title: "신고와 모니터링 중요성 확대",
      desc: "국민 누구나 침해 사실을 발견하고 신고할 수 있는 환경으로 전환되고 있습니다.",
    },
    {
      icon: ShieldCheck,
      title: "예방 중심 체계 필요",
      desc: "사후 대응보다 수집 설계, 접근권한, 로그관리, 파기 증빙, 위탁관리 등 예방 체계가 중요해지고 있습니다.",
    },
  ];

  return (
    <section className="section-y">
      <div className="container-page">
        <div className="max-w-3xl">
          <div className="label-eyebrow mb-4">Why Privacy Protection</div>
          <h2 className="text-navy">
            개인정보보호는 선택이 아니라<br />국민 권리 보호의 기본입니다
          </h2>
          <p className="mt-6 text-text-secondary leading-[1.8]">
            개인정보보호법상 개인정보의 범위는 매우 넓으며, 이름·연락처·이메일
            같은 직접 식별정보뿐 아니라 부서, 직급, 나이, 지역, IP, 기기정보,
            주관식 응답 등도 다른 정보와 결합될 경우 개인정보가 될 수 있습니다.
            온라인 설문, 행사 접수, 교육 신청, 내부 직원 조사, 외부 용역 조사
            등 일상적인 업무에서도 개인정보 처리 리스크가 발생할 수 있습니다.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <div key={it.title} className="kcf-icon-card">
              <div className="kcf-ic">
                <it.icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div className="mt-5 text-[11.5px] font-bold uppercase tracking-[0.12em] text-trust-blue">
                Issue 0{i + 1}
              </div>
              <div className="mt-1.5 text-[18px] font-bold text-navy leading-snug">
                {it.title}
              </div>
              <p className="mt-3 text-[14.5px] leading-relaxed text-text-secondary">
                {it.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ---------- Section 3. 4 Pillars ---------- */
function PrivacyBusinessPillars() {
  return (
    <section id="pillars" className="section-y bg-[#F5F8FC] border-y border-[#E5E7EB] scroll-mt-24">
      <div className="container-page">
        <div className="max-w-3xl">
          <div className="label-eyebrow mb-4">Our 4 Pillars</div>
          <h2 className="text-navy">국민의 권리를 지키기 위한 4대 핵심 사업</h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Pillar 1 */}
          <PillarCard
            tag="01 · Service Recommendation"
            icon={FileCheck}
            title="좋은 개인정보보호 서비스 추천"
            desc="개인정보보호진흥원은 국민과 기업, 공공기관이 안전한 개인정보보호 서비스를 선택할 수 있도록 객관적인 추천 기준과 점검 항목을 제공합니다. 특정 서비스를 홍보하는 것이 아니라, 보안 인증, 국내 데이터 저장, 접근권한 관리, 로그 기록, 파기 증빙, 위탁관리 체계 등 안전성 기준을 중심으로 서비스 선택을 지원합니다."
          >
            <div className="text-[13px] font-semibold uppercase tracking-wider text-trust-blue">
              서비스 선택 체크리스트
            </div>
            <ul className="mt-3 space-y-2 text-[14.5px] text-text-secondary">
              {[
                "개인정보보호 서비스 추천 기준 제공",
                "온라인 조사·접수 플랫폼 안전성 점검 기준",
                "개인정보 처리방침 및 동의 절차 점검 기준",
                "접근권한·접속기록·다운로드 이력 관리 여부 확인",
                "개인정보 파기 증빙 가능 여부 확인",
                "국외 이전 및 수탁사 관리 기준 안내",
                "공공기관·기업·비영리기관 유형별 추천 체크리스트",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-privacy-green" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-white p-5">
              <div className="text-[13px] font-semibold text-navy">안전한 서비스의 조건</div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
                {[
                  ["보안 인증 보유", "필수"],
                  ["국내 데이터 저장", "권장"],
                  ["접근권한 관리", "필수"],
                  ["로그·다운로드 기록", "필수"],
                  ["파기 증빙 제공", "필수"],
                  ["수탁사 관리 체계", "권장"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between rounded-lg bg-[#F8FAFC] px-3 py-2">
                    <span className="text-text-secondary">{k}</span>
                    <span className={`text-[11.5px] font-bold ${v === "필수" ? "text-privacy-green" : "text-trust-blue"}`}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-5 py-6 text-center text-[13px] text-text-muted">
              공익 추천 기준 기반 서비스 DB 준비 중
            </div>
          </PillarCard>

          {/* Pillar 2 */}
          <PillarCard
            tag="02 · Report & Monitoring"
            icon={AlertTriangle}
            title="개인정보 신고 및 모니터링"
            desc="개인정보 침해 우려가 있는 온라인 수집, 설문, 접수, 이벤트, 외부 위탁 조사, 내부 직원 조사 등에 대해 국민과 이용자가 문제를 인식하고 대응할 수 있도록 신고 안내와 모니터링 체계를 제공합니다."
          >
            <div className="rounded-xl border border-[#FCD34D]/40 bg-[#FFFBEB] p-4 text-[13.5px] text-[#92400E] leading-relaxed">
              <Info className="inline h-4 w-4 mr-1 -mt-0.5" />
              개인정보보호진흥원은 공식 행정처분 기관이 아니며, 공식 신고와
              조사는 개인정보보호위원회 및 KISA 개인정보침해신고센터를 통해
              진행됩니다. 진흥원은 신고 안내, 사전 상담, 위험 모니터링,
              제도 개선 의견 수렴을 지원하는 공익 창구 역할을 합니다.
            </div>

            <div className="mt-5 text-[13px] font-semibold uppercase tracking-wider text-trust-blue">
              주요 신고 유형
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "동의 없는 개인정보 수집",
                "개인정보 제3자 제공 의심",
                "온라인 설문·접수 정보 노출",
                "응답 링크 또는 기기정보 추적 우려",
                "경품·이벤트 신청 정보 미파기",
                "외부 용역사 개인정보 관리 미흡",
                "내부 직원 설문·평가정보 노출 우려",
                "CCTV 및 영상정보 처리 우려",
                "개인정보 처리방침 미공개",
                "CPO 미지정 또는 관리체계 부재",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2 rounded-lg bg-[#F8FAFC] px-3 py-2 text-[13.5px] text-text-primary">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B68A35]" />
                  <span>{t}</span>
                </div>
              ))}
            </div>

            <div id="report" className="mt-6 scroll-mt-24">
              <div className="text-[13px] font-semibold uppercase tracking-wider text-trust-blue">
                신고 안내 흐름
              </div>
              <ol className="mt-3 space-y-2">
                {[
                  "침해 의심 사례 확인",
                  "화면 캡처, 참여 확인 메일, 수집 항목 등 기본 자료 정리",
                  "개인정보보호진흥원 사전 상담 또는 공식 신고기관 안내",
                  "필요 시 KISA 개인정보침해신고센터 및 118 공식 신고 안내",
                  "유사 사례 모니터링 및 정책 개선 과제로 축적",
                ].map((t, i) => (
                  <li key={i} className="flex gap-3 rounded-lg border border-[#E5E7EB] bg-white px-4 py-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-[12px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-[14px] text-text-primary">{t}</span>
                  </li>
                ))}
              </ol>
            </div>
          </PillarCard>

          {/* Pillar 3 */}
          <PillarCard
            tag="03 · Policy Research"
            icon={Scale}
            title="개인정보보호 정책연구 및 법제화 제안"
            desc="개인정보보호진흥원은 개인정보보호 현장의 문제를 조사하고, 기업·공공기관·국민의 의견을 바탕으로 정책연구, 실태조사, 제도 개선, 법제화 제안을 수행합니다."
            anchor="research"
          >
            <div className="text-[13px] font-semibold uppercase tracking-wider text-trust-blue">
              주요 연구 분야
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13.5px]">
              {[
                "중소기업 개인정보보호 실태조사",
                "온라인 설문·접수 플랫폼 개인정보 처리 실태",
                "경품·이벤트 개인정보 수집 및 파기 기준",
                "내부 직원 조사와 익명성 보장 기준",
                "외부 위탁 조사 및 수탁사 관리 기준",
                "가명처리·익명처리 실무 기준",
                "데이터 활용과 개인정보보호의 균형",
                "개인정보 영향평가 및 데이터 거버넌스",
                "신고포상제와 국민 참여형 감시체계",
                "AI·데이터 기반 서비스의 개인정보보호 과제",
              ].map((t) => (
                <div key={t} className="rounded-lg bg-[#F8FAFC] px-3 py-2 text-text-primary">
                  • {t}
                </div>
              ))}
            </div>

            <div className="mt-6 text-[13px] font-semibold uppercase tracking-wider text-trust-blue">
              정책 산출물
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "개인정보보호 정책보고서",
                "실태조사 리포트",
                "제도 개선 의견서",
                "법제화 제안서",
                "중소기업 실무 가이드",
                "국민 개인정보보호 백서",
                "공청회·토론회 자료집",
              ].map((t) => (
                <span key={t} className="rounded-full border border-[#CBD5E1] bg-white px-3 py-1.5 text-[12.5px] font-semibold text-navy">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-5 py-6 text-center text-[13px] text-text-muted">
              정책보고서 목록 및 자료실 준비 중
            </div>
          </PillarCard>

          {/* Pillar 4 */}
          <PillarCard
            tag="04 · Forum & Network"
            icon={Megaphone}
            title="개인정보보호 포럼 및 단체 활동"
            desc="개인정보보호진흥원은 전문가, 기업, 공공기관, 학계, 시민사회가 함께 참여하는 개인정보보호 포럼과 협력 네트워크를 운영합니다. 국민의 개인정보보호 인식을 높이고, 현장 중심의 정책 개선과 실무 확산을 지원합니다."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13.5px]">
              {[
                "개인정보보호 포럼 개최",
                "개인정보보호 실무 세미나",
                "중소기업 개인정보보호 교육 캠페인",
                "공공기관·기업·단체 협력 네트워크",
                "개인정보보호 우수사례 발굴",
                "정책 토론회 및 공청회",
                "청소년·일반인 대상 디지털 프라이버시 교육",
                "개인정보보호 주간 캠페인",
                "전문가 자문단 및 워킹그룹 운영",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2 rounded-lg bg-[#F8FAFC] px-3 py-2">
                  <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-trust-blue" />
                  <span className="text-text-primary">{t}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-5 text-center text-[13px] text-text-muted">
                포럼 일정 카드
              </div>
              <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-5 text-center text-[13px] text-text-muted">
                참여기관 로고 영역
              </div>
              <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-5 text-center text-[13px] text-text-muted">
                행사 갤러리
              </div>
              <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-5 text-center text-[13px] text-text-muted">
                전문가 자문단
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <a href="#contact" className="rounded-full bg-navy px-4 py-2 text-[13px] font-semibold text-white">
                포럼 참여 신청
              </a>
              <a href="#contact" className="rounded-full border border-[#CBD5E1] bg-white px-4 py-2 text-[13px] font-semibold text-navy">
                협력기관 문의
              </a>
            </div>
          </PillarCard>
        </div>
      </div>
    </section>
  );
}

function PillarCard({
  tag,
  icon: Icon,
  title,
  desc,
  children,
  anchor,
}: {
  tag: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  desc: string;
  children?: React.ReactNode;
  anchor?: string;
}) {
  return (
    <div
      id={anchor}
      className="kcf-card !p-0 scroll-mt-24 overflow-hidden"
    >
      <div
        className="relative px-8 pt-8 pb-7"
        style={{
          background:
            "linear-gradient(135deg, #0B1F3A 0%, #0F2E5C 60%, #0F766E 130%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur ring-1 ring-white/20">
            <Icon className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#5EEAD4]">
            {tag}
          </div>
        </div>
        <h3 className="relative mt-5 text-white">{title}</h3>
        <p className="relative mt-3 text-[15px] leading-[1.8] text-white/80">
          {desc}
        </p>
      </div>
      <div className="px-8 py-8">{children}</div>
    </div>
  );
}


/* ---------- Section 4. Self-check ---------- */
const SELF_CHECK_ITEMS = [
  "고객의 이름, 연락처, 이메일을 수집한 적이 있다.",
  "온라인 설문, 행사 접수, 교육 신청을 운영한 적이 있다.",
  "직원의 인사정보 또는 내부 설문 결과를 전산으로 관리한다.",
  "홈페이지에 회원가입 또는 신청 기능이 있다.",
  "거래처 담당자의 명함 정보를 보관한다.",
  "개인별 추적 링크를 사용해 설문을 배포한다.",
  "응답자의 IP, 기기정보, 접속기록이 저장된다.",
  "응답과 경품 신청을 동일한 폼에서 받는다.",
  "부서, 직급, 나이 조합으로 특정인이 식별될 수 있다.",
  "주관식 응답에 개인을 특정할 수 있는 내용이 포함될 수 있다.",
  "외부 업체에 조사를 맡기지만 수탁사 관리 기준이 명확하지 않다.",
  "개인정보 파기 기록을 남기지 않는다.",
  "접근권한과 다운로드 이력 관리가 어렵다.",
];

function PrivacySelfCheck() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const total = SELF_CHECK_ITEMS.length;
  const count = checked.size;

  const result = useMemo(() => {
    if (count === 0)
      return {
        level: "안내",
        color: "text-text-muted",
        bg: "bg-[#F5F8FC]",
        border: "border-[#E5E7EB]",
        text: "체크 항목을 선택하면 자가점검 결과가 표시됩니다.",
      };
    if (count <= 3)
      return {
        level: "낮음",
        color: "text-privacy-green",
        bg: "bg-[#ECFDF5]",
        border: "border-[#A7F3D0]",
        text: "현재 구조는 상대적으로 안정적입니다. 다만 정기적인 점검이 필요합니다.",
      };
    if (count <= 6)
      return {
        level: "주의",
        color: "text-trust-blue",
        bg: "bg-[#EFF6FF]",
        border: "border-[#BFDBFE]",
        text: "일부 개인정보 처리 리스크가 확인됩니다. 수집 항목과 보관·파기 기준을 점검하세요.",
      };
    if (count <= 9)
      return {
        level: "위험",
        color: "text-[#B68A35]",
        bg: "bg-[#FFFBEB]",
        border: "border-[#FCD34D]",
        text: "개인정보보호 절차 보완이 필요합니다. 접근권한, 로그관리, 파기 증빙, 위탁관리 체계를 확인하세요.",
      };
    return {
      level: "긴급 점검 필요",
      color: "text-[#B91C1C]",
      bg: "bg-[#FEF2F2]",
      border: "border-[#FCA5A5]",
      text: "개인정보 처리 리스크가 높습니다. 전문가 상담 또는 공식 기관 안내를 확인하세요.",
    };
  }, [count]);

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <section className="section-y">
      <div className="container-page max-w-6xl">
        <div className="max-w-3xl">
          <div className="label-eyebrow mb-4">Self Check</div>
          <h2 className="text-navy">
            우리 기관은 개인정보를<br />안전하게 처리하고 있나요?
          </h2>
          <p className="mt-5 text-text-secondary leading-[1.8]">
            아래 항목 중 하나라도 해당하면 개인정보보호 점검이 필요합니다.
            본 자가점검은 법률 판단이 아닌 참고용 공익 안내입니다.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="kcf-card !p-7">
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-semibold uppercase tracking-wider text-trust-blue">
                점검 항목
              </div>
              <div className="text-[13px] text-text-muted">
                {count} / {total} 항목 체크됨
              </div>
            </div>
            <ul className="mt-5 space-y-2">
              {SELF_CHECK_ITEMS.map((item, i) => {
                const isChecked = checked.has(i);
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      className={`group w-full text-left flex items-start gap-3 rounded-xl border px-4 py-3 transition ${
                        isChecked
                          ? "border-trust-blue bg-soft-sky"
                          : "border-[#E5E7EB] bg-white hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                          isChecked
                            ? "border-trust-blue bg-trust-blue text-white"
                            : "border-[#CBD5E1] bg-white"
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="h-4 w-4" />}
                      </span>
                      <span className="text-[14.5px] text-text-primary">{item}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className={`rounded-2xl border ${result.border} ${result.bg} p-7`}>
              <div className="text-[12px] font-semibold uppercase tracking-wider text-text-muted">
                자가점검 결과
              </div>
              <div className={`mt-2 text-[28px] font-bold ${result.color}`}>
                {result.level}
              </div>
              <div className="mt-2 text-[13px] text-text-muted">
                체크 항목 {count} / {total}
              </div>
              <p className="mt-4 text-[14.5px] leading-relaxed text-text-primary">
                {result.text}
              </p>
            </div>
            <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 text-[13px] text-text-secondary leading-relaxed">
              <Info className="inline h-4 w-4 mr-1 -mt-0.5 text-trust-blue" />
              본 자가점검은 공익적 안내를 목적으로 제공되며, 정확한 법률 해석과
              사안별 적용은 개인정보보호위원회·KISA 및 전문 자문이 필요합니다.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 6. Law Change Table ---------- */
function PrivacyLawChangeSection() {
  const rows = [
    {
      k: "과징금 상한",
      before: "관련 매출액 기준 일정 비율 적용",
      after: "전체 매출액 기준으로 상향 적용 (제도 변화 방향)",
    },
    {
      k: "대표자 책임",
      before: "주로 실무 부서 단위 책임",
      after: "대표이사 등 경영진의 관리 책임이 강조되는 방향",
    },
    {
      k: "점검 방식",
      before: "사후 사고 발생 시 조사 중심",
      after: "현장 실사·상시 모니터링 등 사전 점검 강화 방향",
    },
    {
      k: "예방투자 기업 혜택",
      before: "예방투자에 대한 별도 고려 미흡",
      after: "사전 예방체계 마련 기업에 대한 처분 감경 등 검토",
    },
    {
      k: "유출 가능성 통지",
      before: "실제 유출 확인 시 통지 중심",
      after: "유출 가능성 단계의 선제적 통지 의무 확대 방향",
    },
    {
      k: "CPO 보고 의무",
      before: "지정·운영 중심",
      after: "경영진 직보고 및 독립성 강화 방향",
    },
    {
      k: "정보보호 공시 확대",
      before: "일부 대상에 한정",
      after: "공시 대상 범위 및 항목 확대 검토 방향",
    },
  ];
  return (
    <section className="section-y">
      <div className="container-page">
        <div className="max-w-3xl">
          <div className="label-eyebrow mb-4">Regulatory Trend</div>
          <h2 className="text-navy">
            개인정보보호 환경이<br />사후 대응에서 예방 중심으로 바뀌고 있습니다
          </h2>
          <p className="mt-5 text-text-secondary leading-[1.8]">
            아래 비교는 첨부자료 기준의 제도 변화 방향을 정리한 것으로,
            구체적인 적용은 사안별 법률 검토와 사전 점검이 필요합니다.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[#E5E7EB]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[14.5px]">
              <thead className="bg-navy text-white">
                <tr>
                  <th className="px-5 py-4 font-semibold w-[22%]">항목</th>
                  <th className="px-5 py-4 font-semibold w-[39%]">개정 전 (기존)</th>
                  <th className="px-5 py-4 font-semibold w-[39%]">변화 방향</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.k} className={i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                    <th className="align-top px-5 py-4 font-bold text-navy border-b border-[#E5E7EB]">
                      {r.k}
                    </th>
                    <td className="align-top px-5 py-4 text-text-secondary border-b border-[#E5E7EB]">
                      {r.before}
                    </td>
                    <td className="align-top px-5 py-4 text-text-primary border-b border-[#E5E7EB]">
                      {r.after}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-[#F5F8FC] p-5 text-[13.5px] text-text-secondary leading-relaxed">
          <Info className="inline h-4 w-4 mr-1 -mt-0.5 text-trust-blue" />
          본 비교표는 첨부자료를 토대로 제도 변화 방향을 정리한 공익 안내이며,
          구체적인 적용·해석은 개인정보보호위원회 및 전문 자문을 통해 확인하시기 바랍니다.
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 7. Incident types ---------- */
function IncidentTypeSection() {
  const rows = [
    { type: "동의 없는 수집", action: "수집 목적, 항목, 보유기간, 제3자 제공 여부 고지" },
    { type: "안전조치 미흡", action: "접근권한 관리, 암호화, 접속기록, 다운로드 이력 관리" },
    { type: "개인정보 미파기", action: "목적 달성 후 파기 기준과 파기 증빙 관리" },
    { type: "외부 위탁 관리 미흡", action: "위탁 계약서, 수탁사 점검, 위탁 사실 공개" },
    {
      type: "내부 설문·다면평가 노출",
      action: "익명성 보장, 최소 응답 수 기준, 관리자 접근 제한",
    },
    {
      type: "경품·이벤트 정보 노출",
      action: "응답과 신청 정보 분리, 별도 보안 채널, 즉시 파기",
    },
    { type: "개인정보 처리방침 미공개", action: "처리방침 수립, 공개, 정기 업데이트" },
    { type: "유출 통지 미이행", action: "사고 대응 절차와 통지 기준 마련" },
  ];
  return (
    <section className="section-y bg-[#F5F8FC] border-y border-[#E5E7EB]">
      <div className="container-page">
        <div className="max-w-3xl">
          <div className="label-eyebrow mb-4">Incident Types</div>
          <h2 className="text-navy">자주 발생하는 개인정보 침해 유형</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {rows.map((r, i) => (
            <div
              key={r.type}
              className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(15,23,42,0.12)] hover:border-[#FCA5A5]/60"
            >
              <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#B91C1C] to-[#F87171]" />
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#FEF2F2] opacity-70" />
              <div className="relative flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FEE2E2] to-[#FECACA] text-[#B91C1C] ring-1 ring-[#FECACA] shadow-sm">
                  <AlertTriangle className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#B91C1C]">
                    Risk · {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-1 text-[17px] font-bold text-navy">{r.type}</div>
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#F0FDF4] border border-[#A7F3D0]/60 p-3 text-[14px] text-text-secondary">
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-privacy-green" />
                    <span>
                      <span className="font-bold text-privacy-green">대응 · </span>
                      {r.action}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ---------- Section 8. FAQ ---------- */
function PrivacyFAQ() {
  const faqs = [
    {
      q: "개인정보란 무엇인가요?",
      a: "살아있는 개인에 관한 정보로서 이름, 주민등록번호, 영상 등을 통해 개인을 알아볼 수 있는 정보, 또는 해당 정보만으로 특정 개인을 알아볼 수 없더라도 다른 정보와 쉽게 결합하여 알아볼 수 있는 정보를 포함합니다.",
    },
    {
      q: "이름만 있어도 개인정보인가요?",
      a: "이름은 그 자체로 식별성이 강하지만, 동명이인 가능성 때문에 단독으로는 식별이 어려운 경우도 있습니다. 다만 다른 항목(소속, 연락처, 이메일 등)과 결합되면 명확한 개인정보가 됩니다.",
    },
    {
      q: "부서명, 직급, 나이도 개인정보가 될 수 있나요?",
      a: "단독으로는 일반정보이지만, 소규모 조직에서 부서·직급·나이 조합이 특정인을 식별 가능하게 만든다면 결합 개인정보로 취급됩니다. 내부 설문 설계 시 특히 주의가 필요합니다.",
    },
    {
      q: "익명 설문은 어떻게 설계해야 하나요?",
      a: "이름·연락처·이메일 등 식별 항목을 받지 않고, 개인별 추적 링크 대신 공개 링크를 사용하며, 인구통계 항목은 범위형으로 받고, 최소 응답 수 기준 미달 시 결과를 비공개 처리하는 등 익명성 보장 설계가 필요합니다.",
    },
    {
      q: "내부 직원 대상 설문도 개인정보보호법 적용 대상인가요?",
      a: "직원도 정보주체이므로 동일하게 적용됩니다. 인사평가·만족도 조사 등은 응답자 식별이 가능한지 여부, 익명성 보장 수준, 접근 권한, 보유·파기 기준을 사전에 설계해야 합니다.",
    },
    {
      q: "외부 조사 업체에 맡기면 우리 기관 책임은 없어지나요?",
      a: "위탁자도 관리·감독 책임이 있으며, 위탁 계약서, 수탁사 점검, 위탁 사실 공개 등 수탁사 관리 의무를 부담합니다. 위탁 자체로 책임이 면제되지 않습니다.",
    },
    {
      q: "경품 이벤트와 설문을 같은 폼에서 받아도 되나요?",
      a: "권장되지 않습니다. 설문 응답과 경품 신청 정보를 분리해 수집·보관 채널을 구분하고, 경품 지급이 끝나면 신청 정보는 즉시 파기하는 것이 안전한 설계입니다.",
    },
    {
      q: "개인정보 수집 여부는 어떻게 판단하나요?",
      a: "수집 항목 자체가 식별성을 가지거나, 다른 정보와 결합해 식별 가능성이 발생하는지를 기준으로 판단합니다. 판단이 어려운 경우 자가점검 체크리스트와 전문 상담을 활용할 수 있습니다.",
    },
    {
      q: "신고포상제는 무엇인가요?",
      a: "개인정보 침해 사실을 신고한 국민에게 일정한 포상을 제공하여, 국민 참여형 감시체계를 강화하기 위한 제도입니다. 구체적인 운영 기준은 관계 기관 공지를 참고해야 합니다.",
    },
    {
      q: "공식 신고는 어디에서 하나요?",
      a: "공식 행정 신고는 개인정보보호위원회 및 KISA 개인정보침해신고센터(국번 없이 118)를 통해 접수됩니다. 개인정보보호진흥원은 공익 사전 상담·안내 창구 역할을 합니다.",
    },
    {
      q: "개인정보보호진흥원은 어떤 도움을 제공하나요?",
      a: "공익 추천 기준 안내, 신고·모니터링 사전 상담, 정책연구 및 제도 개선 의견 수렴, 포럼·교육 운영 등을 통해 국민·기업·공공기관의 개인정보보호 역량 강화를 지원합니다.",
    },
    {
      q: "좋은 개인정보보호 서비스를 고르는 기준은 무엇인가요?",
      a: "특정 서비스 추천이 아니라 보안 인증 보유, 국내 데이터 저장, 접근권한·로그 관리, 파기 증빙, 수탁사 관리 체계, 처리방침 공개 등 안전성 기준을 기반으로 판단하는 것이 권장됩니다.",
    },
  ];
  return (
    <section className="section-y">
      <div className="container-page max-w-5xl">
        <div className="max-w-3xl">
          <div className="label-eyebrow mb-4">FAQ</div>
          <h2 className="text-navy">개인정보보호 실무 Q&amp;A</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`q-${i}`}
              className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-5 text-left text-[16px] font-bold text-navy hover:no-underline">
                <span className="mr-3 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-soft-sky text-[12px] font-bold text-trust-blue">
                  Q
                </span>
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 text-[15px] leading-[1.8] text-text-secondary">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-[#F5F8FC] p-5 text-[13.5px] text-text-secondary leading-relaxed">
          <Info className="inline h-4 w-4 mr-1 -mt-0.5 text-trust-blue" />
          본 Q&amp;A는 공익 안내를 목적으로 작성되었으며, 공식 법률 해석은
          관련 기관 또는 전문가 상담이 필요합니다.
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 9. Resources ---------- */
function PrivacyResources() {
  const resources = [
    { icon: BookOpen, title: "중소기업 개인정보보호 실무 Q&A" },
    { icon: ClipboardCheck, title: "온라인 설문·접수 개인정보보호 체크리스트" },
    { icon: ShieldCheck, title: "개인정보 수집 최소화 가이드" },
    { icon: Users, title: "내부 직원 조사 익명성 보장 가이드" },
    { icon: Building2, title: "개인정보 위탁관리 체크리스트" },
    { icon: FileCheck, title: "경품·이벤트 개인정보 처리 가이드" },
    { icon: Scale, title: "개인정보보호 정책연구 보고서" },
    { icon: Megaphone, title: "개인정보보호 포럼 자료집" },
  ];
  return (
    <section className="section-y bg-[#F5F8FC] border-y border-[#E5E7EB]">
      <div className="container-page">
        <div className="max-w-3xl">
          <div className="label-eyebrow mb-4">Resources</div>
          <h2 className="text-navy">개인정보보호 자료실</h2>
          <p className="mt-5 text-text-secondary leading-[1.8]">
            공익 자료실에서 제공될 가이드와 보고서 목록입니다. 자료 등록 후
            순차적으로 다운로드가 제공됩니다.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((r, i) => (
            <div
              key={r.title}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition hover:-translate-y-1.5 hover:border-trust-blue/30 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
            >
              <div className="absolute right-0 top-0 h-28 w-28 -translate-y-10 translate-x-10 rounded-full bg-gradient-to-br from-trust-blue/15 to-privacy-green/10 blur-2xl transition-opacity group-hover:opacity-80" />
              <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-trust-blue to-[#2563EB] text-white shadow-[0_10px_24px_rgba(29,78,216,0.32)] ring-1 ring-white/20">
                <r.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="relative mt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-trust-blue">
                Resource · {String(i + 1).padStart(2, "0")}
              </div>
              <div className="relative mt-1.5 text-[15.5px] font-bold text-navy leading-snug flex-1">
                {r.title}
              </div>
              <button
                type="button"
                disabled
                className="relative mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-2 text-[13px] font-semibold text-text-muted cursor-not-allowed"
              >
                <Download className="h-3.5 w-3.5" />
                준비 중
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ---------- Section 10. Contact ---------- */
function PrivacyContactCTA() {
  return (
    <section id="contact" className="section-y bg-[#071529] text-white scroll-mt-24">
      <div className="container-page">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-privacy-green/20 px-3 py-1 text-[12px] font-semibold text-[#5EEAD4] uppercase tracking-wider">
            Contact & Participate
          </div>
          <h2 className="mt-4 text-white">
            개인정보보호진흥원과 함께<br />안전한 데이터 사회를 만들어가세요
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "서비스 추천 기준 문의", icon: FileCheck },
            { title: "개인정보 침해 의심 사례 제보", icon: AlertTriangle },
            { title: "정책연구 공동 제안", icon: Scale },
            { title: "포럼·단체 활동 참여", icon: Megaphone },
          ].map((c, i) => (
            <div key={c.title} className="kcf-glass">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#5EEAD4] text-white shadow-[0_10px_24px_rgba(15,118,110,0.45)]">
                <c.icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div className="mt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#5EEAD4]">
                Channel · 0{i + 1}
              </div>
              <div className="mt-1.5 text-[16px] font-bold text-white leading-snug">
                {c.title}
              </div>
            </div>
          ))}
        </div>


        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <PrivacyInquiryForm />

          {/* Official reporting */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#5EEAD4]/30 bg-privacy-green/10 p-6">
              <div className="text-[12px] font-semibold uppercase tracking-wider text-[#5EEAD4]">
                공식 신고 안내
              </div>
              <div className="mt-2 text-[17px] font-bold text-white">
                개인정보 침해의 공식 신고는 아래 기관으로 접수해 주세요.
              </div>
              <ul className="mt-4 space-y-3 text-[14px] text-white/85">
                <li className="flex items-start gap-2">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#5EEAD4]" />
                  <span>개인정보보호위원회</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#5EEAD4]" />
                  <span>KISA 개인정보침해신고센터</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#5EEAD4]" />
                  <span>국번 없이 118</span>
                </li>
              </ul>
              <div className="mt-5 rounded-xl border border-white/15 bg-white/5 p-3 text-[12px] text-white/60">
                공식 기관 링크 placeholder (관련 기관 안내 페이지 연결 예정)
              </div>
            </div>

            <div className="rounded-2xl border border-[#5EEAD4]/30 bg-privacy-green/10 p-6">
              <div className="text-[12px] font-semibold uppercase tracking-wider text-[#5EEAD4]">
                개인정보보호진흥원 연락처
              </div>
              <div className="mt-2 text-[17px] font-bold text-white">
                {privacyOffice.name}
              </div>
              <ul className="mt-4 space-y-3 text-[14px] text-white/85">
                <li className="flex items-start gap-2">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#5EEAD4]" />
                  <span>{privacyOffice.address}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#5EEAD4]" />
                  <span className="text-white/70">등록 주소: {privacyOffice.addressRegistered}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#5EEAD4]" />
                  <span>
                    전화 {privacyOffice.tel} · 팩스 {privacyOffice.fax}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#5EEAD4]" />
                  <a
                    href={`mailto:${privacyOffice.email}`}
                    className="transition hover:text-white"
                  >
                    {privacyOffice.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
