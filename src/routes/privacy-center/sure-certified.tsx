import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { SureCertifiedPartnersContent } from "@/components/privacy/SureCertifiedPartnersContent";

export const Route = createFileRoute("/privacy-center/sure-certified")({
  head: () => ({
    meta: [
      { title: "안심인증 기업 | 개인정보보호진흥원" },
      {
        name: "description",
        content:
          "개인정보 전문 로펌·보안·솔루션 기업으로 구성된 안심인증 파트너와 안심 파트너 심사 신청을 안내합니다.",
      },
      { property: "og:url", content: "/privacy-center/sure-certified" },
    ],
    links: [{ rel: "canonical", href: "/privacy-center/sure-certified" }],
  }),
  component: SureCertifiedPage,
});

function SureCertifiedPage() {
  return (
    <>
      <PrivacySubPageHeader
        eyebrow="Sure Certified"
        title="안심인증 기업"
        description="개인정보 법률, 보안, 조사·협업 솔루션 등 전문 분야에서 검증된 기업들과 함께 안심 파트너 네트워크를 운영합니다."
      />
      <SureCertifiedPartnersContent />
    </>
  );
}
