import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { PublicationLibrary } from "@/components/privacy/PublicationViews";

export const Route = createFileRoute("/privacy-center/publications/")({
  head: () => ({
    meta: [
      { title: "보도자료·연구보고서 | 개인정보보호진흥원" },
      { name: "description", content: "개인정보보호진흥원의 연구보고서, 정책 제안, 법령 해설, 언론보도 자료실." },
    ],
  }),
  component: function PublicationsPage() {
    return (
      <>
        <PrivacySubPageHeader eyebrow="Library" title="보도자료·연구보고서" description="파일이 없는 자료에는 다운로드 버튼을 두지 않습니다." dark visual="publications" />
        <PublicationLibrary />
      </>
    );
  },
});
