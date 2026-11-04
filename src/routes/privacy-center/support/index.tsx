import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-center/support/")({
  beforeLoad: () => {
    throw redirect({ to: "/privacy-center/security-services", replace: true });
  },
});
