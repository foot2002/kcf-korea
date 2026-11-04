import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { EducationSeries } from "@/components/privacy/EducationSeriesView";
import { EDUCATION_PAGE } from "@/data/privacy-program";

export const Route = createFileRoute("/privacy-center/education/")({
  head: () => ({
    meta: [
      { title: `${EDUCATION_PAGE.title} | 개인정보보호진흥원` },
      { name: "description", content: EDUCATION_PAGE.description },
    ],
  }),
  component: function EducationPage() {
    return (
      <>
        <PrivacySubPageHeader title={EDUCATION_PAGE.title} description={EDUCATION_PAGE.description} />
        <EducationSeries />
      </>
    );
  },
});
