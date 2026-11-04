import { createFileRoute } from "@tanstack/react-router";

import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { SUBPAGE_VISUALS } from "@/components/site/subpage-visuals";
import { SureMarkView } from "@/components/privacy/SureMarkView";
import { PRIVACY_CENTER_PAGES } from "@/data/privacy-center";
import { SURE_MARK, SURE_MARK_PAGE } from "@/data/sure-mark";

const toolGroup = PRIVACY_CENTER_PAGES.find((page) => page.to === "/privacy-center/security-services");
const toolChild = toolGroup?.children?.find((child) => child.to === "/privacy-center/sure-mark");

export const Route = createFileRoute("/privacy-center/sure-mark")({
  validateSearch: (search: Record<string, unknown>): { no?: string } => ({
    no: typeof search.no === "string" && search.no.length > 0 ? search.no : undefined,
  }),
  head: () => ({
    meta: [
      { title: SURE_MARK_PAGE.metaTitle },
      { name: "description", content: `${SURE_MARK_PAGE.descriptionLead} ${SURE_MARK.disclaimer}` },
    ],
  }),
  component: function SureMarkPage() {
    const { no } = Route.useSearch();
    return (
      <>
        <PrivacySubPageHeader
          title={SURE_MARK_PAGE.title}
          description={`${SURE_MARK_PAGE.descriptionLead} ${SURE_MARK.disclaimer}`}
          visual={SUBPAGE_VISUALS.sureMark}
          crumbLabel={toolChild?.label}
          middleCrumbs={
            toolGroup ? [{ label: toolGroup.label, to: "/privacy-center/security-services" }] : undefined
          }
        />
        <SureMarkView initialCertNo={no ?? ""} />
      </>
    );
  },
});
