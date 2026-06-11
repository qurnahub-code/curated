import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag, Store, Sparkles } from "lucide-react";
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

type ViewMode = "browse" | "sell";

function Index() {
  const [mode, setMode] = useState<ViewMode>("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const { session, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Curated
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-1">
            <Button
              variant={mode === "browse" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("browse")}
              className={`font-body gap-1.5 ${
                mode === "browse"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              Browse
            </Button>
            <Button
              variant={mode === "sell" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("sell")}
              className={`font-body gap-1.5 ${
                mode === "sell"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Store className="h-4 w-4" />
              Sell
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {mode === "browse" ? (
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
        ) : isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : session ? (
          <SellerDashboard />
        ) : (
          <div className="flex min-h-[60vh] items-center justify-center py-12">
            <AuthForm />
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
            <p className="font-body text-xs text-muted-foreground">
              © {new Date().getFullYear()} Curated Marketplace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
