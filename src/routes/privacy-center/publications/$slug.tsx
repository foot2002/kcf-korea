import { createFileRoute } from "@tanstack/react-router";

import { PrivacySubPageHeader } from "@/components/privacy/PrivacySubPageHeader";
import { PublicationDetail } from "@/components/privacy/PublicationViews";
import { PUBLICATIONS_PAGE } from "@/data/privacy-home";
import { bundledPublications, usePublications } from "@/lib/content/load";

export const Route = createFileRoute("/privacy-center/publications/$slug")({
  head: ({ params }) => {
    const item = bundledPublications.find((publication) => publication.slug === params.slug);
    return {
      meta: [
        { title: `${item?.title ?? PUBLICATIONS_PAGE.title} | 개인정보보호진흥원` },
        { name: "description", content: item?.summary ?? PUBLICATIONS_PAGE.description },
      ],
    };
  },
  component: function PublicationSlugPage() {
    const { slug } = Route.useParams();
    const publications = usePublications();
    const item = publications.find((publication) => publication.slug === slug);
    return (
      <>
        <PrivacySubPageHeader
          title={item?.title ?? PUBLICATIONS_PAGE.notFound}
          description={item ? `${item.boardType} · ${item.source}` : undefined}
          crumbLabel={item?.title}
          middleCrumbs={[{ label: PUBLICATIONS_PAGE.detailBack, to: "/privacy-center/publications" }]}
        />
        <PublicationDetail slug={slug} />
      </>
    );
  },
});
