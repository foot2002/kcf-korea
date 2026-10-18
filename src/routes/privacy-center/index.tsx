import { createFileRoute } from "@tanstack/react-router";
import { PrivacyCenterHomeSections } from "@/components/privacy/PrivacyCenterHomeSections";
import { PrivacyHero } from "@/components/privacy/privacy-sections";

export const Route = createFileRoute("/privacy-center/")({
  head: () => ({
    meta: [
      { title: "개인정보보호진흥원 | 한국컨설팅산업재단" },
      {
        name: "description",
        content:
          "한국컨설팅산업재단 산하 민간 공익조직인 개인정보보호진흥원. 개인정보 보호 실태 조사, 국민 권리 지원, 안전한 서비스 확산과 제도 개선을 추진합니다.",
      },
      { property: "og:title", content: "개인정보보호진흥원 | 한국컨설팅산업재단" },
      {
        property: "og:description",
        content: "개인정보를 지키는 변화, 조사에서 정책으로, 국민의 참여로.",
      },
      { property: "og:url", content: "/privacy-center" },
    ],
    links: [{ rel: "canonical", href: "/privacy-center" }],
  }),
  component: PrivacyCenterHomePage,
});

function PrivacyCenterHomePage() {
  return (
    <>
      <PrivacyHero />
      <PrivacyCenterHomeSections />
    </>
  );
}
