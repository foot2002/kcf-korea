import { ArrowRight, ClipboardCheck, FileSearch, ShieldCheck } from "lucide-react";
import { SURE_CHECK_URL } from "@/data/privacy-center";

export function SureSelfCheckLanding() {
  return (
    <section className="section-y">
      <div className="container-page max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <div className="label-eyebrow mb-4">SURE Self Check</div>
            <h2 className="text-navy">
              내가 받은 설문, 내가 만든 설문 —<br />
              개인정보를 제대로 지키고 있나요?
            </h2>
            <p className="privacy-desc mt-5">
              설문안심 SURE 자가진단은 응답자와 설문 운영자 모두가 온라인
              설문·접수 과정에서 개인정보가 적법하고 안전하게 처리되는지
              스스로 점검할 수 있도록 지원하는 SURE 사업입니다.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-soft-sky text-trust-blue">
                  <FileSearch className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="mt-4 text-[16px] font-bold text-navy">
                  내가 받은 설문 진단
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
                  참여한 설문이 개인정보를 과도하게 수집하거나 안전하지 않은
                  방식으로 운영되는지 확인합니다.
                </p>
              </div>
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-privacy-green">
                  <ClipboardCheck className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="mt-4 text-[16px] font-bold text-navy">
                  내가 만든 설문 진단
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
                  기관·기업이 운영하는 설문·접수가 수집 최소화, 동의, 보관·파기
                  기준을 충족하는지 점검합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-gradient-to-br from-[#04101F] via-[#071529] to-[#0B2540] p-8 text-white shadow-[0_24px_60px_rgba(11,31,58,0.18)]">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#5EEAD4]/15 blur-2xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#5EEAD4]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#5EEAD4] ring-1 ring-[#5EEAD4]/30">
                <ShieldCheck className="h-3.5 w-3.5" />
                Free Diagnosis
              </div>
              <h3 className="mt-5 text-[24px] font-bold text-white leading-snug">
                설문안심 SURE<br />자가진단 시작하기
              </h3>
              <p className="mt-4 text-[14.5px] leading-relaxed text-white/80">
                아래 버튼을 누르면 SURE 자가진단 서비스로 이동합니다.
                설문 URL을 입력하거나 운영 항목을 선택해 진단할 수 있습니다.
              </p>
              <a
                href={SURE_CHECK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5EEAD4] to-[#0F766E] px-6 py-4 text-[15px] font-bold text-[#04101F] shadow-[0_10px_30px_rgba(15,118,110,0.45)] transition hover:shadow-[0_14px_36px_rgba(94,234,212,0.55)] sm:w-auto"
              >
                진단하기
                <ArrowRight className="h-4 w-4" />
              </a>
              <p className="mt-4 text-[12.5px] text-white/55">
                본 진단은 법률 판단이 아닌 참고용 공익 안내입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
