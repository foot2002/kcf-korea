import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { PolicyDetail } from "@/components/privacy/PolicyViews";
import { POLICY_ITEMS } from "@/data/privacy-program";

export const Route = createFileRoute("/privacy-center/policy/$slug")({
  head: ({ params }) => {
    const item = POLICY_ITEMS.find((policy) => policy.slug === params.slug);
    return {
      meta: [
        { title: `${item?.title ?? "정책 제안"} | 개인정보보호진흥원` },
        { name: "description", content: item?.summary ?? "개인정보보호진흥원 정책 제안" },
      ],
    };
  },
  component: function PolicySlugPage() {
    const { slug } = Route.useParams();
    return (
      <>
        <PrivacySubPageHeader eyebrow="Policy" title="정책 제안" visual="policy" />
        <PolicyDetail slug={slug} />
      </>
    );
  },
});
