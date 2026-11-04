import { createFileRoute } from "@tanstack/react-router";

import { FoundationHome } from "@/components/site/FoundationHome";
import { FOUNDATION_META_TITLE } from "@/data/kcf";
import { absoluteUrl } from "@/lib/site-url";

const description =
  "재단법인 한국컨설팅산업재단(KCF)은 컨설팅 산업 육성, 기업 경쟁력 강화, 미래 인재 양성을 통해 국가 지식경제 발전에 기여하는 비영리 공익법인입니다.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: FOUNDATION_META_TITLE },
      { name: "description", content: description },
      { property: "og:title", content: "한국컨설팅산업재단 (KCF)" },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl("/") },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
  }),
  component: FoundationHome,
});
