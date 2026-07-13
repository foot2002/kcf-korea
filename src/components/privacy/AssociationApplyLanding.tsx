import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
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
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import sureMark from "@site-image/sure_mark.png";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SupportApplyForms } from "@/components/privacy/SupportApplyForms";
import {
  PcAccentCard,
  PcBadge,
  PcCard,
  PcComparisonTable,
  PcCtaBand,
  PcFeatureCard,
  PcMetricCard,
  PcMiniNav,
  PcSection,
  PcSectionHeader,
  PcStepList,
  PcTimeline,
} from "@/components/privacy/privacy-ui";
import { SECURE_COLLECTION_TOOL } from "@/data/privacy-center";
import { privacyOffice } from "@/data/kcf";

const BADGES = [
  { icon: Lock, text: "비공개 접수" },
  { icon: ShieldCheck, text: "협약 체결 무료" },
  { icon: Sparkles, text: "심사 없이 혜택 적용" },
  { icon: Phone, text: "담당자 확인 후 연락" },
] as const;

const HERO_METRICS = [
  { label: "협단체 지원", value: "연 10회 무료", desc: "1년 이내 사용 · 용량 무제한", icon: Building2 },
  { label: "회원사 지원", value: "1회 무료", desc: "모든 회원사 기본 혜택", icon: Users },
  { label: "유료 전환", value: "20% 할인", desc: "회원사 할인 적용", icon: Award },
  { label: "담당자 연락", value: "1~2영업일", desc: "신청 확인 후 안내", icon: CalendarClock },
] as const;

const RISK_CARDS = [
  { icon: Cloud, title: "온라인 설문·접수 증가", desc: "만족도 조사, 행사 신청, 교육 접수 등 업무가 온라인으로 전환되고 있습니다." },
  { icon: AlertTriangle, title: "개인정보 고지·동의 필요", desc: "간단한 신청폼도 고지, 동의, 보관, 파기 체계가 필요할 수 있습니다." },
  { icon: Users, title: "협회 차원의 공동 대응", desc: "개별 회원사보다 협회·단체 차원의 안내와 지원체계가 효과적입니다." },
] as const;

const SUMMARY_CARDS = [
  { title: "제휴 플랫폼", highlight: SECURE_COLLECTION_TOOL, desc: "설문 제작 → 배포 → 응답 수집 → 분석 → 보고서 생성", icon: Cloud },
  { title: "협회·단체 지원", highlight: "연 10회 무료", desc: "1년 이내 사용, 용량 무제한", icon: Building2 },
  { title: "회원사 지원", highlight: "1회 무료", desc: "모든 회원사 기본 무료 혜택", icon: Users },
  { title: "소기업·할인", highlight: "20% 할인", desc: "소기업 확대 지원 + 유료 전환 할인", icon: Award },
] as const;

const PLATFORM_FEATURES = [
  { title: "설문 제작", desc: "다양한 온라인 설문과 신청폼을 손쉽게 제작" },
  { title: "배포 및 응답 수집", desc: "링크 배포, 응답 수집, 참여 현황 관리" },
  { title: "데이터 분석", desc: "응답 데이터 자동 집계 및 분석" },
  { title: "보고서 생성", desc: "조사 결과를 보고서 형태로 정리" },
  { title: "개인정보보호 대응", desc: "접근권한·로그관리·안전한 데이터 관리" },
  { title: "SURE 마크 적용", desc: "안전한 정보 수집 환경을 응답자에게 안내" },
] as const;

const ASSOCIATION_BENEFITS = [
  { title: "국가인증 온라인조사 무료 이용", desc: "연간 10회 무료, 1년 이내 사용, 용량 무제한", accent: true },
  { title: "SURE 마크 자동 부여", desc: "지원 도구로 제작한 설문에 SURE 안심마크 적용", accent: false },
  { title: "홈페이지 공식 등재", desc: "협력기관 섹션에 기관명 또는 로고 게시", accent: false },
  { title: "회원사 전용 가입 코드", desc: "협회별 고유 코드로 회원사 혜택 자동 연계", accent: false },
  { title: "회원사 안내 지원", desc: "안내문, 도입 자료, 웨비나 안내 지원", accent: false },
  { title: "선도협회 인증", desc: "참여율 기준 충족 시 인증서 발급·공시", accent: false },
  { title: "SURE-EDU 교육 지원", desc: "회원사 규모에 따른 개인정보보호 교육", accent: false },
] as const;

const GENERAL_STEPS = [
  { step: 1, title: "가입 즉시", desc: "온라인조사 1회 무료 이용권 · 연내 사용, 제한 없음" },
  { step: 2, title: "설문 생성 시", desc: "SURE 마크 적용 설문 즉시 생성 가능" },
  { step: 3, title: "유료 전환 시", desc: "연간 구독 요금 20% 할인" },
  { step: 4, title: "전환 완료 후", desc: "포털 등재 가능" },
] as const;

const SMALL_STEPS = [
  { step: 1, title: "가입 즉시", desc: "온라인조사 무료 이용 혜택" },
  { step: 2, title: "지원 기간 내", desc: "연간 확대 무료 이용 혜택" },
  { step: 3, title: "추가 사용 시", desc: "건별 이용 또는 유료 전환 선택" },
  { step: 4, title: "유료 전환 시", desc: "연간 구독 요금 20% 할인" },
] as const;

const COMMON_BENEFITS = [
  { icon: BadgeCheck, title: "SURE 마크 자동 적용", desc: "안전한 정보 수집 환경을 응답자에게 안내" },
  { icon: Shield, title: "진흥원 포털 등재", desc: "사용 기업·기관 포털 등재 가능" },
  { icon: GraduationCap, title: "무료 교육 웨비나", desc: "개인정보보호법 실무 대응 교육" },
  { icon: ClipboardCheck, title: "SURE CHECK 자가진단", desc: "설문·접수 페이지 적정성 점검" },
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
  { title: "협약 신청", desc: "협회·단체 기본 정보와 담당자 정보를 입력합니다." },
  { title: "담당자 확인", desc: "영업일 기준 1~2일 이내 연락드립니다." },
  { title: "협약서 검토·서명", desc: "지원내용과 회원사 안내 방식을 확인합니다." },
  { title: "가입 코드 발급", desc: "협회별 전용 코드로 회원사 혜택이 연계됩니다." },
  { title: "혜택 적용", desc: "회원사 안내, 무료 이용권, SURE 마크·교육 지원이 진행됩니다." },
] as const;

const FAQ_ITEMS = [
  { q: "협약 체결에 비용이 발생하나요?", a: "협약 체결 자체는 무료입니다. 무료 혜택 소진 후 유료 전환은 각 기관이 선택할 수 있습니다." },
  { q: "협약 체결까지 얼마나 걸리나요?", a: "신청 후 담당자 확인·연락, 협약서 검토·서명이 완료되면 혜택이 적용됩니다." },
  { q: "회원사에게는 어떻게 안내되나요?", a: "전용 가입 코드와 안내문 템플릿, 도입 안내 자료를 제공할 수 있습니다." },
  { q: "소기업 회원사 기준은?", a: "가입 시 자진 신고와 협약 협회 확인을 기준으로 적용됩니다." },
  { q: "기존 설문 도구를 쓰던 회원사도 가능한가요?", a: "기존 온라인 설문·수집 업무를 안전한 정보 수집 환경으로 전환하도록 안내합니다." },
  { q: "SURE 마크는 어디에 활용되나요?", a: "설문·접수 화면에 적용하여 응답자에게 안전한 수집 환경임을 안내합니다." },
] as const;

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function AssociationApplyLanding() {
  return (
    <div className="bg-[var(--pc-soft-blue)]/30">
      {/* Hero */}
      <section className="privacy-hero-dark relative overflow-hidden bg-gradient-to-br from-[var(--pc-navy)] via-[#0b2540] to-[#1e40af] text-white">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="container-page relative py-12 md:py-16">
          <Link to="/privacy-center" className="inline-flex items-center gap-1.5 text-[14px] text-white/70 hover:text-white">
            ← 개인정보보호진흥원
          </Link>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <div className="pc-eyebrow !text-teal-300">SURE START Program</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {BADGES.map(({ icon: Icon, text }) => (
                  <PcBadge key={text} icon={Icon} variant="dark">{text}</PcBadge>
                ))}
              </div>
              <h1 className="mt-6 max-w-2xl text-[32px] font-bold leading-[1.18] text-white md:text-[44px]">
                SURE START 협단체 개인정보보호 지원사업
              </h1>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-white/85 md:text-[17px]">
                협회·단체와 소속 회원사가 안전한 온라인 설문·접수·이벤트·신청 업무를 운영할 수 있도록
                개인정보보호진흥원이 지원합니다.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={() => scrollTo("apply-form")} className="btn-hero-light !px-6 !py-3">
                  협약 신청하기 <ArrowRight className="ml-1 inline h-4 w-4" />
                </button>
                <button type="button" onClick={() => scrollTo("support-details")} className="btn-hero-outline !px-6 !py-3">
                  지원내용 보기
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {HERO_METRICS.map((m) => (
                  <div key={m.label} className="rounded-[1.25rem] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                    <m.icon className="h-5 w-5 text-teal-300" />
                    <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-white/60">{m.label}</div>
                    <div className="mt-0.5 text-[20px] font-bold">{m.value}</div>
                    <p className="mt-1 text-[12.5px] text-white/70">{m.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 rounded-[1.25rem] border border-white/15 bg-white/5 p-4">
                <img src={sureMark} alt="SURE 안심마크" className="h-14 w-14 shrink-0 object-contain" />
                <p className="text-[13px] leading-relaxed text-white/75">
                  SURE 안심마크로 응답자에게 안전한 온라인 정보 수집 환경임을 안내합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PcMiniNav />

      {/* Background */}
      <PcSection id="background" variant="white">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <PcSectionHeader
            eyebrow="Background"
            title="왜 협단체 지원사업이 필요한가요?"
            description="협회와 회원사는 설문, 행사 신청, 교육 접수 등에서 개인정보를 수집합니다. SURE START는 안전한 정보 수집 환경을 지원하는 협력 프로그램입니다."
          />
          <div className="grid gap-4">
            {RISK_CARDS.map((c) => (
              <PcFeatureCard key={c.title} title={c.title} desc={c.desc} icon={c.icon} />
            ))}
          </div>
        </div>
      </PcSection>

      {/* Summary */}
      <PcSection id="summary" variant="soft">
        <PcSectionHeader eyebrow="Summary" title="단체협상 결과 핵심 요약" center className="mx-auto" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SUMMARY_CARDS.map((c) => (
            <PcMetricCard key={c.title} label={c.title} value={c.highlight} desc={c.desc} icon={c.icon} />
          ))}
        </div>
      </PcSection>

      {/* Platform */}
      <PcSection id="platform" variant="white">
        <PcSectionHeader
          eyebrow="Platform"
          title={`지원 도구: ${SECURE_COLLECTION_TOOL}`}
          description="설문 제작부터 배포, 응답 수집, 데이터 분석, 보고서 생성까지 올인원 조사·분석 환경을 지원합니다."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORM_FEATURES.map((f) => (
            <PcCard key={f.title} className="p-5">
              <h3 className="pc-card-title">{f.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">{f.desc}</p>
            </PcCard>
          ))}
        </div>
      </PcSection>

      {/* Support details */}
      <PcSection id="support-details" variant="soft">
        <PcSectionHeader eyebrow="Benefits" title="협약 체결 시 지원내용" center className="mx-auto" />
        <div className="mt-10 space-y-12">
          <div>
            <h3 className="text-[18px] font-bold text-navy">협회·학회·단체 직접 지원</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ASSOCIATION_BENEFITS.map((b) => (
                <PcAccentCard
                  key={b.title}
                  title={b.title}
                  desc={b.desc}
                  highlight={b.accent ? "연 10회 무료" : undefined}
                  icon={b.accent ? Award : BadgeCheck}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <PcCard className="border-trust-blue/20 p-6">
              <PcBadge variant="default">일반 회원사</PcBadge>
              <h3 className="mt-3 text-[17px] font-bold text-navy">일반 회원사 지원</h3>
              <p className="mt-2 text-[13px] text-text-secondary">상시직원 20인 이상 또는 연 매출 30억 원 이상</p>
              <PcStepList steps={GENERAL_STEPS} accent="blue" />
            </PcCard>
            <PcCard className="border-teal-200 p-6">
              <PcBadge variant="teal">소기업 회원사</PcBadge>
              <h3 className="mt-3 text-[17px] font-bold text-navy">소기업 회원사 지원</h3>
              <p className="mt-2 text-[13px] text-text-secondary">상시직원 20인 미만 또는 연 매출 30억 원 미만</p>
              <PcStepList steps={SMALL_STEPS} accent="teal" />
            </PcCard>
          </div>

          <div>
            <h3 className="text-[18px] font-bold text-navy">전 회원사 공통 혜택</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {COMMON_BENEFITS.map((b) => (
                <PcCard key={b.title} className="p-5">
                  <b.icon className="h-6 w-6 text-[var(--pc-teal)]" />
                  <h4 className="mt-3 text-[14px] font-bold text-navy">{b.title}</h4>
                  <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{b.desc}</p>
                </PcCard>
              ))}
            </div>
          </div>
        </div>
      </PcSection>

      {/* Compare */}
      <PcSection id="compare" variant="white">
        <PcSectionHeader eyebrow="Compare" title="지원 혜택 한눈에 보기" center className="mx-auto" />
        <div className="mt-10">
          <PcComparisonTable rows={COMPARISON_ROWS} />
        </div>
      </PcSection>

      {/* Process */}
      <PcSection id="process" variant="soft">
        <PcSectionHeader eyebrow="Process" title="협약 신청 및 지원 절차" center className="mx-auto" />
        <div className="mt-10">
          <PcTimeline steps={TIMELINE} />
        </div>
      </PcSection>

      {/* Apply form */}
      <section id="apply-form" className="scroll-mt-28 bg-gradient-to-b from-[var(--pc-soft-blue)] to-white py-12 md:py-16">
        <div className="container-page">
          <PcSectionHeader
            eyebrow="Application"
            title="협약/바우처 신청하기"
            description="협단체 신청서를 작성해 주세요. 접수 내용은 비공개로 관리되며, 담당자 확인 후 연락드립니다."
            center
            className="mx-auto"
          />
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {BADGES.slice(0, 3).map(({ icon: Icon, text }) => (
              <PcBadge key={text} icon={Icon}>{text}</PcBadge>
            ))}
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start">
            <PcCard hover={false} className="p-6">
              <h3 className="text-[17px] font-bold text-navy">신청 전 확인해 주세요</h3>
              <ul className="mt-4 space-y-3 text-[14px] leading-relaxed text-text-secondary">
                <li className="flex gap-2"><ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-trust-blue" />신청 내용은 비공개로 접수됩니다.</li>
                <li className="flex gap-2"><ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-trust-blue" />담당자 확인 후 영업일 기준 1~2일 이내 연락드립니다.</li>
                <li className="flex gap-2"><ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-trust-blue" />협약 체결 자체는 무료입니다.</li>
                <li className="flex gap-2"><ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-trust-blue" />협약 후 회원사 전용 가입 코드가 발급됩니다.</li>
              </ul>
            </PcCard>
            <SupportApplyForms defaultKind="association" landing />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <PcSection id="faq" variant="white">
        <PcSectionHeader eyebrow="FAQ" title="자주 묻는 질문" center className="mx-auto" />
        <Accordion type="single" collapsible defaultValue="faq-0" className="mx-auto mt-8 max-w-3xl space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`} className="rounded-[1rem] border border-[var(--pc-border)] bg-white px-1">
              <AccordionTrigger className="px-4 py-4 text-left text-[15px] font-bold text-navy hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-[14.5px] leading-relaxed text-text-secondary">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </PcSection>

      {/* Contact CTA */}
      <PcSection variant="soft">
        <PcCtaBand
          title="협단체 협약·회원사 안내 문의"
          description="협단체 협약, 회원사 안내, SURE 마크 활용과 관련한 문의는 아래 채널로 연락해 주세요."
          dark
        >
          <a href={`tel:${privacyOffice.tel.replace(/-/g, "")}`} className="btn-hero-light !text-[14px]">
            <Phone className="mr-1.5 inline h-4 w-4" />
            {privacyOffice.tel}
          </a>
          <a href={`mailto:${privacyOffice.email}`} className="btn-hero-outline !text-[14px]">
            <Mail className="mr-1.5 inline h-4 w-4" />
            {privacyOffice.email}
          </a>
        </PcCtaBand>
        <p className="mt-6 text-center text-[13px] text-text-muted">
          개인정보보호진흥원 · 한국컨설팅산업재단
        </p>
      </PcSection>
    </div>
  );
}
