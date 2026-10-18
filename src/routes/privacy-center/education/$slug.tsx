import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { EducationDetail } from "@/components/privacy/EducationViews";
import { EDUCATION_SEED } from "@/data/privacy-program";

export const Route = createFileRoute("/privacy-center/education/$slug")({
  head: ({ params }) => {
    const item = EDUCATION_SEED.find((education) => education.slug === params.slug);
    return {
      meta: [
        { title: `${item?.title ?? "교육"} | 개인정보보호진흥원` },
        { name: "description", content: item?.summary ?? "개인정보보호진흥원 교육" },
      ],
    };
  },
  component: function EducationSlugPage() {
    const { slug } = Route.useParams();
    return (
      <>
        <PrivacySubPageHeader eyebrow="Education" title="교육 상세" visual="education" />
        <EducationDetail slug={slug} />
      </>
    );
  },
});
