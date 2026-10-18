import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PRIVACY_VISUALS } from "@/components/privacy/privacy-visuals";
import { contactPage, privacyOffice, publicInterestCorporation } from "@/data/kcf";

const PLANS = [
  {
    visual: "research" as const,
    num: "01",
    title: "실태조사·연구",
    status: "결과 공개",
    purpose: "공개된 수집 화면을 같은 기준으로 보고, 결과와 한계를 함께 남깁니다.",
    now: "2026년 공공기관 조사 결과를 연구 페이지에서 공개하고 있습니다.",
    next: "조사 단위를 유지한 채 다음 조사의 범위와 일정을 정합니다.",
    to: "/privacy-center/research" as const,
  },
  {
    visual: "rights" as const,
    num: "02",
    title: "국민 권익 보호",
    status: "모집 예정",
    purpose: "국민이 자신의 권리를 알고, 공개된 화면의 우려를 함께 살피게 합니다.",
    now: "모니터링단은 선발 전입니다. 지금은 사전 접수만 받습니다.",
    next: "선발 공지 뒤 공개 화면 점검과 권리행사 안내를 시작합니다.",
    to: "/privacy-center/rights" as const,
  },
  {
    visual: "services" as const,
    num: "03",
    title: "우수 보안서비스",
    status: "안내 중",
    purpose: "기관이 인증 종류와 서비스 범위를 구분해 안전한 수집 환경을 고르게 합니다.",
    now: "SURE-CHECK, SURE Mark, 협력 서비스를 안내합니다.",
    next: "선정기준을 공개한 상태로 교육과 서비스 안내를 넓힙니다.",
    to: "/privacy-center/security-services" as const,
  },
  {
    visual: "policy" as const,
    num: "04",
    title: "정책 제안",
    status: "제안",
    purpose: "조사에서 확인한 공백을 제도 논의로 올립니다.",
    now: "여섯 가지 제안을 올려 두었고, 후속은 질의 예정입니다.",
    next: "실제로 질의하고 회신이 오면 그 사실만 기록합니다.",
    to: "/privacy-center/policy" as const,
  },
  {
    visual: "support" as const,
    num: "05",
    title: "기업·공공·국민 참여",
    status: "운영·시범",
    purpose: "기업, 공공기관, 주민자치 모임이 안전한 수집을 시작하도록 돕습니다.",
    now: "협단체 지원은 운영 중이고, 공공·주민자치 지원은 시범사업(안)입니다.",
    next: "직인만으로 승인하지 않고, 행사 단위로 심사한 뒤 사용권을 발급합니다.",
    to: "/privacy-center/support" as const,
  },
  {
    visual: "education" as const,
    num: "06",
    title: "교육·공개 자료",
    status: "지난 교육 종료",
    purpose: "실무자가 보호 기준을 현장에 적용하는 방법을 교육과 자료로 나눕니다.",
    now: "9월 실전 교육은 종료되었습니다. 자료는 파일이 있을 때만 연결합니다.",
    next: "다음 교육은 일정이 정해진 뒤에 접수를 엽니다.",
    to: "/privacy-center/education" as const,
  },
];

const PATH = [
  { title: "조사", text: "공개된 화면을 확인하고 한계와 함께 공개합니다." },
  { title: "참여", text: "국민 모니터링단 선발 후 권리행사 안내를 시작합니다." },
  { title: "확산", text: "기관과 모임이 검증 가능한 서비스를 고를 수 있게 합니다." },
  { title: "제도", text: "확인된 공백은 제안으로 올리고, 질의와 회신을 구분합니다." },
];

export function PrivacyCenterHomeSections() {
  const guardian = PRIVACY_VISUALS.rights;

  return (
    <>
      <section id="programs" className="section-y bg-white">
        <div className="container-page">
          <div className="max-w-2xl">
            <div className="label-eyebrow mb-4">하는 일</div>
            <h2 className="text-navy">여섯 가지 사업, 각각의 목적</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
              개인정보보호진흥원은 조사, 국민 참여, 서비스 안내, 제도 개선을 잇는 민간 공익조직입니다.
              각 사업의 지금과 다음 단계만 먼저 보여 드립니다.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {PLANS.map((plan) => {
              const art = PRIVACY_VISUALS[plan.visual];
              return (
                <Link
                  key={plan.num}
                  to={plan.to}
                  className="group flex flex-col overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                >
                  <div className="bg-[var(--pc-soft-blue)]">
                    <img
                      src={art.src}
                      alt={art.alt}
                      className={`w-full ${art.fit === "contain" ? "h-52 object-contain p-3" : "h-48 object-cover"}`}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[12px] font-bold text-[#0F766E]">{plan.num}</span>
                      <span className="rounded-full bg-[var(--pc-soft-blue)] px-3 py-1 text-[12px] font-bold text-navy">{plan.status}</span>
                    </div>
                    <h3 className="mt-3 text-[22px] font-bold text-navy">{plan.title}</h3>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-text-secondary">{plan.purpose}</p>
                    <dl className="mt-5 space-y-3 text-[13.5px] leading-relaxed">
                      <div>
                        <dt className="font-bold text-navy">지금</dt>
                        <dd className="mt-1 text-text-secondary">{plan.now}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-navy">다음</dt>
                        <dd className="mt-1 text-text-secondary">{plan.next}</dd>
                      </div>
                    </dl>
                    <span className="mt-5 inline-flex items-center text-[14px] font-bold text-trust-blue">
                      이 사업 보기 <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[var(--pc-navy)] text-white">
        <div className="container-page py-14 md:py-16">
          <div className="label-eyebrow mb-4 !text-teal-300">앞으로의 흐름</div>
          <h2 className="text-white">조사에서 참여로, 참여에서 제도로</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {PATH.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-[12px] font-bold text-teal-200">0{index + 1}</div>
                <h3 className="mt-2 text-[20px] font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/75">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="guardian" className="section-y bg-[var(--pc-soft-blue)]">
        <div className="container-page grid items-center gap-8 overflow-hidden rounded-[32px] bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] md:p-10 lg:grid-cols-[0.8fr_1.2fr]">
          <img src={guardian.src} alt={guardian.alt} className="mx-auto h-auto w-full max-w-[320px] object-contain" />
          <div>
            <div className="label-eyebrow mb-4">국민 개인정보 지키미</div>
            <h2 className="text-navy">공개된 화면을 함께 살피는 국민 참여</h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-text-secondary">
              모니터링단은 아직 모집 전입니다. 사전 신청은 선발 공지가 나오기 전의 접수이며,
              피해 경위나 민감한 개인정보는 받지 않습니다. 공식 신고는 privacy.go.kr 또는 118입니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/privacy-center/rights" className="btn-primary-kcf">
                권익 보호 사업
              </Link>
              <Link to="/privacy-center/rights/monitor/apply" className="btn-secondary-kcf">
                사전 참여 신청
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-white">
        <div className="container-page grid gap-6 py-12 md:grid-cols-[1.4fr_0.8fr] md:items-center">
          <div>
            <p className="text-[13px] font-bold text-[#0F766E]">운영</p>
            <h2 className="mt-2 text-[26px] font-bold text-navy">
              {publicInterestCorporation.displayName} 산하
            </h2>
            <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-text-secondary">
              개인정보보호진흥원은 정부 규제기관이 아닙니다. 조사 결과만으로 위법이나 유출을 단정하지 않습니다.
            </p>
          </div>
          <div className="rounded-2xl bg-[var(--pc-soft-blue)] p-5 text-[14px] leading-relaxed text-navy">
            <p className="font-bold">문의</p>
            <p className="mt-2">{contactPage.privacyOffice.tel}</p>
            <p>{privacyOffice.email}</p>
            <Link to="/contact" className="mt-3 inline-flex font-bold text-trust-blue">
              연락처 페이지
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
