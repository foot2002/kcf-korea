import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { SUBPAGE_VISUALS } from "@/components/site/subpage-visuals";
import { ResearchView } from "@/components/privacy/ResearchView";
import { RESEARCH_PAGE } from "@/data/privacy-program";

export const Route = createFileRoute("/privacy-center/research")({
  head: () => ({
    meta: [
      { title: `${RESEARCH_PAGE.title} | 개인정보보호진흥원` },
      {
        name: "description",
        content: RESEARCH_PAGE.description,
      },
    ],
  }),
  component: function ResearchPage() {
    return (
      <>
        <PrivacySubPageHeader title={RESEARCH_PAGE.title} description={RESEARCH_PAGE.description} visual={SUBPAGE_VISUALS.research} />
        <ResearchView />
      </>
    );
  },
});
