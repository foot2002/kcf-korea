import { createFileRoute } from "@tanstack/react-router";

import { PrivacyCenterHome } from "@/components/privacy/home/PrivacyCenterHome";
import { HERO } from "@/data/free-platform";
import { HOME_UI } from "@/data/privacy-home";
import { absoluteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/privacy-center/")({
  head: () => ({
    meta: [
      { title: HOME_UI.pageTitle },
      { name: "description", content: HERO.sub },
      { property: "og:title", content: HOME_UI.pageTitle },
      { property: "og:description", content: HERO.sub },
      { property: "og:url", content: absoluteUrl("/privacy-center") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/privacy-center") }],
  }),
  component: PrivacyCenterHome,
});
