import { Link } from "@tanstack/react-router";
import { useState } from "react";
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
  Users,
  ClipboardCheck,
  Network,
  CheckCircle2,
  ArrowRight,
  Info,
  Cloud,
  BadgeCheck,
  Award,
  Sparkles,
} from "lucide-react";
import heroPrivacy from "@/assets/hero-privacy.jpg";
import sureLogo from "@site-image/sure_logo.png";
import sureMark from "@site-image/sure_mark.png";
import sureDetail from "@site-image/sure_detail.png";
import partnerLogoHiseoul from "@site-image/logo_hiseoul.png";
import partnerLogoEngineering from "@site-image/logo_engineering.png";
import partnerLogoIp from "@site-image/logo_ip.png";
import partnerLogoItservice from "@site-image/logo-itservice.png";
import partnerLogoEdutech from "@site-image/logo_edutech.png";
import partnerLogoPco from "@site-image/logo_pco.png";
import partnerLogoHospital from "@site-image/logo_hospital.png";
import partnerLogoFranchise from "@site-image/logo_franchise.png";
import partnerLogoMice from "@site-image/logo_mice.png";
import partnerServiceIndustry from "@site-image/logo_서비스산업총연합회.gif";
import partnerSwict from "@site-image/logo_swict총연합회.gif";
import {
  memberSupportPartners,
  searchMemberSupportPartners,
  formatSupportFlag,
  type MemberSupportPartner,
} from "@/data/member-support-partners";


/* ---------- Section 1. Hero ---------- */
export function PrivacyHero() {
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
            한국컨설팅산업재단 개인정보보호진흥원은 온라인 설문·접수에서 국민
            개인정보를 지키기 위한 SURE 안심 인증, 협단체 지원 바우처,
            자가진단 사업을 운영하는 공익 플랫폼입니다.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/privacy-center/voucher" className="btn-hero-light !px-5 !py-3 text-[14px]">
              협단체 지원 바우처 <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/privacy-center/sure-mark" className="btn-hero-outline !px-5 !py-3 text-[14px]">
              SURE 안심마크 안내
            </Link>
            <Link to="/privacy-center/self-check" className="btn-hero-outline !px-5 !py-3 text-[14px]">
              설문안심 자가진단
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {[
              "SURE 안심 인증 마크",
              "협단체·회원사 바우처 지원",
              "온라인 설문솔루션 추천",
              "설문안심 자가진단",
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
const PARTNER_ASSOCIATION_LOGOS: {
  name: string;
  logo: string;
  darkBg?: boolean;
}[] = [
  { name: "하이서울기업협회", logo: partnerLogoHiseoul, darkBg: true },
  { name: "한국엔지니어링협회", logo: partnerLogoEngineering },
  { name: "한국지식재산서비스협회", logo: partnerLogoIp, darkBg: true },
  { name: "한국IT서비스산업협회", logo: partnerLogoItservice },
  { name: "한국에듀테크산업협회", logo: partnerLogoEdutech },
  { name: "한국PCO협회", logo: partnerLogoPco },
  { name: "대한병원협회", logo: partnerLogoHospital },
  { name: "한국프랜차이즈산업협회", logo: partnerLogoFranchise },
  { name: "한국MICE협회", logo: partnerLogoMice },
  { name: "서비스산업총연합회", logo: partnerServiceIndustry },
  { name: "SWICT총연합회", logo: partnerSwict },
];

export function PartnerLogosStrip() {
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
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
          {PARTNER_ASSOCIATION_LOGOS.map((p) => (
            <div
              key={p.name}
              title={p.name}
              aria-label={`${p.name} 로고`}
              className="flex flex-col items-center rounded-xl border border-[#DDE4EE] bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition hover:border-trust-blue/40 hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
            >
              <div
                className={`flex h-[96px] w-full items-center justify-center rounded-lg px-3 py-3 ring-1 ${
                  p.darkBg
                    ? "bg-[#0B2540] ring-[#1E3A5F]"
                    : "bg-[#F1F5F9] ring-[#E2E8F0]"
                }`}
              >
                <img
                  src={p.logo}
                  alt={p.name}
                  className="max-h-[68px] w-full object-contain"
                />
              </div>
              <span className="mt-2.5 line-clamp-2 min-h-[2.5rem] text-center text-[12px] font-semibold leading-snug text-navy">
                {p.name}
              </span>
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

export function WiseOnTrustBanner() {
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
              SURE 온라인 설문솔루션 추천
            </div>
            <h2 className="mt-5 text-white">
              검증된 온라인 설문솔루션과<br />협단체 바우처 지원
            </h2>
            <p className="mt-5 text-[16px] font-semibold text-[#93C5FD]">
              SURE 사업 — 국가인증 플랫폼 WiseON 연계
            </p>
            <p className="mt-4 max-w-xl text-[15.5px] leading-[1.85] text-white/80">
              SURE 사업은 안전한 온라인 설문·접수를 위한 솔루션을 추천하고,
              협력 협단체·회원사에 이용 바우처를 지원합니다. 현재 공식 추천
              솔루션은 <strong className="text-white">WiseON</strong>이며,
              CSAP 인증 기반으로 운영됩니다.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {[
                "SURE 온라인 설문솔루션 추천",
                "국가인증 플랫폼 WiseON",
                "CSAP 인증 온라인 정보 수집 SaaS",
                "회원사 무료·할인 바우처",
                "SURE 안심마크 연계",
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

/* ---------- Section 1E. Safe Survey Mark Detail ---------- */
export function SafeSurveyMarkDetail() {
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
              SURE(Secure User Response Environment) 안심마크는 개인정보보호진흥원
              SURE 사업을 통해 안전한 온라인 조사·접수 환경을 운영하는 기관 및
              기업에 부여하는 인증 마크입니다. 진흥원이 추천하는 온라인 설문솔루션
              (현재 <strong className="text-navy">WiseON</strong>)을 적용하고
              개인정보보호 기준을 반영한 운영을 상징합니다.
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
              <Link
                to="/privacy-center/voucher"
                className="inline-flex items-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-[13.5px] font-bold text-white hover:bg-[#0B2540]"
              >
                협단체 바우처 안내 <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/privacy-center/voucher"
                hash="member-search"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#0B2540]/20 bg-white px-5 py-2.5 text-[13.5px] font-bold text-navy hover:bg-soft-sky"
              >
                회원사 지원 검색
              </Link>
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
export function PrivacyMissionSection() {
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

/* ---------- Section 6. Law Change Table ---------- */
export function PrivacyLawChangeSection() {
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

/* ---------- Section 8. FAQ ---------- */
export function PrivacyFAQ() {
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
      a: "수집 항목 자체가 식별성을 가지거나, 다른 정보와 결합해 식별 가능성이 발생하는지를 기준으로 판단합니다. 판단이 어려운 경우 설문안심 SURE 자가진단을 활용할 수 있습니다.",
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