import { createFileRoute, redirect } from "@tanstack/react-router";
import { SellerDashboard } from "@/components/SellerDashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — Curated" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  return <SellerDashboard />;
}
