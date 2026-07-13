import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

import { SECURE_COLLECTION_TOOL } from "@/data/privacy-center";

export function VoucherIntroSection() {
  return (
    <section className="bg-white border-b border-[#E5E7EB]">
      <div className="container-page section-y">
        <div className="max-w-3xl">
          <div className="label-eyebrow mb-4">SURE Voucher Program</div>
          <h2 className="text-navy">
            SURE 사업의 온라인 설문솔루션 추천과 협단체 지원 바우처 사업소개
          </h2>
          <p className="privacy-desc mt-5">
            개인정보보호진흥원의 SURE 사업은 기관·기업·협단체가 안전한 온라인
            설문·접수 환경을 구축할 수 있도록{" "}
            <strong className="text-navy">검증된 온라인 설문솔루션을 추천</strong>
            하고, 협력 협단체 및 회원사에는 이용 바우처(무료·할인)를 지원합니다.
          </p>
          <p className="privacy-desc mt-4">
            현재 진흥원이 공식 추천하는 국가인증 온라인설문 수단은{" "}
            <strong className="text-navy">{SECURE_COLLECTION_TOOL}</strong>이며, CSAP
            인증 기반으로 운영됩니다. {SECURE_COLLECTION_TOOL}은 SURE 안심마크 부여와
            협단체 바우처 지원의 핵심 연계 수단입니다.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "솔루션 추천",
              desc: "SURE 기준에 부합하는 온라인 설문·수집 솔루션을 안내합니다.",
            },
            {
              step: "02",
              title: "바우처 지원",
              desc: "협력 협단체·회원사에 무료 이용권 및 할인 혜택을 제공합니다.",
            },
            {
              step: "03",
              title: "안심마크 연계",
              desc: "추천 솔루션 기반 운영 시 SURE 안심마크를 부여합니다.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-6"
            >
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-trust-blue">
                {item.step}
              </div>
              <div className="mt-2 text-[18px] font-bold text-navy">{item.title}</div>
              <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/privacy-center/association-apply"
            className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-[13.5px] font-bold text-white hover:bg-[#0B2540]"
          >
            <Sparkles className="h-4 w-4" />
            협약/바우처 신청하기
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#member-search"
            className="inline-flex items-center gap-2 rounded-full border border-[#0B2540]/20 bg-white px-5 py-2.5 text-[13.5px] font-bold text-navy hover:bg-soft-sky"
          >
            회원사 지원 검색
          </a>
          <Link
            to="/privacy-center/sure-mark"
            className="inline-flex items-center gap-2 rounded-full border border-[#0F766E]/30 px-5 py-2.5 text-[13.5px] font-bold text-[#0F766E] hover:bg-[#ECFEFB]"
          >
            SURE 마크 안내
          </Link>
        </div>

        <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-[13.5px] text-text-secondary">
          {[
            "정부인증(CSAP) 온라인 정보 수집 SaaS 추천",
            "협단체 회원사 무료·할인 바우처",
            "SURE 안심마크 연계 운영",
            "협약 협단체 전용 가입 코드",
            "개인정보보호 교육·자가진단 연계",
          ].map((t) => (
            <li key={t} className="flex gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-[#E5E7EB]">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-privacy-green" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
