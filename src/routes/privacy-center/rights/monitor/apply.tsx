import { createFileRoute } from "@tanstack/react-router";

import { MonitorPreapplyForm } from "@/components/forms/PublicForms";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { MONITOR_PAGE } from "@/data/privacy-program";

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
        <section className="border-t border-[#D1D5DB] bg-white">
          <div className="container-page max-w-3xl py-12 md:py-16">
            <MonitorPreapplyForm />
          </div>
        </section>
      </>
    );
  },
});
