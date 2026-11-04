import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-center/policy/")({
  beforeLoad: () => {
    throw redirect({ to: "/privacy-center/research", hash: "policy", replace: true });
  },
});
