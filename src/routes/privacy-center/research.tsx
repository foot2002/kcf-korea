import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { ResearchView } from "@/components/privacy/ResearchView";

export const Route = createFileRoute("/privacy-center/research")({
  head: () => ({
    meta: [
      { title: "개인정보보호 실태조사·연구 | 개인정보보호진흥원" },
      {
        name: "description",
        content:
          "2026년 공공기관 온라인 개인정보 수집 실태조사. 홈페이지 1,347개 기관 전수조사와 외부 설문폼 341건 진단 요약.",
      },
    ],
  }),
  component: function ResearchPage() {
    return (
      <>
        <PrivacySubPageHeader
          eyebrow="Research"
          title="개인정보보호 실태조사·연구"
          description="SURE-CHECK 자동진단과 전문가 재확인으로 공개된 수집 화면을 조사하고, 결과를 보고서로 공개합니다."
          dark
          visual="research"
        />
        <ResearchView />
      </>
    );
  },
});
