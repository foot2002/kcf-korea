import { createFileRoute } from "@tanstack/react-router";
import { PrivacyHomeQuickNav } from "@/components/privacy/PrivacyHomeQuickNav";
import {
  PartnerLogosStrip,
  PrivacyHero,
} from "@/components/privacy/privacy-sections";

export const Route = createFileRoute("/privacy-center/")({
  head: () => ({
    meta: [
      { title: "개인정보보호진흥원 | 한국컨설팅산업재단" },
      {
        name: "description",
        content:
          "한국컨설팅산업재단 개인정보보호진흥원 — SURE 안심 인증, 협단체 지원 바우처, 설문안심 자가진단을 운영하는 공익 플랫폼입니다.",
      },
      { property: "og:title", content: "개인정보보호진흥원 | 한국컨설팅산업재단" },
      {
        property: "og:description",
        content:
          "온라인 설문·접수에서 국민 개인정보를 지키는 SURE 사업 — 안심마크, 바우처, 자가진단.",
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
      <PrivacyHomeQuickNav />
      <PartnerLogosStrip />
    </>
  );
}
