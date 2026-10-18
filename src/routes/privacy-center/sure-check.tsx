import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { SureSelfCheckLanding } from "@/components/privacy/SureSelfCheckLanding";
import { OrgNotice } from "@/components/privacy/survey-visuals";

export const Route = createFileRoute("/privacy-center/sure-check")({
  head: () => ({
    meta: [
      { title: "SURE-CHECK 자가진단 | 개인정보보호진흥원" },
      {
        name: "description",
        content: "공개된 설문·신청 화면을 SURE-CHECK로 살펴봅니다. 진단은 유출이나 법령 위반을 확정하지 않습니다.",
      },
    ],
  }),
  component: function SureCheckPage() {
    return (
      <>
        <PrivacySubPageHeader
          eyebrow="SURE-CHECK"
          title="SURE-CHECK 자가진단"
          description="자동진단은 화면의 안내와 문항을 살피는 도구입니다. 결과만으로 개인정보 유출이나 법 위반을 확인했다고 보지 않습니다."
          dark
          visual="services"
        />
        <SureSelfCheckLanding />
        <div className="container-page pb-16">
          <OrgNotice />
        </div>
      </>
    );
  },
});
