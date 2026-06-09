import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getProducts,
  getProductById,
  addProduct,
  getOrders,
  addOrder,
  getAnalytics,
} from "../db.server";

// 1. Fetch products with search/filters/sorting
export const fetchProducts = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      searchQuery: z.string().optional().default(""),
      category: z.string().optional().default("All"),
      sortBy: z.string().optional().default("featured"),
    })
  )
  .handler(async ({ data }) => {
    let result = await getProducts();
    const { searchQuery, category, sortBy } = data;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (category && category !== "All") {
      result = result.filter((p) => p.category === category);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        // Default "featured" sorts by sales desc
        result.sort((a, b) => b.sales - a.sales);
        break;
    }

    return result;
  });

// 2. Fetch single product by id
export const fetchProductById = createServerFn({ method: "GET" })
  .inputValidator(z.object({ productId: z.string() }))
  .handler(async ({ data }) => {
    const product = await getProductById(data.productId);
    if (!product) {
      throw new Error(`Product ${data.productId} not found.`);
    }
    return product;
  });

// 3. Create a new listing
export const createProductListing = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      title: z.string().min(3),
      description: z.string().min(10),
      price: z.number().positive(),
      category: z.string(),
      image: z.string().url(),
      tags: z.array(z.string()),
      seller: z.string().default("Studio M"),
      sellerAvatar: z.string().default("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face"),
    })
  )
  .handler(async ({ data }) => {
    const newProduct = await addProduct(data);
    return newProduct;
  });

// 4. Purchase a product
export const purchaseProduct = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      productId: z.string(),
      buyerEmail: z.string().email(),
    })
  )
  .handler(async ({ data }) => {
    const order = await addOrder(data.productId, data.buyerEmail);
    return order;
  });

// 5. Fetch all seller dashboard data (products, orders, analytics)
export const fetchSellerDashboardData = createServerFn({ method: "GET" })
  .handler(async () => {
    const productsList = await getProducts();
    const ordersList = await getOrders();
    const analyticsData = await getAnalytics();

    return {
      products: productsList,
      orders: ordersList,
      analytics: analyticsData,
    };
  });
