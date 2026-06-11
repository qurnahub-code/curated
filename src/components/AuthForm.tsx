import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type AuthState = "login" | "signup" | "forgot_password";

interface AuthFormProps {
  initialAuthState?: AuthState;
}

export function AuthForm({ initialAuthState = "login" }: AuthFormProps) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authState === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Successfully logged in!");
      } else if (authState === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
            },
          },
        });
        if (error) throw error;
        toast.success("Check your email for the confirmation link!");
        setAuthState("login");
      } else if (authState === "forgot_password") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password reset instructions sent to your email!");
        setAuthState("login");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight font-display">
          {authState === "login" && "Welcome back"}
          {authState === "signup" && "Create an account"}
          {authState === "forgot_password" && "Reset Password"}
        </h1>
        <p className="text-sm text-muted-foreground font-body">
          {authState === "login" && "Enter your email to sign in to your seller dashboard"}
          {authState === "signup" && "Enter your details below to create your seller account"}
          {authState === "forgot_password" && "Enter your email to receive a password reset link"}
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            {authState === "signup" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isLoading}
                    required
                    className="font-body"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                    required
                    className="font-body"
                  />
                </div>
              </>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="font-body"
              />
            </div>

            {authState !== "forgot_password" && (
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {authState === "login" && (
                    <button
                      type="button"
                      onClick={() => setAuthState("forgot_password")}
                      className="text-xs text-muted-foreground hover:text-primary font-body underline underline-offset-4"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="font-body"
                />
              </div>
            )}
            
            <Button disabled={isLoading} className="font-body mt-2">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {authState === "login" && "Sign In"}
              {authState === "signup" && "Sign Up"}
              {authState === "forgot_password" && "Send Reset Link"}
            </Button>
          </div>
        </form>

        {authState === "login" && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-body">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              type="button"
              disabled={isLoading}
              onClick={() => toast.info("Google OAuth requires Supabase dashboard configuration.")}
              className="font-body"
            >
              Google
            </Button>
          </>
        )}
      </div>

      <p className="px-8 text-center text-sm text-muted-foreground font-body">
        {authState === "login" ? "Don't have an account? " : 
         authState === "signup" ? "Already have an account? " : "Remember your password? "}
        <button
          type="button"
          onClick={() => setAuthState(authState === "login" ? "signup" : "login")}
          className="underline underline-offset-4 hover:text-primary font-medium"
        >
          {authState === "login" ? "Sign Up" : "Sign In"}
        </button>
      </p>
    </div>
  );
}
