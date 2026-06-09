# Curated

A premium digital marketplace where creators can buy and sell templates, UI kits, icon packs, fonts, code snippets, 3D assets, illustrations, and audio files.

## Features

- 🛒 **Browse Marketplace** — Search and filter 12+ digital product categories with live server-side fetching
- 💳 **Checkout Flow** — Buy Now modal with email input and instant order confirmation
- 🏪 **Seller Dashboard** — Create new listings, view analytics, and track orders
- 📊 **Live Analytics** — Revenue, sales, and top products update in real-time after purchases
- 💾 **Persistent Data** — All products, orders, and analytics saved to `data/store.json` (survives restarts)

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/router/latest/docs/start/overview) (React 19 + Vite 7 + Nitro SSR)
- **Routing**: [TanStack Router](https://tanstack.com/router) — file-based, type-safe
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + shadcn/ui
- **State & Data**: [React Query](https://tanstack.com/query) + TanStack Server Functions
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

```bash
npm install
npm run dev
```

App runs at **http://localhost:8080**

## Project Structure

```
src/
├── components/
│   ├── seller-tabs/        # Listings, Analytics, Orders dashboard tabs
│   ├── ui/                 # Radix UI / shadcn atoms
│   ├── FilterBar.tsx       # Search + category + sort controls
│   ├── ProductCard.tsx     # Product listing card
│   ├── ProductGrid.tsx     # Filtered product grid
│   └── SellerDashboard.tsx # Seller hub with tabs + new listing form
├── lib/
│   ├── api/
│   │   └── storefront.functions.ts  # TanStack Server Functions (CRUD + purchase)
│   ├── db.server.ts        # File-based JSON database layer
│   └── data.ts             # Seed data (TypeScript types + initial mock data)
├── routes/
│   ├── product/
│   │   └── $productId.tsx  # Product detail page with checkout
│   └── index.tsx           # Homepage (Browse + Sell toggle)
└── styles.css              # Global styles + Tailwind directives
data/
└── store.json              # Live database (products, orders, analytics)
```

## License

MIT
