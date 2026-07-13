import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import {
  PrivacyFAQ,
  PrivacyLawChangeSection,
  PrivacyMissionSection,
} from "@/components/privacy/privacy-sections";

export const Route = createFileRoute("/privacy-center/law")({
  head: () => ({
    meta: [
      { title: "개인정보보호법/제도 | 개인정보보호진흥원" },
      {
        name: "description",
        content:
          "온라인 설문·수집에서 알아야 할 개인정보보호법과 제도 변화, 실무 Q&A를 안내합니다.",
      },
      { property: "og:url", content: "/privacy-center/law" },
    ],
    links: [{ rel: "canonical", href: "/privacy-center/law" }],
  }),
  component: PrivacyLawPage,
});

function PrivacyLawPage() {
  return (
    <>
      <PrivacySubPageHeader
        eyebrow="Privacy Law & Policy"
        title="개인정보보호법과 온라인 설문·수집 제도"
        description="온라인 설문, 행사 접수, 교육 신청 등 일상 업무에서도 개인정보 보호가
          필요합니다. 개인정보보호 환경 변화와 실무에서 자주 묻는 질문을 정리했습니다."
      />
      <PrivacyMissionSection />
      <PrivacyLawChangeSection />
      <PrivacyFAQ />
    </>
  );
}
