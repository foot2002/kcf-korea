import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
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
        description="SURE 안심마크는 SURE 사업을 통해 안전한 온라인 조사·접수를 운영하는
          기관·기업에 부여하는 개인정보보호 인증 마크입니다."
      />
      <SafeSurveyMarkDetail />
    </>
  );
}
