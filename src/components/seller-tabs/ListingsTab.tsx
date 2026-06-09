import { Edit, Eye, MoreHorizontal } from "lucide-react";
import type { Product } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "@tanstack/react-router";

interface ListingsTabProps {
  products: Product[];
}

export function ListingsTab({ products }: ListingsTabProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-border rounded-xl py-12 text-center bg-card">
          <p className="font-body text-sm font-medium text-foreground">
            No active listings found
          </p>
          <p className="font-body text-xs text-muted-foreground mt-1">
            Click "New Listing" to publish your first digital product.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-3 font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="px-4 py-3 font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-4 py-3 font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider w-12" />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="font-body text-sm font-medium text-foreground truncate">
                            {product.title}
                          </p>
                          <p className="font-body text-xs text-muted-foreground">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="font-body text-xs">
                        {product.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-body text-sm font-medium text-foreground">
                      ${product.price}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground">
                      {product.sales}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-foreground">
                      {product.rating}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700 font-body text-xs"
                      >
                        Active
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate({
                                to: "/product/$productId",
                                params: { productId: product.id },
                              })
                            }
                            className="font-body gap-2 cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem className="font-body gap-2 cursor-pointer">
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

