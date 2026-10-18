import { createFileRoute } from "@tanstack/react-router";
import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { PublicationDetail } from "@/components/privacy/PublicationViews";
import { PUBLICATION_SEED } from "@/data/privacy-program";

export const Route = createFileRoute("/privacy-center/publications/$slug")({
  head: ({ params }) => {
    const item = PUBLICATION_SEED.find((publication) => publication.slug === params.slug);
    return {
      meta: [
        { title: `${item?.title ?? "자료"} | 개인정보보호진흥원` },
        { name: "description", content: item?.summary ?? "개인정보보호진흥원 자료" },
      ],
    };
  },
  component: function PublicationSlugPage() {
    const { slug } = Route.useParams();
    return (
      <>
        <PrivacySubPageHeader eyebrow="Library" title="자료 상세" visual="publications" />
        <PublicationDetail slug={slug} />
      </>
    );
  },
});
