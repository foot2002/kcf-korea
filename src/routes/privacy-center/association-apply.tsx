import { createFileRoute } from "@tanstack/react-router";

import { AssociationApplyLanding } from "@/components/privacy/AssociationApplyLanding";

export const Route = createFileRoute("/privacy-center/association-apply")({
  head: () => ({
    meta: [
      { title: "SURE START 협단체 지원사업 | 개인정보보호진흥원" },
      {
        name: "description",
        content:
          "SURE START 협단체 개인정보보호 지원사업 상세 안내 및 협약 신청. WiseON, SURE 마크, 회원사 지원 혜택을 확인하고 협약을 신청하세요.",
      },
      { property: "og:title", content: "SURE START 협단체 지원사업 | 개인정보보호진흥원" },
      { property: "og:url", content: "/privacy-center/association-apply" },
    ],
    links: [{ rel: "canonical", href: "/privacy-center/association-apply" }],
  }),
  component: AssociationApplyPage,
});

function AssociationApplyPage() {
  return <AssociationApplyLanding />;
}
