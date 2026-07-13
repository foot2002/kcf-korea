import { createFileRoute } from "@tanstack/react-router";

import { AssociationApplyLanding } from "@/components/privacy/AssociationApplyLanding";

export const Route = createFileRoute("/privacy-center/association-apply")({
  head: () => ({
    meta: [
      { title: "협약/바우처 신청하기 | 개인정보보호진흥원" },
      {
        name: "description",
        content:
          "SURE START 협단체 개인정보보호 지원사업 상세 안내 및 협약/바우처 신청하기. 보안 인증 수집도구, SURE 마크, 회원사 지원 혜택을 확인하고 신청하세요.",
      },
      { property: "og:title", content: "협약/바우처 신청하기 | 개인정보보호진흥원" },
      { property: "og:url", content: "/privacy-center/association-apply" },
    ],
    links: [{ rel: "canonical", href: "/privacy-center/association-apply" }],
  }),
  component: AssociationApplyPage,
});

function AssociationApplyPage() {
  return <AssociationApplyLanding />;
}
