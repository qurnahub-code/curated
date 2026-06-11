import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProductGrid } from "@/components/ProductGrid";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Curated — Digital Marketplace" },
      { name: "description", content: "Buy and sell premium digital products, templates, and creative assets." },
    ],
  }),
  component: Index,
});

function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
    </div>
  );
}
