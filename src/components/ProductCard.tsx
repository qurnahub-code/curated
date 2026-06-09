import { Star } from "lucide-react";
import type { Product } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-3 text-left transition-all hover:shadow-lg hover:shadow-foreground/5 focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <Badge
            variant="secondary"
            className="bg-background/90 backdrop-blur-sm font-body text-xs font-medium"
          >
            {product.category}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-body text-sm font-semibold leading-snug text-foreground line-clamp-2">
            {product.title}
          </h3>
          <span className="shrink-0 font-body text-sm font-bold text-primary">
            ${product.price}
          </span>
        </div>

        <p className="font-body text-xs text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <img
              src={product.sellerAvatar}
              alt={product.seller}
              className="h-5 w-5 rounded-full object-cover"
            />
            <span className="font-body text-xs text-muted-foreground">
              {product.seller}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-body text-xs font-medium text-foreground">
              {product.rating}
            </span>
            <span className="font-body text-xs text-muted-foreground">
              ({product.reviews})
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
