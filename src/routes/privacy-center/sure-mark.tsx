import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { SureMarkExtra } from "@/components/privacy/SecurityServicesView";
import { SafeSurveyMarkDetail } from "@/components/privacy/privacy-sections";

export const Route = createFileRoute("/privacy-center/sure-mark")({
  head: () => ({
    meta: [
      { title: "안심 인증 SURE Mark | 개인정보보호진흥원" },
      {
        name: "description",
        content:
          "개인정보보호 SURE 안심마크의 의미, 부여 대상, 운영 기준과 부여 흐름을 안내합니다.",
      },
      { property: "og:url", content: "/privacy-center/sure-mark" },
    ],
    links: [{ rel: "canonical", href: "/privacy-center/sure-mark" }],
  }),
  component: SureMarkPage,
});

function SureMarkPage() {
  return (
    <>
      <PrivacySubPageHeader
        eyebrow="SURE Mark"
        title="안심 인증 SURE Mark란?"
        description="SURE Mark는 개인정보보호진흥원이 부여하는 민간 자체 표시입니다. 법정 인증이나 정부 인증을 대신하지 않습니다."
        visual="services"
      />
      <SafeSurveyMarkDetail />
      <SureMarkExtra />
    </>
  );
}
