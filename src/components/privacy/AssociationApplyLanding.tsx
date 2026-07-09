import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  CalendarClock,
  ChevronRight,
  ClipboardCheck,
  Cloud,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import sureLogo from "@site-image/sure_logo.png";
import sureMark from "@site-image/sure_mark.png";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SupportApplyForms } from "@/components/privacy/SupportApplyForms";
import { privacyOffice } from "@/data/kcf";

const BADGES = [
  { icon: Lock, text: "비공개 접수" },
  { icon: ShieldCheck, text: "협약 체결 무료" },
  { icon: Sparkles, text: "심사 없이 혜택 적용" },
  { icon: Phone, text: "담당자 확인 후 연락" },
] as const;

const HERO_HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "안전한 온라인 설문·접수",
    desc: "협회와 회원사의 개인정보 수집 업무를 안전하게 지원합니다.",
  },
  {
    icon: CalendarClock,
    title: "2026년 법 개정 대비",
    desc: "개인정보보호법 전면 개정에 맞춘 실무 대응을 돕습니다.",
  },
  {
    icon: Sparkles,
    title: "협약 즉시 혜택 적용",
    desc: "별도 심사 없이 담당자 확인 후 바로 지원이 시작됩니다.",
  },
] as const;

const SUMMARY_CARDS = [
  {
    title: "제휴 플랫폼",
    highlight: "WISEON",
    desc: "설문 제작 → 배포 → 응답 수집 → 데이터 분석 → 보고서 생성까지 올인원 제공",
    icon: Cloud,
  },
  {
    title: "협회·단체 지원",
    highlight: "온라인조사 연간 10회 무료 제공",
    desc: "1년 이내 사용 가능, 용량 무제한",
    icon: Building2,
  },
  {
    title: "회원사 지원",
    highlight: "모든 회원사 온라인조사 1회 무료 제공",
    desc: "협약 협회 소속 회원사는 규모와 관계없이 기본 무료 혜택 제공",
    icon: Users,
  },
  {
    title: "소기업·할인 혜택",
    highlight: "소기업 연간 확대 지원 + 유료 전환 20% 할인",
    desc: "소기업 회원사는 추가 무료 이용 혜택을 제공하고, 유료 전환 시 회원사 할인 적용",
    icon: Award,
  },
] as const;

const WISEON_FEATURES = [
  { title: "설문 제작", desc: "다양한 온라인 설문과 신청폼을 손쉽게 제작" },
  { title: "배포 및 응답 수집", desc: "링크 배포, 응답 수집, 참여 현황 관리 지원" },
  { title: "데이터 분석", desc: "응답 데이터 자동 집계 및 분석 지원" },
  { title: "보고서 생성", desc: "조사 결과를 보고서 형태로 정리 가능" },
  { title: "개인정보보호 대응", desc: "접근권한 관리, 로그관리, 안전한 데이터 관리 등 운영 지원" },
  { title: "SURE 마크 적용", desc: "WiseON 기반 설문에 개인정보보호 안심설문 SURE 마크 적용 가능" },
] as const;

const ASSOCIATION_SUPPORT = [
  { title: "국가인증 온라인조사 무료 이용", desc: "연간 10회 무료 제공, 1년 이내 사용, 용량 무제한" },
  { title: "SURE 마크 자동 부여", desc: "WiseON으로 제작한 설문에 SURE 안심마크 적용" },
  { title: "개인정보보호진흥원 홈페이지 공식 등재", desc: "협력기관 섹션에 기관명 또는 로고 게시 가능" },
  { title: "회원사 전용 가입 코드 발급", desc: "협회별 고유 코드로 회원사 혜택 자동 연계" },
  { title: "회원사 안내 지원", desc: "회원사 발송용 안내문, 도입 안내 자료, 웨비나 안내 지원" },
  { title: "개인정보보호 선도협회 인증", desc: "회원사 참여율이 일정 기준 이상인 경우 인증서 발급 및 공시 가능" },
  { title: "SURE-EDU 교육 지원", desc: "회원사 참여 규모에 따라 개인정보보호 교육 지원 가능" },
] as const;

const GENERAL_STEPS = [
  { step: 1, title: "가입 즉시", desc: "국가인증 온라인조사 1회 무료 이용권 제공 · 연내 사용 가능, 응답자 수 등 사용 제한 없음" },
  { step: 2, title: "설문 생성 시", desc: "SURE 마크 적용 설문 즉시 생성 가능" },
  { step: 3, title: "유료 전환 시", desc: "연간 구독 요금 20% 할인 적용" },
  { step: 4, title: "전환 완료 후", desc: "SURE 사용 기업으로 포털 등재 가능" },
] as const;

const SMALL_STEPS = [
  { step: 1, title: "가입 즉시", desc: "온라인조사 무료 이용 혜택 제공" },
  { step: 2, title: "지원 기간 내", desc: "연간 확대 무료 이용 혜택 제공" },
  { step: 3, title: "추가 사용 필요 시", desc: "건별 이용 또는 유료 전환 선택 가능" },
  { step: 4, title: "유료 전환 시", desc: "연간 구독 요금 20% 할인 적용" },
] as const;

const COMMON_BENEFITS = [
  { icon: BadgeCheck, title: "SURE 마크 자동 적용", desc: "WiseON으로 제작한 설문에 SURE 안심마크를 적용하여 응답자에게 안전한 정보 수집 환경임을 안내할 수 있습니다." },
  { icon: Shield, title: "개인정보보호진흥원 포털 등재", desc: "SURE 솔루션 사용 기업 또는 기관을 개인정보보호진흥원 공식 포털에 등재할 수 있습니다." },
  { icon: GraduationCap, title: "개인정보보호 무료 교육 웨비나", desc: "회원사 대상 개인정보보호법 실무 대응 교육을 제공합니다." },
  { icon: ClipboardCheck, title: "SURE CHECK 자가진단", desc: "운영 중인 설문·이벤트·신청 페이지의 개인정보보호 적정성을 점검할 수 있도록 지원합니다." },
] as const;

const COMPARISON_ROWS = [
  { benefit: "무료 온라인조사 이용", association: "연 10회", general: "1회", small: "연간 확대 지원" },
  { benefit: "용량 제한", association: "무제한", general: "무제한", small: "무제한" },
  { benefit: "SURE 마크 적용", association: "가능", general: "가능", small: "가능" },
  { benefit: "유료 전환 할인", association: "별도 협의", general: "20%", small: "20%" },
  { benefit: "포털 등재", association: "협력기관 등재", general: "사용 기업 등재 가능", small: "사용 기업 등재 가능" },
  { benefit: "무료 교육 웨비나", association: "제공", general: "제공", small: "제공" },
  { benefit: "SURE CHECK 자가진단", association: "제공", general: "제공", small: "제공" },
] as const;

const TIMELINE = [
  { step: 1, title: "협약/바우처 신청", desc: "협회·단체 기본 정보와 담당자 정보를 입력합니다." },
  { step: 2, title: "담당자 확인 및 연락", desc: "신청 내용 확인 후 영업일 기준 1~2일 이내 담당자가 연락드립니다." },
  { step: 3, title: "협약서 검토·서명", desc: "지원내용, 회원사 안내 방식, 전용 가입 코드 발급 절차를 확인합니다." },
  { step: 4, title: "협회 전용 가입 코드 발급", desc: "협회별 전용 코드를 통해 회원사 혜택이 자동 연계됩니다." },
  { step: 5, title: "회원사 안내 및 혜택 적용", desc: "회원사 안내문 발송, 무료 이용권 제공, SURE 마크 적용, 교육·자가진단 지원이 진행됩니다." },
] as const;

const FAQ_ITEMS = [
  {
    q: "협약 체결에 비용이 발생하나요?",
    a: "아닙니다. 협약 체결 자체는 무료입니다. 무료 혜택 소진 후 유료 전환 여부는 각 기관과 회원사가 자유롭게 선택할 수 있습니다.",
  },
  {
    q: "협약 체결까지 얼마나 걸리나요?",
    a: "신청 후 담당자가 내용을 확인하여 연락드리며, 협약서 검토와 서명 절차가 완료되면 혜택이 적용됩니다.",
  },
  {
    q: "협약 체결 후 회원사에게는 어떻게 안내되나요?",
    a: "협약 체결 후 협회별 전용 가입 코드가 발급되며, 회원사에게 발송할 안내문 템플릿과 도입 안내 자료를 제공할 수 있습니다.",
  },
  {
    q: "소기업 회원사 기준은 어떻게 확인하나요?",
    a: "소기업 회원사 여부는 가입 시 자진 신고와 협약 협회의 확인을 기준으로 적용됩니다.",
  },
  {
    q: "기존에 구글폼이나 네이버폼을 사용하던 회원사도 신청할 수 있나요?",
    a: "가능합니다. 기존 온라인 설문·접수 업무를 WiseON 기반의 안전한 정보 수집 환경으로 전환할 수 있도록 안내합니다.",
  },
  {
    q: "SURE 마크는 어디에 활용되나요?",
    a: "WiseON으로 제작한 설문·접수 화면에 SURE 안심마크를 적용하여 응답자에게 안전한 정보 수집 환경임을 안내하는 데 활용할 수 있습니다.",
  },
] as const;

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function AssociationApplyLanding() {
  return (
    <div className="bg-section-bg">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#04101F] via-[#0B2540] to-[#1D4ED8] text-white">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="container-page relative py-12 md:py-20">
          <Link
            to="/privacy-center"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-white/75 hover:text-white"
          >
            ← 개인정보보호진흥원으로 돌아가기
          </Link>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div>
              <div className="label-eyebrow !text-[#5EEAD4]">SURE START Program</div>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {BADGES.map(({ icon: Icon, text }) => (
                  <span
                    key={text}
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold backdrop-blur"
                  >
                    <Icon className="h-4 w-4 text-[#5EEAD4]" />
                    {text}
                  </span>
                ))}
              </div>
              <h1 className="mt-7 max-w-3xl text-[32px] font-bold leading-[1.2] text-white md:text-[44px]">
                SURE START 협단체
                <br />
                개인정보보호 지원사업
              </h1>
              <p className="mt-6 max-w-2xl text-[18px] font-medium leading-[1.75] text-white/95 md:text-[20px]">
                협회·단체와 회원사가 안전하게 설문·접수·이벤트를 운영할 수 있도록
                개인정보보호진흥원이 지원합니다.
              </p>

              <div className="mt-8 grid gap-4">
                {HERO_HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm md:p-5"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#5EEAD4]/15 text-[#5EEAD4]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-[16px] font-bold text-white md:text-[17px]">{title}</div>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-white/80 md:text-[16px]">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => scrollTo("apply-form")}
                  className="btn-hero-light !px-7 !py-3.5 text-[15px] font-semibold"
                >
                  협약/바우처 신청하기 <ArrowRight className="ml-1.5 inline h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo("support-details")}
                  className="btn-hero-outline !px-7 !py-3.5 text-[15px] font-semibold"
                >
                  지원내용 보기
                </button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="absolute -inset-4 rounded-[2rem] bg-[#5EEAD4]/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/5 p-6 backdrop-blur-sm md:p-8">
                <img
                  src={sureLogo}
                  alt="SURE START"
                  className="mx-auto h-auto w-full max-w-[280px] object-contain"
                />
                <img
                  src={sureMark}
                  alt="SURE 안심마크"
                  className="mx-auto mt-6 h-auto w-full max-w-[220px] object-contain drop-shadow-lg"
                />
                <p className="mt-6 text-center text-[14px] leading-relaxed text-white/75 md:text-[15px]">
                  국가인증 온라인조사 플랫폼 WiseON과
                  <br />
                  SURE 안심마크로 안전한 정보 수집을 지원합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Background */}
      <Section>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <SectionTitle eyebrow="Background" title="왜 협단체 지원사업이 필요한가요?" />
          <button
            type="button"
            onClick={() => scrollTo("apply-form")}
            className="btn-primary-kcf inline-flex shrink-0 items-center gap-2 self-start"
          >
            협약/바우처 신청하기
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-8 max-w-3xl space-y-5 text-[16px] leading-[1.8] text-text-secondary md:text-[17px]">
          <p>협회·회원사는 설문, 행사 신청, 교육 접수 등에서 이름·연락처·이메일 등 개인정보를 수집합니다.</p>
          <p>일반 설문도구는 동의·접근권한·로그관리 등 개인정보보호 요건을 충분히 반영하기 어렵습니다.</p>
          <p>
            SURE START는 국가인증 온라인조사 플랫폼과 SURE 안심마크로 안전한 정보 수집 환경을
            지원하는 협력 프로그램입니다.
          </p>
        </div>
        <div className="mt-8 rounded-2xl border border-trust-blue/20 bg-gradient-to-r from-[#EFF6FF] to-white p-6 md:p-7">
          <p className="text-[16px] font-semibold leading-relaxed text-navy md:text-[17px]">
            협약/바우처 신청 → 담당자 확인 → 협약서 서명 → 가입 코드 발급 → 회원사 혜택 적용
          </p>
        </div>
      </Section>

      {/* Summary cards */}
      <Section alt>
        <SectionTitle eyebrow="Summary" title="단체협상 결과 핵심 요약" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SUMMARY_CARDS.map((card) => (
            <div key={card.title} className="kcf-card flex flex-col p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-trust-blue to-navy text-white">
                <card.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-[12px] font-bold uppercase tracking-wider text-trust-blue">
                {card.title}
              </div>
              <div className="mt-2 text-[16px] font-bold leading-snug text-navy">{card.highlight}</div>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-text-secondary">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* WiseON */}
      <Section>
        <SectionTitle eyebrow="Platform" title="지원 플랫폼: WiseON" />
        <p className="mt-4 max-w-3xl text-[16px] leading-[1.8] text-text-secondary md:text-[17px]">
          본 지원사업에서 제공하는 WiseON은 온라인조사 전문 플랫폼으로, 설문 제작부터 배포, 응답
          수집, 데이터 분석, 전문 보고서 생성까지 한 번에 운영할 수 있는 올인원 조사·분석
          솔루션입니다.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WISEON_FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-white p-5">
              <div className="text-[14px] font-bold text-navy">{f.title}</div>
              <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Support details */}
      <Section alt id="support-details">
        <SectionTitle eyebrow="Benefits" title="협약 체결 시 지원내용" />
        <div className="mt-10 space-y-10">
          {/* Association */}
          <SupportCard title="협회·학회·단체 직접 지원" subtitle="협약을 체결한 협단체에는 회원사 지원사업 운영을 위한 기본 혜택이 즉시 제공됩니다.">
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-[13.5px]">
                <thead>
                  <tr className="border-b border-border text-[12px] font-semibold text-text-muted">
                    <th className="pb-3 pr-4">지원 항목</th>
                    <th className="pb-3">내용</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ASSOCIATION_SUPPORT.map((item, i) => (
                    <tr key={item.title}>
                      <td className="py-3 pr-4 font-medium text-navy whitespace-nowrap">
                        {i + 1}. {item.title}
                      </td>
                      <td className="py-3 text-text-secondary">{item.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SupportCard>

          {/* General members */}
          <SupportCard
            title="일반 회원사 지원"
            subtitle="대상: 상시직원 20인 이상 또는 연 매출 30억 원 이상 회원사"
          >
            <StepList steps={GENERAL_STEPS} />
          </SupportCard>

          {/* Small business */}
          <SupportCard
            title="소기업 회원사 지원"
            subtitle="대상: 상시직원 20인 미만 또는 연 매출 30억 원 미만 회원사"
          >
            <p className="mt-2 text-[14px] text-text-secondary">
              소기업 회원사에는 일반 회원사보다 확장된 무료 혜택이 제공됩니다. 최종 대상은 협약
              협회 확인 후 적용됩니다.
            </p>
            <StepList steps={SMALL_STEPS} />
            <p className="mt-4 text-[13px] text-text-muted">
              소기업 해당 여부는 가입 시 자진 신고 및 협약 협회 확인을 기준으로 적용됩니다.
            </p>
          </SupportCard>

          {/* Common */}
          <SupportCard title="전 회원사 공통 혜택">
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {COMMON_BENEFITS.map((b) => (
                <div key={b.title} className="rounded-xl border border-border bg-section-bg p-5">
                  <b.icon className="h-6 w-6 text-trust-blue" />
                  <div className="mt-3 text-[14px] font-bold text-navy">{b.title}</div>
                  <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{b.desc}</p>
                </div>
              ))}
            </div>
          </SupportCard>
        </div>
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => scrollTo("apply-form")}
            className="btn-primary-kcf inline-flex items-center gap-2"
          >
            협약/바우처 신청하기 <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </Section>

      {/* Comparison table */}
      <Section>
        <SectionTitle eyebrow="Compare" title="지원 혜택 한눈에 보기" />
        <div className="mt-8 hidden overflow-x-auto rounded-2xl border border-border bg-white md:block">
          <table className="w-full min-w-[720px] text-left text-[13.5px]">
            <thead className="bg-section-bg text-[12.5px] font-semibold text-text-muted">
              <tr>
                <th className="px-5 py-4">혜택 항목</th>
                <th className="px-5 py-4">협단체</th>
                <th className="px-5 py-4">일반 회원사</th>
                <th className="px-5 py-4">소기업 회원사</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.benefit} className="hover:bg-blue-gray/30">
                  <td className="px-5 py-3.5 font-medium text-navy">{row.benefit}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{row.association}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{row.general}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{row.small}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 space-y-4 md:hidden">
          {COMPARISON_ROWS.map((row) => (
            <div key={row.benefit} className="rounded-xl border border-border bg-white p-4">
              <div className="font-bold text-navy">{row.benefit}</div>
              <dl className="mt-3 space-y-2 text-[13px]">
                <div className="flex justify-between gap-2">
                  <dt className="text-text-muted">협단체</dt>
                  <dd className="text-right text-text-secondary">{row.association}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-text-muted">일반 회원사</dt>
                  <dd className="text-right text-text-secondary">{row.general}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-text-muted">소기업 회원사</dt>
                  <dd className="text-right text-text-secondary">{row.small}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section alt>
        <SectionTitle eyebrow="Process" title="협약/바우처 신청 및 지원 절차" />
        <ol className="mt-8 space-y-0">
          {TIMELINE.map((item, i) => (
            <li key={item.step} className="relative flex gap-5 pb-8 last:pb-0">
              {i < TIMELINE.length - 1 && (
                <div className="absolute left-[19px] top-10 h-[calc(100%-2rem)] w-0.5 bg-trust-blue/20" />
              )}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-trust-blue text-[14px] font-bold text-white">
                {item.step}
              </div>
              <div className="pt-1">
                <div className="text-[16px] font-bold text-navy">{item.title}</div>
                <p className="mt-1.5 text-[14px] leading-relaxed text-text-secondary">
                  {item.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* Application form */}
      <section
        id="apply-form"
        className="scroll-mt-24 border-y border-trust-blue/15 bg-gradient-to-b from-[#EFF6FF] to-[#F8FAFC] py-12 md:py-16"
      >
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <SectionTitle eyebrow="Application" title="협약/바우처 신청" center />
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {BADGES.slice(0, 3).map(({ icon: Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5 rounded-full border border-trust-blue/25 bg-white px-3 py-1 text-[12px] font-semibold text-trust-blue"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {text}
                </span>
              ))}
            </div>
            <p className="mt-4 text-center text-[16px] leading-relaxed text-text-secondary">
              협단체·기업·공공기관 신청 유형을 선택한 뒤 핵심 정보를 입력해 주세요.
              접수 내용은 비공개로 관리되며, 담당자 확인 후 연락드립니다.
            </p>
            <div className="mt-8">
              <SupportApplyForms />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Section>
        <SectionTitle eyebrow="FAQ" title="자주 묻는 질문" />
        <Accordion type="single" collapsible className="mx-auto mt-8 max-w-3xl space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`faq-${i}`}
              className="rounded-xl border border-border bg-white px-2"
            >
              <AccordionTrigger className="px-4 py-4 text-left text-[15px] font-bold text-navy hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-[14.5px] leading-relaxed text-text-secondary">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      {/* Contact */}
      <Section alt>
        <SectionTitle eyebrow="Contact" title="문의 및 신청 안내" />
        <div className="mx-auto mt-6 max-w-2xl text-center">
          <p className="text-[15px] leading-relaxed text-text-secondary">
            협단체 협약, 회원사 안내, WiseON 도입, SURE 마크 활용과 관련한 문의는 아래 채널로
            연락해 주세요.
          </p>
          <dl className="mt-8 grid gap-4 text-left sm:grid-cols-3">
            <ContactCard icon={Phone} label="전화" value={privacyOffice.tel} href={`tel:${privacyOffice.tel.replace(/-/g, "")}`} />
            <ContactCard icon={Mail} label="이메일" value="wiseon@wiseinc.co.kr" href="mailto:wiseon@wiseinc.co.kr" />
            <ContactCard icon={Search} label="홈페이지" value="개인정보보호진흥원 → 협단체 바우처" href="/privacy-center/voucher" />
          </dl>
          <p className="mt-10 text-[13px] text-text-muted">
            개인정보보호진흥원 · 한국컨설팅산업재단
          </p>
        </div>
      </Section>
    </div>
  );
}

function Section({
  children,
  alt,
  id,
}: {
  children: React.ReactNode;
  alt?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 ${alt ? "bg-white" : ""}`}>
      <div className="container-page section-y">{children}</div>
    </section>
  );
}

function SectionTitle({
  eyebrow,
  title,
  center,
}: {
  eyebrow: string;
  title: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <div className={`label-eyebrow ${center ? "justify-center" : ""}`}>{eyebrow}</div>
      <h2 className="text-navy">{title}</h2>
    </div>
  );
}

function SupportCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 md:p-8">
      <h3 className="text-[18px] font-bold text-navy">{title}</h3>
      {subtitle && (
        <p className="mt-2 text-[14px] text-text-secondary">{subtitle}</p>
      )}
      {children}
    </div>
  );
}

function StepList({
  steps,
}: {
  steps: readonly { step: number; title: string; desc: string }[];
}) {
  return (
    <ol className="mt-4 space-y-3">
      {steps.map((s) => (
        <li
          key={s.step}
          className="flex gap-4 rounded-xl border border-border bg-section-bg p-4"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-trust-blue text-[13px] font-bold text-white">
            {s.step}
          </span>
          <div>
            <div className="text-[14px] font-bold text-navy">STEP {s.step}. {s.title}</div>
            <p className="mt-1 text-[13.5px] leading-relaxed text-text-secondary">{s.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex flex-col rounded-xl border border-border bg-white p-5 transition hover:border-trust-blue/30 hover:shadow-sm"
    >
      <Icon className="h-5 w-5 text-trust-blue" />
      <dt className="mt-3 text-[12px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-[14px] font-medium text-navy">{value}</dd>
    </a>
  );
}
