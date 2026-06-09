import { createFileRoute, useParams } from "@tanstack/react-router";
import { ArrowLeft, Star, Download, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProductById, purchaseProduct } from "@/lib/api/storefront.functions";
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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
  const queryClient = useQueryClient();
  const [openCheckout, setOpenCheckout] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState("");

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById({ data: { productId } }),
  });

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

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="overflow-hidden rounded-2xl border border-border aspect-[4/3] bg-muted flex items-center justify-center">
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover transition-all"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6">
            <div>
              <Badge variant="outline" className="font-body text-xs mb-3">
                {product.category}
              </Badge>
              <h1
                className="text-3xl font-bold tracking-tight text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {product.title}
              </h1>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-body text-sm font-medium text-foreground">
                    {product.rating}
                  </span>
                  <span className="font-body text-sm text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>
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
                  Top seller
                </p>
              </div>
            </div>

            <p className="font-body text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="flex flex-wrap gap-2">
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

            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
              <Shield className="h-5 w-5 text-accent shrink-0" />
              <div>
                <p className="font-body text-sm font-medium text-foreground">
                  Instant download
                </p>
                <p className="font-body text-xs text-muted-foreground">
                  Secure payment. Files delivered immediately after purchase.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <span
                className="text-3xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                ${product.price}
              </span>
              <Button
                size="lg"
                onClick={() => setOpenCheckout(true)}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-body gap-2 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Buy Now
              </Button>
            </div>
          </div>
        </div>
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

