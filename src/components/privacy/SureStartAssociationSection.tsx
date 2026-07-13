import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileSignature,
  Handshake,
  Lock,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";

const SUPPORT_CARDS = [
  {
    title: "협회·단체 지원",
    icon: Building2,
    accent: "from-[#1D4ED8] to-[#0B2540]",
    items: [
      "온라인조사 연간 10회 무료 제공",
      "협회별 회원사 전용 가입 코드 발급",
      "보안 인증 수집도구 기반 설문에 SURE 안심마크 적용",
      "개인정보보호진흥원 홈페이지 협력기관 등재",
      "회원사 안내문, 웨비나, 도입 안내 지원",
    ],
  },
  {
    title: "일반 회원사 지원",
    icon: Users,
    accent: "from-[#0F766E] to-[#1D4ED8]",
    items: [
      "회원사별 온라인조사 1회 무료 이용권 제공",
      "설문 생성 시 SURE 안심마크 적용",
      "유료 전환 시 연간 구독 요금 20% 할인",
      "SURE 사용 기업으로 포털 등재 가능",
      "개인정보보호 교육 웨비나 제공",
    ],
  },
  {
    title: "소기업 회원사 지원",
    icon: ShieldCheck,
    accent: "from-[#0B2540] to-[#1D4ED8]",
    items: [
      "소기업 회원사 대상 온라인조사 연간 10회 무료 제공",
      "사용량 제한 없이 설문·접수 업무 활용 가능",
      "유료 전환 시 연간 구독 요금 20% 할인",
      "개인정보보호 자가진단 및 교육 지원",
      "최종 지원 대상은 협약 협회 확인 후 적용",
    ],
  },
] as const;

const STEPS = [
  { step: 1, label: "협약/바우처 신청", icon: FileSignature },
  { step: 2, label: "담당자 확인 및 연락", icon: Phone },
  { step: 3, label: "협약서 검토·서명", icon: Handshake },
  { step: 4, label: "협회 전용 가입 코드 발급", icon: ShieldCheck },
  { step: 5, label: "회원사 안내 및 혜택 적용", icon: Users },
] as const;

export function SureStartAssociationSection() {
  return (
    <section id="sure-start-association" className="border-b border-[#E5E7EB] bg-section-bg scroll-mt-24">
      <div className="container-page section-y">
        <div className="max-w-3xl">
          <div className="label-eyebrow">SURE START Program</div>
          <h2 className="text-navy">SURE START 협단체 개인정보보호 지원사업</h2>
          <p className="privacy-desc mt-4">
            개인정보보호진흥원은 협회·단체와 소속 회원사가 안전한 온라인 설문·수집·이벤트·신청
            업무를 운영할 수 있도록 SURE START 협단체 특별 지원사업을 운영합니다.
          </p>
          <p className="privacy-desc mt-3">
            협약을 체결한 협회·단체에는 국가인증 기반 온라인조사 이용권, 회원사 전용 가입 코드,
            SURE 안심마크 활용, 개인정보보호 교육·자가진단 등 회원사 지원 프로그램이 제공됩니다.
          </p>
          <p className="mt-3 text-[14.5px] leading-relaxed text-text-muted">
            협약/바우처 신청 후 담당자가 내용을 확인하여 협약 절차와 회원사 지원 방안을 안내드립니다.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {SUPPORT_CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-white`}
              >
                <card.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-[17px] font-bold text-navy">{card.title}</h3>
              <ul className="mt-4 flex-1 space-y-2">
                {card.items.map((item) => (
                  <li key={item} className="flex gap-2 text-[13.5px] leading-relaxed text-text-secondary">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-trust-blue" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h3 className="text-[16px] font-bold text-navy">참여 절차</h3>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map(({ step, label, icon: Icon }) => (
              <li
                key={step}
                className="flex flex-col rounded-xl border border-[#E5E7EB] bg-white px-4 py-4"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-trust-blue">
                  Step {step}
                </span>
                <Icon className="mt-2 h-5 w-5 text-navy" strokeWidth={1.75} />
                <span className="mt-2 text-[13.5px] font-semibold leading-snug text-navy">
                  {label}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 flex items-center gap-2 text-[13px] text-text-muted">
            <Lock className="h-3.5 w-3.5 shrink-0" />
            협약/바우처 신청 내용은 비공개로 접수되며, 담당자가 확인 후 연락드립니다.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-trust-blue/20 bg-gradient-to-br from-[#EFF6FF] to-white p-7 md:p-8">
          <h3 className="text-[18px] font-bold text-navy">
            협회·단체 지원사업 참여를 원하시나요?
          </h3>
          <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-text-secondary">
            회원사 대상 개인정보보호 온라인 수집체계 점검, 보안 인증 수집도구 도입 안내, SURE 안심마크 활용을
            협력하여 진행할 수 있습니다. 협약/바우처 신청 내용은 비공개로 접수되며, 담당자가 확인 후
            연락드립니다.
          </p>
          <Link
            to="/privacy-center/association-apply"
            className="btn-primary-kcf mt-6 inline-flex items-center gap-2"
          >
            협약/바우처 신청하기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
