import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  ClipboardCheck,
  Scale,
  Ticket,
} from "lucide-react";
import { PRIVACY_CENTER_PAGES } from "@/data/privacy-center";

const ICONS = [Scale, Award, Ticket, ClipboardCheck] as const;

export function PrivacyHomeQuickNav() {
  const items = PRIVACY_CENTER_PAGES.slice(1);

  return (
    <section className="section-y bg-white border-b border-[#E5E7EB]">
      <div className="container-page">
        <div className="max-w-3xl">
          <div className="label-eyebrow mb-4">SURE Programs</div>
          <h2 className="text-navy">개인정보보호진흥원 주요 사업</h2>
          <p className="mt-4 text-text-secondary leading-[1.8]">
            SURE(Secure User Response Environment) 사업은 온라인 설문·접수에서
            국민 개인정보를 지키기 위한 안심 인증, 협단체 지원, 자가진단 등을
            제공합니다.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = ICONS[i] ?? Scale;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-6 transition hover:-translate-y-1 hover:border-trust-blue/30 hover:shadow-[0_22px_50px_rgba(15,23,42,0.10)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-trust-blue to-[#0B2540] text-white">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="mt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-trust-blue">
                  0{i + 1}
                </div>
                <div className="mt-1.5 text-[17px] font-bold text-navy leading-snug">
                  {item.label}
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-[13.5px] font-semibold text-trust-blue">
                  자세히 보기
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
