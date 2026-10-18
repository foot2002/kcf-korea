import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-center/voucher")({
  beforeLoad: () => {
    throw redirect({ to: "/privacy-center/support", hash: "association", replace: true });
  },
});
