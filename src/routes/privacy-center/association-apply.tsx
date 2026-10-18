import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-center/association-apply")({
  beforeLoad: () => {
    throw redirect({ to: "/privacy-center/support/apply", search: { type: "association" }, replace: true });
  },
});
