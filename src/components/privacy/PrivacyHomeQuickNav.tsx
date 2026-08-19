import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Award,
  BookOpen,
  ClipboardList,
  ShieldCheck,
  Ticket,
} from "lucide-react";

type ProgramCard = {
  to: string;
  label: string;
  description: string;
  tags: readonly string[];
  icon: LucideIcon;
  num: string;
};

const PROGRAM_CARDS: ProgramCard[] = [
  {
    to: "/privacy-center/law",
    label: "개인정보보호법/제도",
    description: "법 개정 동향, 진흥원 역할, 국민 안내 FAQ를 한곳에서 확인합니다.",
    tags: ["법령 해설", "제도 안내"],
    icon: BookOpen,
    num: "01",
  },
  {
    to: "/privacy-center/sure-mark",
    label: "안심 인증 SURE Mark",
    description: "온라인 설문·수집에 부여하는 국민 신뢰 마크의 기준과 활용을 안내합니다.",
    tags: ["안심 인증", "신뢰 마크"],
    icon: ShieldCheck,
    num: "02",
  },
  {
    to: "/privacy-center/sure-certified",
    label: "안심인증 기업",
    description: "개인정보 전문 파트너와 안심 네트워크를 확인하고 심사 신청을 할 수 있습니다.",
    tags: ["파트너", "심사 신청"],
    icon: Award,
    num: "03",
  },
  {
    to: "/privacy-center/voucher",
    label: "협단체 지원 바우처 사업소개",
    description: "협력 협단체·회원사에 무료 이용권과 할인 바우처를 지원합니다.",
    tags: ["보안 인증 수집도구", "회원사 혜택"],
    icon: Ticket,
    num: "04",
  },
  {
    to: "/privacy-center/self-check",
    label: "설문안심 SURE 자가진단",
    description: "운영 중인 설문·접수 페이지의 개인정보보호 적정성을 직접 점검합니다.",
    tags: ["무료 진단", "즉시 시작"],
    icon: ClipboardList,
    num: "05",
  },
];

export function PrivacyHomeQuickNav() {
  return (
    <section className="border-b border-[#E5E7EB] bg-white">
      <div className="container-page section-y">
        <div className="max-w-3xl">
          <div className="label-eyebrow mb-4">SURE Programs</div>
          <h2 className="text-navy">개인정보보호진흥원 주요 사업</h2>
          <p className="privacy-desc mt-4">
            SURE(Secure User Response Environment) 사업은 온라인 설문·수집에서
            국민 개인정보를 지키기 위한 안심 인증, 협단체 지원, 자가진단 등을
            제공합니다.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          {PROGRAM_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.to}
                to={card.to}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-[#E8EDF3] bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-trust-blue/20 hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)]"
              >
                <div
                  className="pointer-events-none absolute -right-2 top-0 text-[3.25rem] font-black leading-none text-[#EEF2F7]"
                  aria-hidden
                >
                  {card.num}
                </div>

                <div className="relative flex items-start justify-between gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4F7FB] text-navy ring-1 ring-[#E8EDF3] transition duration-300 group-hover:bg-[#EFF6FF] group-hover:ring-trust-blue/15">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.12em] text-trust-blue/60">
                    {card.num}
                  </span>
                </div>

                <div className="relative mt-4 flex flex-1 flex-col">
                  <div className="text-[15px] font-bold leading-snug text-navy">
                    {card.label}
                  </div>
                  <p className="mt-2.5 flex-1 text-[13px] leading-[1.7] text-text-secondary">
                    {card.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#F4F7FB] px-2.5 py-1 text-[11px] font-semibold text-text-secondary ring-1 ring-[#E8EDF3]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-trust-blue">
                    자세히 보기
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
