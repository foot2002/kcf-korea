import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-center/self-check")({
  beforeLoad: () => {
    throw redirect({ to: "/privacy-center/sure-check", replace: true });
  },
});
