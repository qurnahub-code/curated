import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Sign In — Curated" }],
  }),
  component: Login,
});

function Login() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-12">
      <AuthForm initialAuthState="login" />
    </div>
  );
}
