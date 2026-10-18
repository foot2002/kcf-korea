import { ArrowRight, ClipboardCheck, FileSearch } from "lucide-react";
import { SURE_CHECK_URL } from "@/data/privacy-center";
import { PcCtaBand, PcFeatureCard } from "@/components/privacy/privacy-ui";

export function SureSelfCheckLanding() {
  return (
    <section className="pc-section">
      <div className="container-page max-w-5xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <div className="pc-eyebrow">SURE CHECK</div>
            <h2 className="pc-section-title text-navy">
              내가 받은 설문, 내가 만든 설문 — 개인정보를 제대로 지키고 있나요?
            </h2>
            <p className="pc-body mt-5">
              설문안심 SURE 자가진단은 온라인 설문·접수 과정에서 개인정보가 적법하고
              안전하게 처리되는지 스스로 점검할 수 있도록 지원합니다.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <PcFeatureCard
                icon={FileSearch}
                title="내가 받은 설문 진단"
                desc="참여한 설문에서 확인할 수 있는 수집 항목과 안내 문구를 살펴봅니다. 유출이나 법령 위반을 확정하지 않습니다."
              />
              <PcFeatureCard
                icon={ClipboardCheck}
                title="내가 만든 설문 진단"
                desc="운영 중인 설문·접수의 수집 항목, 안내 문구, 보관·파기 표시를 점검합니다. 안내가 없다는 사실만으로 위법이라고 보지 않습니다."
              />
            </div>
          </div>

          <PcCtaBand
            title="설문안심 SURE 자가진단 시작하기"
            description="설문 URL을 입력하거나 운영 항목을 선택해 진단할 수 있습니다. 본 진단은 법률 판단이 아닌 참고용 공익 안내입니다."
            dark
          >
            <a
              href={SURE_CHECK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-light !text-[14px]"
            >
              자가진단 시작하기
              <ArrowRight className="ml-1 inline h-4 w-4" />
            </a>
          </PcCtaBand>
        </div>
      </div>
    </section>
  );
}
