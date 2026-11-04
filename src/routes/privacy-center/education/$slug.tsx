import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { EducationSeries } from "@/components/privacy/EducationSeriesView";
import { EDUCATION_PAGE } from "@/data/privacy-program";
import { bundledEducation } from "@/lib/content/load";

export const Route = createFileRoute("/privacy-center/education/$slug")({
  head: ({ params }) => {
    const item = bundledEducation.find((education) => education.slug === params.slug);
    return {
      meta: [
        { title: `${item?.title ?? EDUCATION_PAGE.title} | 개인정보보호진흥원` },
        { name: "description", content: item?.summary ?? EDUCATION_PAGE.description },
      ],
    };
  },
  component: function EducationSlugPage() {
    const { slug } = Route.useParams();
    return (
      <>
        <PrivacySubPageHeader title={EDUCATION_PAGE.title} description={EDUCATION_PAGE.description} />
        <EducationSeries focusSlug={slug} />
      </>
    );
  },
});
