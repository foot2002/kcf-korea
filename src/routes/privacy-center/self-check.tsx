import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { SureSelfCheckLanding } from "@/components/privacy/SureSelfCheckLanding";

export const Route = createFileRoute("/privacy-center/self-check")({
  head: () => ({
    meta: [
      { title: "설문안심 SURE 자가진단 | 개인정보보호진흥원" },
      {
        name: "description",
        content:
          "내가 받은 설문, 내가 만든 설문이 개인정보를 제대로 지키고 있는지 SURE 자가진단으로 점검합니다.",
      },
      { property: "og:url", content: "/privacy-center/self-check" },
    ],
    links: [{ rel: "canonical", href: "/privacy-center/self-check" }],
  }),
  component: SelfCheckPage,
});

function SelfCheckPage() {
  return (
    <>
      <PrivacySubPageHeader
        eyebrow="SURE Self Check"
        title="설문안심 SURE 자가진단"
        description="응답자와 설문 운영자 모두가 온라인 설문·수집 과정의 개인정보 보호 수준을
          스스로 점검할 수 있는 SURE 사업입니다."
      />
      <SureSelfCheckLanding />
    </>
  );
}
