import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-center/voucher")({
  beforeLoad: () => {
    throw redirect({ to: "/privacy-center/security-services", hash: "association", replace: true });
  },
});
