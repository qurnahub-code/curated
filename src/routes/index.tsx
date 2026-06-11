import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag, LayoutDashboard, Sparkles, LogOut, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/ProductGrid";
import { SellerDashboard } from "@/components/SellerDashboard";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/lib/AuthContext";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Curated — Digital Marketplace" },
      { name: "description", content: "Buy and sell premium digital products, templates, and creative assets." },
      { property: "og:title", content: "Curated — Digital Marketplace" },
      { property: "og:description", content: "Buy and sell premium digital products, templates, and creative assets." },
    ],
  }),
  component: Index,
});

type ViewMode = "browse" | "login" | "signup" | "dashboard";

function Index() {
  const [mode, setMode] = useState<ViewMode>("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const { session, isLoading, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setMode("browse")}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Sparkles className="h-5 w-5 text-primary" />
            <span
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Curated
            </span>
          </button>

          <div className="flex items-center gap-2">
            {!session ? (
              <div className="flex items-center gap-2">
                <Button
                  variant={mode === "login" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setMode("login")}
                  className="font-body gap-1.5 cursor-pointer"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
                <Button
                  variant={mode === "signup" ? "secondary" : "default"}
                  size="sm"
                  onClick={() => setMode("signup")}
                  className="font-body gap-1.5 cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant={mode === "browse" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setMode("browse")}
                  className="font-body gap-1.5 cursor-pointer hidden sm:flex"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Storefront
                </Button>
                <Button
                  variant={mode === "dashboard" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setMode("dashboard")}
                  className="font-body gap-1.5 cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="font-body gap-1.5 cursor-pointer ml-2"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : mode === "login" ? (
          <div className="flex min-h-[60vh] items-center justify-center py-12">
            <AuthForm initialAuthState="login" />
          </div>
        ) : mode === "signup" ? (
          <div className="flex min-h-[60vh] items-center justify-center py-12">
            <AuthForm initialAuthState="signup" />
          </div>
        ) : mode === "dashboard" && session ? (
          <SellerDashboard />
        ) : (
          <div className="flex flex-col gap-8">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary to-accent/10 p-8 sm:p-12">
              <div className="relative z-10 max-w-xl">
                <h1
                  className="text-3xl font-bold tracking-tight sm:text-4xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Discover premium digital products
                </h1>
                <p className="mt-3 font-body text-base text-muted-foreground">
                  Browse thousands of templates, UI kits, icons, fonts, and creative assets from top makers.
                </p>
              </div>
              <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-12 -right-6 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
            </section>

            <ProductGrid
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Curated
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              {session && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={signOut}
                  className="font-body text-xs text-muted-foreground hover:text-foreground h-auto p-0 cursor-pointer"
                >
                  Log Out
                </Button>
              )}
              <p className="font-body text-xs text-muted-foreground">
                © {new Date().getFullYear()} Curated Marketplace. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
