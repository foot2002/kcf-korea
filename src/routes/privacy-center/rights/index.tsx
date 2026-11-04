import { createFileRoute } from "@tanstack/react-router";

import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { SUBPAGE_VISUALS } from "@/components/site/subpage-visuals";
import { RightsView } from "@/components/privacy/RightsViews";
import { MONITOR_PAGE } from "@/data/privacy-program";

export const Route = createFileRoute("/privacy-center/rights/")({
  head: () => ({
    meta: [
      { title: MONITOR_PAGE.metaTitle },
      { name: "description", content: MONITOR_PAGE.lead },
    ],
  }),
  component: function RightsPage() {
    return (
      <>
        <PrivacySubPageHeader title={MONITOR_PAGE.title} description={MONITOR_PAGE.lead} badge={MONITOR_PAGE.status} visual={SUBPAGE_VISUALS.rights} />
        <RightsView />
      </>
    );
  },
});
