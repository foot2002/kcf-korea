import { createFileRoute } from "@tanstack/react-router";

import { AiFormsReportView } from "@/components/privacy/AiFormsReportView";
import { AI_FORMS_REPORT } from "@/data/ai-forms-report";
import { absoluteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/privacy-center/ai-forms-report")({
  head: () => ({
    meta: [
      { title: AI_FORMS_REPORT.metaTitle },
      { name: "description", content: AI_FORMS_REPORT.metaDescription },
      { property: "og:title", content: AI_FORMS_REPORT.metaTitle },
      { property: "og:description", content: AI_FORMS_REPORT.metaDescription },
      { property: "og:url", content: absoluteUrl(AI_FORMS_REPORT.pagePath) },
      { property: "og:image", content: absoluteUrl("/og/og-ai-forms-report.png") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl(AI_FORMS_REPORT.pagePath) }],
  }),
  component: AiFormsReportView,
});
