import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { EducationCatalog } from "@/components/privacy/EducationViews";

export const Route = createFileRoute("/privacy-center/education/")({
  head: () => ({
    meta: [
      { title: "교육·웨비나 | 개인정보보호진흥원" },
      { name: "description", content: "개인정보보호진흥원 교육과 웨비나. 접수 상태, 자료, 다시보기를 안내합니다." },
    ],
  }),
  component: function EducationPage() {
    return (
      <>
        <PrivacySubPageHeader eyebrow="Education" title="교육·웨비나" description="종료된 교육의 예상 참가 규모는 실적으로 표시하지 않습니다. 자료와 영상은 파일이 있을 때만 연결합니다." dark visual="education" />
        <EducationCatalog />
      </>
    );
  },
});
