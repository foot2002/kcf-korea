import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { CampaignApply } from "@/components/privacy/SupportCampaignView";

const TYPES = ["association", "enterprise", "public", "civic"] as const;

export const Route = createFileRoute("/privacy-center/support/apply")({
  validateSearch: (search: Record<string, unknown>) => ({
    type: TYPES.includes(search.type as (typeof TYPES)[number]) ? (search.type as (typeof TYPES)[number]) : "association",
  }),
  head: () => ({
    meta: [
      { title: "지원 신청 | 개인정보보호진흥원" },
      { name: "description", content: "협단체, 기업, 공공기관, 주민자치 지원 신청과 접수 상태 조회." },
    ],
  }),
  component: function ApplyPage() {
    const { type } = Route.useSearch();
    return (
      <>
        <PrivacySubPageHeader eyebrow="Apply" title="지원 신청" description="협단체·기업·공공기관 신청은 기존 접수함에 저장됩니다. 주민자치 신청은 별도 절차로 심사합니다." visual="support" />
        <CampaignApply initial={type} />
      </>
    );
  },
});
