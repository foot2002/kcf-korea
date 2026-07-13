import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, ClipboardCheck, Cloud, Shield, ShieldCheck, Users } from "lucide-react";

import {
  PcCtaBand,
  PcFeatureCard,
  PcMetricCard,
  PcSection,
  PcSectionHeader,
} from "@/components/privacy/privacy-ui";
import { SECURE_COLLECTION_TOOL } from "@/data/privacy-center";

const PROBLEM_CARDS = [
  {
    icon: Cloud,
    title: "온라인 수집 증가",
    desc: "설문, 행사, 교육, 신청 업무가 대부분 온라인으로 전환되고 있습니다.",
  },
  {
    icon: Shield,
    title: "개인정보 리스크 확대",
    desc: "간단한 신청폼도 고지, 동의, 보관, 파기 관리가 필요할 수 있습니다.",
  },
  {
    icon: Users,
    title: "협단체 공동 대응 필요",
    desc: "개별 회원사보다 협회 차원의 안내와 지원체계가 필요합니다.",
  },
] as const;

const SURE_START_METRICS = [
  { label: "협단체 지원", value: "연 10회 무료", desc: "협약 협회·단체 온라인조사 무료 이용권", icon: Users },
  { label: "회원사 지원", value: "1회 무료", desc: "협약 협회 소속 회원사 기본 무료 이용권", icon: BadgeCheck },
  { label: "소기업 지원", value: "확대 혜택", desc: "소기업 회원사 추가 무료·할인 혜택", icon: ShieldCheck },
] as const;

const PROGRAMS = [
  {
    icon: Cloud,
    title: SECURE_COLLECTION_TOOL,
    desc: "온라인 설문·접수·응답수집·분석·보고서까지 운영할 수 있는 정보 수집 플랫폼",
    href: "/privacy-center/voucher",
  },
  {
    icon: ShieldCheck,
    title: "SURE Mark",
    desc: "안전한 온라인 정보 수집 환경을 응답자에게 안내하는 개인정보보호 안심마크",
    href: "/privacy-center/sure-mark",
  },
  {
    icon: ClipboardCheck,
    title: "SURE CHECK",
    desc: "운영 중인 설문·이벤트·신청 페이지의 개인정보보호 적정성을 점검하는 자가진단",
    href: "/privacy-center/self-check",
  },
] as const;

export function PrivacyCenterHomeSections() {
  return (
    <>
      <PcSection variant="white">
        <PcSectionHeader
          eyebrow="Why it matters"
          title="온라인 설문·접수도 개인정보보호 관리 대상입니다"
          description="협회와 회원사는 만족도 조사, 행사 신청, 교육 접수 등에서 개인정보를 수집합니다. 적절한 고지·동의·보관·파기 체계가 필요합니다."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PROBLEM_CARDS.map((c) => (
            <PcFeatureCard key={c.title} title={c.title} desc={c.desc} icon={c.icon} />
          ))}
        </div>
      </PcSection>

      <PcSection variant="soft">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <PcSectionHeader
              eyebrow="SURE START"
              title="협회·단체 회원사의 온라인 정보 수집을 안전하게 전환하세요"
              description="개인정보보호진흥원은 협회·단체와 소속 회원사가 온라인 설문, 행사 신청, 교육 접수를 보다 안전하게 운영할 수 있도록 SURE START 협단체 지원사업을 운영합니다."
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/privacy-center/association-apply" className="btn-primary-kcf">
                협단체 협약 신청하기 <ArrowRight className="ml-1 inline h-4 w-4" />
              </Link>
              <Link to="/privacy-center/voucher" className="btn-secondary-kcf">
                지원내용 자세히 보기
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {SURE_START_METRICS.map((m) => (
              <PcMetricCard key={m.label} label={m.label} value={m.value} desc={m.desc} icon={m.icon} />
            ))}
          </div>
        </div>
      </PcSection>

      <PcSection variant="white">
        <PcSectionHeader
          eyebrow="Programs"
          title="개인정보보호진흥원의 주요 지원 영역"
          center
          className="mx-auto"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PROGRAMS.map((p) => (
            <PcFeatureCard key={p.title} title={p.title} desc={p.desc} icon={p.icon} href={p.href} />
          ))}
        </div>
      </PcSection>

      <PcSection variant="soft">
        <PcCtaBand
          title="협단체 협약 신청을 시작하세요"
          description="SURE START 지원사업에 참여하고, 회원사에게 안전한 온라인 정보 수집 환경을 제공하세요."
        >
          <Link to="/privacy-center/association-apply" className="btn-primary-kcf">
            협단체 협약 신청하기
          </Link>
          <Link to="/privacy-center/sure-mark" className="btn-secondary-kcf">
            SURE 안심마크 보기
          </Link>
        </PcCtaBand>
      </PcSection>
    </>
  );
}
