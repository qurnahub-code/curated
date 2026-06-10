import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { e as useParams } from "./_libs/tanstack__react-router.mjs";
import { B as Button, g as Badge, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, L as Label, I as Input, e as DialogFooter, f as DialogClose, S as Skeleton, p as purchaseProduct, l as fetchProductById } from "./_ssr/label-BpFsgyaY.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "./_libs/tanstack__react-query.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import "./_libs/seroval.mjs";
import { r as ArrowLeft, f as Star, s as Shield, t as Download, L as LoaderCircle } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_ssr/server-4tL1a1Aa.mjs";
import "node:async_hooks";
import "./_libs/h3-v2.mjs";
import "./_libs/rou3.mjs";
import "./_libs/srvx.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/react-remove-scroll.mjs";
import "tslib";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/radix-ui__react-label.mjs";
import "./_libs/tailwind-merge.mjs";
import "./_libs/zod.mjs";
import "./_libs/tanstack__query-core.mjs";
function ProductDetailSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background animate-pulse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-8 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-[4/3] w-full rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-24 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-3/4 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-1/2" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 flex-1 rounded-lg" })
        ] })
      ] })
    ] }) })
  ] });
}
function ProductDetail() {
  const {
    productId
  } = useParams({
    from: "/product/$productId"
  });
  const queryClient = useQueryClient();
  const [openCheckout, setOpenCheckout] = reactExports.useState(false);
  const [buyerEmail, setBuyerEmail] = reactExports.useState("");
  const {
    data: product,
    isLoading,
    error
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById({
      data: {
        productId
      }
    })
  });
  const purchaseMutation = useMutation({
    mutationFn: (email) => purchaseProduct({
      data: {
        productId,
        buyerEmail: email
      }
    }),
    onSuccess: () => {
      toast.success("Purchase completed! Your files are ready to download.");
      queryClient.invalidateQueries({
        queryKey: ["product", productId]
      });
      queryClient.invalidateQueries({
        queryKey: ["seller-dashboard-data"]
      });
      setOpenCheckout(false);
      setBuyerEmail("");
    },
    onError: (err) => {
      toast.error(err.message || "Purchase failed. Please try again.");
    }
  });
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!buyerEmail || !buyerEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    purchaseMutation.mutate(buyerEmail);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProductDetailSkeleton, {});
  }
  if (error || !product) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-body text-xl font-semibold text-foreground", children: "Product not found or failed to load" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "link", onClick: () => window.history.back(), className: "mt-2 font-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-1 h-4 w-4" }),
        "Go back"
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: () => window.history.back(), className: "font-body gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      "Back"
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-8 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl border border-border aspect-[4/3] bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.image, alt: product.title, className: "h-full w-full object-cover transition-all" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-body text-xs mb-3", children: product.category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight text-foreground", style: {
            fontFamily: "var(--font-display)"
          }, children: product.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-amber-400 text-amber-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-body text-sm font-medium text-foreground", children: product.rating }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-body text-sm text-muted-foreground", children: [
                "(",
                product.reviews,
                " reviews)"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-body text-sm text-muted-foreground", children: [
              product.sales,
              " sales"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: product.sellerAvatar, alt: product.seller, className: "h-10 w-10 rounded-full object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm font-medium text-foreground", children: product.seller }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-xs text-muted-foreground", children: "Top seller" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-base leading-relaxed text-muted-foreground", children: product.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: product.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "font-body text-xs bg-secondary text-secondary-foreground", children: tag }, tag)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl bg-muted/50 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 text-accent shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm font-medium text-foreground", children: "Instant download" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-xs text-muted-foreground", children: "Secure payment. Files delivered immediately after purchase." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-3xl font-bold text-foreground", style: {
            fontFamily: "var(--font-display)"
          }, children: [
            "$",
            product.price
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", onClick: () => setOpenCheckout(true), className: "flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-body gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
            "Buy Now"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: openCheckout, onOpenChange: setOpenCheckout, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "sm:max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCheckoutSubmit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl text-foreground", children: "Checkout" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "font-body text-sm text-muted-foreground mt-1", children: [
          "You are purchasing ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: product.title }),
          " for ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
            "$",
            product.price
          ] }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-6 flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "font-body text-sm font-medium", children: "Email Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", placeholder: "you@example.com", value: buyerEmail, onChange: (e) => setBuyerEmail(e.target.value), className: "font-body", required: true, disabled: purchaseMutation.isPending }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-xs text-muted-foreground", children: "Your purchase receipt and product download link will be sent to this email address." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", className: "font-body cursor-pointer", disabled: purchaseMutation.isPending, children: "Cancel" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "font-body bg-primary text-primary-foreground hover:bg-primary/90 gap-2 cursor-pointer", disabled: purchaseMutation.isPending, children: purchaseMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          "Processing..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Complete Purchase" }) })
      ] })
    ] }) }) })
  ] });
}
export {
  ProductDetail as component
};
