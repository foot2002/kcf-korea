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
    to: "/privacy-center/research",
    label: "실태조사·연구",
    description: "공공기관 홈페이지 전수조사와 SURE-CHECK 진단 요약을 확인합니다.",
    tags: ["조사보고서", "SURE-CHECK"],
    icon: BookOpen,
    num: "01",
  },
  {
    to: "/privacy-center/rights",
    label: "국민 권익 보호",
    description: "모니터링단은 모집 예정입니다. 권리행사 안내와 운영기준을 봅니다.",
    tags: ["모집 예정", "권리행사"],
    icon: ShieldCheck,
    num: "02",
  },
  {
    to: "/privacy-center/security-services",
    label: "보안서비스 연계",
    description: "CSAP, 국가정보원 목록, SURE Mark를 구분하고 연계 서비스를 안내합니다.",
    tags: ["인증 구분", "SURE Mark"],
    icon: Award,
    num: "03",
  },
  {
    to: "/privacy-center/support",
    label: "기업·공공·국민참여",
    description: "기존 협단체 바우처와 주민자치 시범 지원을 한 페이지에서 안내합니다.",
    tags: ["바우처", "시범사업(안)"],
    icon: Ticket,
    num: "04",
  },
  {
    to: "/privacy-center/sure-check",
    label: "SURE-CHECK 자가진단",
    description: "공개된 설문·접수 화면을 점검합니다. 유출이나 위법을 확정하지 않습니다.",
    tags: ["자가진단", "참고 안내"],
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
