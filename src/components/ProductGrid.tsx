import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api/storefront.functions";
import { ProductCard } from "./ProductCard";
import { FilterBar } from "./FilterBar";
import { useNavigate } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3">
      <Skeleton className="aspect-[4/3] w-full rounded-lg" />
      <div className="flex flex-col gap-2 px-1">
        <div className="flex justify-between items-center gap-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-10 shrink-0" />
        </div>
        <Skeleton className="h-3 w-full mt-1" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({
  searchQuery,
  selectedCategory,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: ProductGridProps) {
  const navigate = useNavigate();

  const { data: filteredProducts = [], isLoading } = useQuery({
    queryKey: ["products", searchQuery, selectedCategory, sortBy],
    queryFn: () =>
      fetchProducts({
        data: { searchQuery, category: selectedCategory, sortBy },
      }),
  });

  return (
    <div className="flex flex-col gap-6">
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
      />

      <div className="h-5">
        {!isLoading && (
          <p className="font-body text-sm text-muted-foreground animate-fade-in">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-body text-lg font-medium text-foreground">
            No products found
          </p>
          <p className="font-body text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() =>
                navigate({
                  to: "/product/$productId",
                  params: { productId: product.id },
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

