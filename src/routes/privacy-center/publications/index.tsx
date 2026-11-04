import { createFileRoute } from "@tanstack/react-router";

import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { SUBPAGE_VISUALS } from "@/components/site/subpage-visuals";
import { PublicationsBoard } from "@/components/privacy/PublicationViews";
import { PUBLICATIONS_PAGE } from "@/data/privacy-home";

export const Route = createFileRoute("/privacy-center/publications/")({
  head: () => ({
    meta: [
      { title: PUBLICATIONS_PAGE.metaTitle },
      { name: "description", content: PUBLICATIONS_PAGE.description },
    ],
  }),
  component: function PublicationsPage() {
    return (
      <>
        <PrivacySubPageHeader title={PUBLICATIONS_PAGE.title} description={PUBLICATIONS_PAGE.description} visual={SUBPAGE_VISUALS.publications} />
        <PublicationsBoard />
      </>
    );
  },
});
