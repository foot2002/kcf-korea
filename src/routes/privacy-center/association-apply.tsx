import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-center/association-apply")({
  beforeLoad: () => {
    throw redirect({ to: "/privacy-center/security-services", hash: "apply", replace: true });
  },
});
