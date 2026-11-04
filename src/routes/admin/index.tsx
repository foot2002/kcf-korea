import { createFileRoute } from "@tanstack/react-router";

import { GithubContentAdmin } from "@/components/admin/GithubContentAdmin";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "콘텐츠 관리 | 개인정보보호진흥원" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: GithubContentAdmin,
});
