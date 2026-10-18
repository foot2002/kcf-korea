import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { MonitorApplyForm } from "@/components/privacy/RightsViews";

export const Route = createFileRoute("/privacy-center/rights/monitor/apply")({
  head: () => ({
    meta: [
      { title: "모니터링단 사전 신청 | 개인정보보호진흥원" },
      { name: "description", content: "국민 개인정보보호 모니터링단 사전 참여 신청과 접수 상태 조회." },
    ],
  }),
  component: function MonitorApplyPage() {
    return (
      <>
        <PrivacySubPageHeader eyebrow="모집 예정" title="모니터링단 사전 신청" description="선발 공지 전입니다. 피해 경위와 민감정보는 받지 않습니다." visual="rights" />
        <MonitorApplyForm />
      </>
    );
  },
});
