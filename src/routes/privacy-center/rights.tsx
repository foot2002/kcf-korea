import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-center/rights")({
  component: function RightsLayout() {
    return <Outlet />;
  },
});
