import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { SecurityServicesView } from "@/components/privacy/SecurityServicesView";

export const Route = createFileRoute("/privacy-center/security-services")({
  head: () => ({
    meta: [
      { title: "우수 보안서비스 연계·보급 | 개인정보보호진흥원" },
      { name: "description", content: "CSAP, 국가정보원 도입 가능 목록, SURE Mark를 구분하고 연계 서비스를 안내합니다." },
    ],
  }),
  component: function SecurityPage() {
    return (
      <>
        <PrivacySubPageHeader eyebrow="Services" title="우수 보안서비스 연계·보급" description="진흥원의 안내는 특정 기업의 상업적 보증이 아닙니다. 확인되지 않은 인증번호는 표시하지 않습니다." dark visual="services" />
        <SecurityServicesView />
      </>
    );
  },
});
