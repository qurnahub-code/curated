import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/AuthForm";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [{ title: "Sign Up — Curated" }],
  }),
  component: SignUp,
});

function SignUp() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-12">
      <AuthForm initialAuthState="signup" />
    </div>
  );
}
