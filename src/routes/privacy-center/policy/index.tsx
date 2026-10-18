import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { PolicyBoard } from "@/components/privacy/PolicyViews";

export const Route = createFileRoute("/privacy-center/policy/")({
  head: () => ({
    meta: [
      { title: "정책 제안·제도 개선 | 개인정보보호진흥원" },
      { name: "description", content: "2026년 공공기관 온라인 개인정보 수집 실태조사에 기초한 여섯 가지 정책 제안." },
    ],
  }),
  component: function PolicyPage() {
    return (
      <>
        <PrivacySubPageHeader eyebrow="Policy" title="정책 제안·제도 개선" description="질의하지 않은 사안은 질의 예정으로 두고, 배포 전 의원실 보도자료는 게시하지 않습니다." dark visual="policy" />
        <PolicyBoard />
      </>
    );
  },
});
