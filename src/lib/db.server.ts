import { promises as fs } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { products as mockProducts, orders as mockOrders, analytics as mockAnalytics } from "./data";
import type { Product, Order } from "./data";

// Resolve paths relative to workspace
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = path.resolve(__dirname, "../../data");
const DB_FILE = path.join(DB_DIR, "store.json");

interface DbSchema {
  products: Product[];
  orders: Order[];
  analytics: typeof mockAnalytics;
}

let dbMemoryCache: DbSchema | null = null;
let writeQueue: Promise<void> = Promise.resolve();

async function initDb(): Promise<DbSchema> {
  if (dbMemoryCache) return dbMemoryCache;

  try {
    // Ensure dir exists
    await fs.mkdir(DB_DIR, { recursive: true });

    // Try reading file
    const fileData = await fs.readFile(DB_FILE, "utf-8");
    dbMemoryCache = JSON.parse(fileData);
    return dbMemoryCache!;
  } catch (err: any) {
    // If doesn't exist, create with initial mock data
    if (err.code === "ENOENT") {
      const initialDb: DbSchema = {
        products: mockProducts,
        orders: mockOrders,
        analytics: mockAnalytics,
      };
      dbMemoryCache = initialDb;
      await fs.writeFile(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
      return initialDb;
    }
    throw err;
  }
}

async function saveDb(data: DbSchema): Promise<void> {
  dbMemoryCache = data;
  
  // Serialize writes using a promise queue to prevent simultaneous write conflicts
  writeQueue = writeQueue.then(async () => {
    try {
      await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing database to disk:", err);
    }
  });
  
  await writeQueue;
}

export async function getProducts(): Promise<Product[]> {
  const db = await initDb();
  return db.products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const db = await initDb();
  return db.products.find((p) => p.id === id);
}

export async function addProduct(product: Omit<Product, "id" | "createdAt" | "sales" | "rating" | "reviews">): Promise<Product> {
  const db = await initDb();
  
  // Calculate next ID
  const maxId = db.products.reduce((max, p) => Math.max(max, parseInt(p.id) || 0), 0);
  const nextId = (maxId + 1).toString();

  const newProduct: Product = {
    ...product,
    id: nextId,
    rating: 5.0, // default rating
    reviews: 0,
    sales: 0,
    createdAt: new Date().toISOString().split("T")[0],
  };

  db.products.push(newProduct);
  await saveDb(db);
  return newProduct;
}

export async function getOrders(): Promise<Order[]> {
  const db = await initDb();
  return db.orders;
}

export async function addOrder(productId: string, buyerEmail: string): Promise<Order> {
  const db = await initDb();
  
  const product = db.products.find((p) => p.id === productId);
  if (!product) {
    throw new Error(`Product with ID ${productId} not found.`);
  }

  // Create new order
  const orderCount = db.orders.length;
  const nextOrderNum = (orderCount + 1).toString().padStart(3, "0");
  const orderId = `ORD-${nextOrderNum}`;

  const newOrder: Order = {
    id: orderId,
    productId: product.id,
    productTitle: product.title,
    buyer: buyerEmail,
    date: new Date().toISOString().split("T")[0],
    amount: product.price,
    status: "completed",
  };

  db.orders.unshift(newOrder); // Add to top of orders

  // Update product stats
  product.sales += 1;

  // Update analytics stats
  db.analytics.totalSales += 1;
  db.analytics.totalRevenue += product.price;
  db.analytics.avgOrderValue = parseFloat((db.analytics.totalRevenue / db.analytics.totalSales).toFixed(2));

  // Update monthly revenue (add to current month, which is June)
  const currentMonthName = new Date().toLocaleString("en-US", { month: "short" }); // e.g. "Jun"
  const monthData = db.analytics.monthlyRevenue.find((m) => m.month === currentMonthName);
  if (monthData) {
    monthData.revenue += product.price;
  } else {
    db.analytics.monthlyRevenue.push({ month: currentMonthName, revenue: product.price });
  }

  // Update top products sales/revenue
  const topProd = db.analytics.topProducts.find((p) => p.name === product.title);
  if (topProd) {
    topProd.sales += 1;
    topProd.revenue += product.price;
  } else {
    db.analytics.topProducts.push({ name: product.title, sales: 1, revenue: product.price });
  }
  
  // Sort top products by revenue descending
  db.analytics.topProducts.sort((a, b) => b.revenue - a.revenue);

  await saveDb(db);
  return newOrder;
}

export async function getAnalytics(): Promise<typeof mockAnalytics> {
  const db = await initDb();
  return db.analytics;
}
