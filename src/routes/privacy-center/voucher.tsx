import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { SureStartAssociationSection } from "@/components/privacy/SureStartAssociationSection";
import { VoucherIntroSection } from "@/components/privacy/VoucherIntroSection";
import {
  PartnerLogosStrip,
  WiseOnTrustBanner,
} from "@/components/privacy/privacy-sections";

export const Route = createFileRoute("/privacy-center/voucher")({
  head: () => ({
    meta: [
      { title: "협단체 지원 바우처 사업 | 개인정보보호진흥원" },
      {
        name: "description",
        content:
          "SURE 사업의 온라인 설문솔루션 추천, 협단체·회원사 바우처 지원, 회원사 혜택 검색 및 협약/바우처 신청 안내.",
      },
      { property: "og:url", content: "/privacy-center/voucher" },
    ],
    links: [{ rel: "canonical", href: "/privacy-center/voucher" }],
  }),
  component: VoucherPage,
});

function VoucherPage() {
  return (
    <>
      <PrivacySubPageHeader
        eyebrow="SURE Voucher"
        title={
          <>
            협단체 지원<br />
            바우처 사업
          </>
        }
        description="SURE 사업은 검증된 온라인 설문솔루션을 추천하고, 협력 협단체와 회원사에
          무료·할인 바우처를 지원합니다. 협약/바우처 신청과 회원사 혜택을 확인해 보세요."
        dark
      />
      <VoucherIntroSection />
      <PartnerLogosStrip />
      <WiseOnTrustBanner />
      <SureStartAssociationSection />
    </>
  );
}
