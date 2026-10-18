import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { SupportCampaignView } from "@/components/privacy/SupportCampaignView";

export const Route = createFileRoute("/privacy-center/support/")({
  head: () => ({
    meta: [
      { title: "기업·공공 지원·국민참여 캠페인 | 개인정보보호진흥원" },
      { name: "description", content: "협단체 바우처, 공공기관 지원, 주민자치 무료 지원 시범사업을 안내합니다." },
    ],
  }),
  component: function SupportPage() {
    return (
      <>
        <PrivacySubPageHeader eyebrow="Support" title="기업·공공 지원·국민참여 캠페인" description="기존 협단체 바우처와 신청 내역은 기업·협단체 지원으로 이어집니다. 확정되지 않은 지원은 시범사업(안)입니다." dark visual="support" />
        <SupportCampaignView />
      </>
    );
  },
});
