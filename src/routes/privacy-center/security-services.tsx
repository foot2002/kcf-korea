import { createFileRoute } from "@tanstack/react-router";

import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { SecurityServicesView } from "@/components/privacy/SecurityServicesView";
import { FREE_PLATFORM_PAGE, HERO } from "@/data/free-platform";
import { PRIVACY_CENTER_PAGES } from "@/data/privacy-center";

const toolGroup = PRIVACY_CENTER_PAGES.find((page) => page.to === "/privacy-center/security-services");
const toolChild = toolGroup?.children?.find((child) => child.to === "/privacy-center/security-services");

export const Route = createFileRoute("/privacy-center/security-services")({
  head: () => ({
    meta: [
      { title: `${FREE_PLATFORM_PAGE.title} | 개인정보보호진흥원` },
      { name: "description", content: HERO.sub },
    ],
  }),
  component: function SecurityPage() {
    return (
      <>
        <PrivacySubPageHeader
          title={FREE_PLATFORM_PAGE.title}
          description={FREE_PLATFORM_PAGE.description}
          badge={FREE_PLATFORM_PAGE.badge}
          crumbLabel={toolChild?.label}
          middleCrumbs={
            toolGroup
              ? [{ label: toolGroup.label, to: "/privacy-center/security-services" }]
              : undefined
          }
        />
        <SecurityServicesView />
      </>
    );
  },
});
