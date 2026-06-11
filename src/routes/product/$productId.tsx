import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Star, Download, Shield, Loader2, CheckCircle2, FileType2, Layers, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProductById, purchaseProduct, fetchProducts } from "@/lib/api/storefront.functions";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$productId")({
  head: () => ({
    meta: [
      { title: `Product — Curated` },
      { name: "description", content: "View product details on Curated marketplace." },
    ],
  }),
  component: ProductDetail,
});

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-20" />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          <div className="flex flex-col gap-6">
            <div>
              <Skeleton className="h-5 w-24 mb-3" />
              <Skeleton className="h-10 w-3/4 mb-3" />
              <Skeleton className="h-5 w-1/2" />
            </div>
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-14 w-full rounded-xl" />
            <div className="flex items-center gap-4 pt-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-12 flex-1 rounded-lg" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProductDetail() {
  const { productId } = useParams({ from: "/product/$productId" });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openCheckout, setOpenCheckout] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState("");

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById({ data: { productId } }),
  });

  const { data: categoryProducts = [] } = useQuery({
    queryKey: ["similar-products", product?.category],
    queryFn: () => fetchProducts({ data: { category: product?.category, searchQuery: "", sortBy: "featured" } }),
    enabled: !!product?.category,
  });

  const similarProducts = categoryProducts
    .filter((p) => p.id !== productId)
    .slice(0, 4);

  const purchaseMutation = useMutation({
    mutationFn: (email: string) =>
      purchaseProduct({ data: { productId, buyerEmail: email } }),
    onSuccess: () => {
      toast.success("Purchase completed! Your files are ready to download.");
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["seller-dashboard-data"] });
      setOpenCheckout(false);
      setBuyerEmail("");
    },
    onError: (err: any) => {
      toast.error(err.message || "Purchase failed. Please try again.");
    },
  });

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerEmail || !buyerEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    purchaseMutation.mutate(buyerEmail);
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-body text-xl font-semibold text-foreground">
            Product not found or failed to load
          </h1>
          <Button
            variant="link"
            onClick={() => window.history.back()}
            className="mt-2 font-body"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="font-body gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-2xl border border-border aspect-[4/3] bg-muted flex items-center justify-center">
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover transition-all"
              />
            </div>
            
            <div className="rounded-xl border border-border bg-card p-6">
               <h3 className="font-display text-lg font-semibold mb-4">Highlights</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="flex items-center gap-3">
                   <div className="rounded-md bg-primary/10 p-2 text-primary">
                     <CheckCircle2 className="h-4 w-4" />
                   </div>
                   <span className="font-body text-sm">Commercial License</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="rounded-md bg-primary/10 p-2 text-primary">
                     <FileType2 className="h-4 w-4" />
                   </div>
                   <span className="font-body text-sm">Multiple Formats</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="rounded-md bg-primary/10 p-2 text-primary">
                     <Layers className="h-4 w-4" />
                   </div>
                   <span className="font-body text-sm">Fully Layered</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="rounded-md bg-primary/10 p-2 text-primary">
                     <RefreshCcw className="h-4 w-4" />
                   </div>
                   <span className="font-body text-sm">Lifetime Updates</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div>
              <Badge variant="outline" className="font-body text-xs mb-3">
                {product.category}
              </Badge>
              <h1
                className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {product.title}
              </h1>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-body text-base font-medium text-foreground">
                    {product.rating}
                  </span>
                  <span className="font-body text-sm text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>
                <div className="h-4 w-px bg-border" />
                <span className="font-body text-sm text-muted-foreground">
                  {product.sales} sales
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <img
                src={product.sellerAvatar}
                alt={product.seller}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="font-body text-sm font-medium text-foreground">
                  {product.seller}
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  Top tier seller
                </p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto font-body text-xs">
                View Profile
              </Button>
            </div>

            <div className="prose prose-sm dark:prose-invert">
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">Description</h3>
              <p className="font-body text-base leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {product.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="font-body text-xs bg-secondary text-secondary-foreground"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4 border border-border">
              <Shield className="h-6 w-6 text-emerald-500 shrink-0" />
              <div>
                <p className="font-body text-sm font-medium text-foreground">
                  Instant & Secure Download
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  Secure encrypted payment. Files delivered immediately after purchase.
                </p>
              </div>
            </div>

            <div className="sticky bottom-4 z-10 mt-auto flex items-center gap-4 rounded-2xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur-sm">
              <div className="flex flex-col">
                <span className="font-body text-xs text-muted-foreground">Total Price</span>
                <span
                  className="text-3xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  ${product.price}
                </span>
              </div>
              <Button
                size="lg"
                onClick={() => setOpenCheckout(true)}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-body gap-2 cursor-pointer h-12 text-base"
              >
                <Download className="h-5 w-5" />
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="mt-24 border-t border-border pt-16">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 
                  className="text-2xl font-bold tracking-tight text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Similar products
                </h2>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  More highly-rated items from the {product.category} category.
                </p>
              </div>
              <Button variant="ghost" className="font-body" onClick={() => window.history.back()}>
                View all
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={() =>
                    navigate({
                      to: "/product/$productId",
                      params: { productId: p.id },
                    })
                  }
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Checkout Modal Dialog */}
      <Dialog open={openCheckout} onOpenChange={setOpenCheckout}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCheckoutSubmit}>
            <DialogHeader>
              <DialogTitle className="font-display text-xl text-foreground">
                Checkout
              </DialogTitle>
              <DialogDescription className="font-body text-sm text-muted-foreground mt-1">
                You are purchasing <strong>{product.title}</strong> for <strong>${product.price}</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="my-6 flex flex-col gap-3">
              <Label htmlFor="email" className="font-body text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="font-body"
                required
                disabled={purchaseMutation.isPending}
              />
              <p className="font-body text-xs text-muted-foreground">
                Your purchase receipt and product download link will be sent to this email address.
              </p>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="font-body cursor-pointer"
                  disabled={purchaseMutation.isPending}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="font-body bg-primary text-primary-foreground hover:bg-primary/90 gap-2 cursor-pointer"
                disabled={purchaseMutation.isPending}
              >
                {purchaseMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Complete Purchase</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

