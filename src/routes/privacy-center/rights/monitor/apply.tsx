import { createFileRoute } from "@tanstack/react-router";

import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { MonitorApplyForm, MonitorApplyStatic } from "@/components/privacy/RightsViews";
import { MONITOR_PAGE } from "@/data/privacy-program";
import { isStaticGitHubPages } from "@/lib/privacy-inquiry/env";

export const Route = createFileRoute("/privacy-center/rights/monitor/apply")({
  head: () => ({
    meta: [
      { title: `${MONITOR_PAGE.preApply.title} | 개인정보보호진흥원` },
      { name: "description", content: MONITOR_PAGE.preApply.body },
    ],
  }),
  component: function MonitorApplyPage() {
    return (
      <>
        <PrivacySubPageHeader
          title={MONITOR_PAGE.preApply.title}
          description={MONITOR_PAGE.preApply.body}
          badge={MONITOR_PAGE.status}
        />
        {isStaticGitHubPages ? <MonitorApplyStatic /> : <MonitorApplyForm />}
      </>
    );
  },
});
