import { promises as fs } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { products as mockProducts, orders as mockOrders, analytics as mockAnalytics } from "./data";
import type { Product, Order } from "./data";

// ---------------------------------------------------------------------------
// Path strategy:
//   - In local dev, we write next to the source so the file persists across
//     restarts (data/store.json relative to the workspace root).
//   - On Vercel (and other read-only serverless environments) the source tree
//     is immutable; we fall back to /tmp which is writable but ephemeral.
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Try the workspace-relative data dir first; fall back to /tmp. */
function resolveDbFile(): string {
  // When built by Vite/Nitro the output may live at a different depth —
  // walk up until we find a "data" sibling or hit the FS root.
  const candidates = [
    path.resolve(__dirname, "../../data/store.json"),
    path.resolve(__dirname, "../../../data/store.json"),
    path.resolve(__dirname, "../../../../data/store.json"),
    "/tmp/store.json",
  ];
  return candidates[0]; // We'll fall back at runtime if the write fails
}

const DB_FILE_PRIMARY = resolveDbFile();
const DB_FILE_TMP = "/tmp/store.json";

interface DbSchema {
  products: Product[];
  orders: Order[];
  analytics: typeof mockAnalytics;
}

let dbMemoryCache: DbSchema | null = null;
let writeQueue: Promise<void> = Promise.resolve();

async function readFileSafe(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}

async function writeFileSafe(filePath: string, data: string): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, data, "utf-8");
    return true;
  } catch {
    return false;
  }
}

async function initDb(): Promise<DbSchema> {
  if (dbMemoryCache) return dbMemoryCache;

  // 1. Try /tmp first (Vercel may already have an in-flight copy there)
  const tmpData = await readFileSafe(DB_FILE_TMP);
  if (tmpData) {
    try {
      dbMemoryCache = JSON.parse(tmpData);
      return dbMemoryCache!;
    } catch { /* corrupt — fall through */ }
  }

  // 2. Try the workspace-bundled JSON (read-only on serverless, that's OK)
  const primaryData = await readFileSafe(DB_FILE_PRIMARY);
  if (primaryData) {
    try {
      dbMemoryCache = JSON.parse(primaryData);
      return dbMemoryCache!;
    } catch { /* corrupt — fall through */ }
  }

  // 3. Seed from TypeScript mock data
  const initialDb: DbSchema = {
    products: mockProducts,
    orders: mockOrders,
    analytics: mockAnalytics,
  };
  dbMemoryCache = initialDb;

  // Attempt to persist seed (will silently succeed in dev, silently fail on Vercel)
  const json = JSON.stringify(initialDb, null, 2);
  const wrotePrimary = await writeFileSafe(DB_FILE_PRIMARY, json);
  if (!wrotePrimary) {
    await writeFileSafe(DB_FILE_TMP, json);
  }

  return initialDb;
}

async function saveDb(data: DbSchema): Promise<void> {
  // Always update the in-memory cache immediately so reads are consistent
  dbMemoryCache = data;

  // Enqueue the disk write so concurrent mutations don't interleave
  writeQueue = writeQueue.then(async () => {
    const json = JSON.stringify(data, null, 2);
    // Try primary (dev) path first; on serverless this will fail → use /tmp
    const wrotePrimary = await writeFileSafe(DB_FILE_PRIMARY, json);
    if (!wrotePrimary) {
      await writeFileSafe(DB_FILE_TMP, json);
    }
  });

  await writeQueue;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getProducts(): Promise<Product[]> {
  const db = await initDb();
  return db.products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const db = await initDb();
  return db.products.find((p) => p.id === id);
}

export async function addProduct(
  product: Omit<Product, "id" | "createdAt" | "sales" | "rating" | "reviews">
): Promise<Product> {
  const db = await initDb();

  const maxId = db.products.reduce((max, p) => Math.max(max, parseInt(p.id) || 0), 0);
  const nextId = (maxId + 1).toString();

  const newProduct: Product = {
    ...product,
    id: nextId,
    rating: 5.0,
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
  if (!product) throw new Error(`Product with ID ${productId} not found.`);

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

  db.orders.unshift(newOrder);

  product.sales += 1;
  db.analytics.totalSales += 1;
  db.analytics.totalRevenue = parseFloat((db.analytics.totalRevenue + product.price).toFixed(2));
  db.analytics.avgOrderValue = parseFloat(
    (db.analytics.totalRevenue / db.analytics.totalSales).toFixed(2)
  );

  const currentMonthName = new Date().toLocaleString("en-US", { month: "short" });
  const monthData = db.analytics.monthlyRevenue.find((m) => m.month === currentMonthName);
  if (monthData) {
    monthData.revenue = parseFloat((monthData.revenue + product.price).toFixed(2));
  } else {
    db.analytics.monthlyRevenue.push({ month: currentMonthName, revenue: product.price });
  }

  const topProd = db.analytics.topProducts.find((p) => p.name === product.title);
  if (topProd) {
    topProd.sales += 1;
    topProd.revenue = parseFloat((topProd.revenue + product.price).toFixed(2));
  } else {
    db.analytics.topProducts.push({ name: product.title, sales: 1, revenue: product.price });
  }
  db.analytics.topProducts.sort((a, b) => b.revenue - a.revenue);

  await saveDb(db);
  return newOrder;
}

export async function getAnalytics(): Promise<typeof mockAnalytics> {
  const db = await initDb();
  return db.analytics;
}
