import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { RightsView } from "@/components/privacy/RightsViews";

export const Route = createFileRoute("/privacy-center/rights/")({
  head: () => ({
    meta: [
      { title: "국민 개인정보 권익 보호 | 개인정보보호진흥원" },
      {
        name: "description",
        content: "국민 개인정보보호 모니터링단은 모집 예정입니다. 권리행사 안내와 합법적 공동의견을 운영합니다.",
      },
    ],
  }),
  component: function RightsPage() {
    return (
      <>
        <PrivacySubPageHeader
          eyebrow="Rights"
          title="국민 개인정보 권익 보호"
          description="모니터링과 제보는 개인정보 침해신고센터의 공식 신고를 대신하지 않습니다."
          dark
          visual="rights"
        />
        <RightsView />
      </>
    );
  },
});
