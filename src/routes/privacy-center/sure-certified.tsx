import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-center/sure-certified")({
  beforeLoad: () => {
    throw redirect({ to: "/privacy-center/security-services", hash: "partners", replace: true });
  },
});
