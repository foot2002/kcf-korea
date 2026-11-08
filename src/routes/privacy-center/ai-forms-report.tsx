import { createFileRoute } from "@tanstack/react-router";

import { AiFormsReportView } from "@/components/privacy/AiFormsReportView";
import { AI_FORMS_REPORT } from "@/data/ai-forms-report";
import { absoluteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/privacy-center/ai-forms-report")({
  head: () => ({
    meta: [
      { title: AI_FORMS_REPORT.metaTitle },
      { name: "description", content: AI_FORMS_REPORT.metaDescription },
      { property: "og:site_name", content: "개인정보보호진흥원" },
      { property: "og:title", content: AI_FORMS_REPORT.metaTitle },
      { property: "og:description", content: AI_FORMS_REPORT.metaDescription },
      { property: "og:url", content: absoluteUrl(AI_FORMS_REPORT.pagePath) },
      { property: "og:image", content: absoluteUrl(AI_FORMS_REPORT.shareImage) },
      { property: "og:image:secure_url", content: absoluteUrl(AI_FORMS_REPORT.shareImage) },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: AI_FORMS_REPORT.shareImageWidth },
      { property: "og:image:height", content: AI_FORMS_REPORT.shareImageHeight },
      { property: "og:image:alt", content: AI_FORMS_REPORT.shareImageAlt },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: AI_FORMS_REPORT.metaTitle },
      { name: "twitter:description", content: AI_FORMS_REPORT.metaDescription },
      { name: "twitter:image", content: absoluteUrl(AI_FORMS_REPORT.shareImage) },
      { name: "twitter:image:alt", content: AI_FORMS_REPORT.shareImageAlt },
    ],
    links: [{ rel: "canonical", href: absoluteUrl(AI_FORMS_REPORT.pagePath) }],
  }),
  component: AiFormsReportView,
});
