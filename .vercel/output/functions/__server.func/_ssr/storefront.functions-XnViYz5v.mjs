import { T as TSS_SERVER_FUNCTION, a as createServerFn } from "./server-4tL1a1Aa.mjs";
import { promises } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { a as analytics, o as orders, p as products } from "./data-BPJhppbK.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, a as arrayType, n as numberType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
function resolveDbFile() {
  const candidates = [
    path.resolve(__dirname$1, "../../data/store.json"),
    path.resolve(__dirname$1, "../../../data/store.json"),
    path.resolve(__dirname$1, "../../../../data/store.json"),
    "/tmp/store.json"
  ];
  return candidates[0];
}
const DB_FILE_PRIMARY = resolveDbFile();
const DB_FILE_TMP = "/tmp/store.json";
let dbMemoryCache = null;
let writeQueue = Promise.resolve();
async function readFileSafe(filePath) {
  try {
    return await promises.readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}
async function writeFileSafe(filePath, data) {
  try {
    await promises.mkdir(path.dirname(filePath), { recursive: true });
    await promises.writeFile(filePath, data, "utf-8");
    return true;
  } catch {
    return false;
  }
}
async function initDb() {
  if (dbMemoryCache) return dbMemoryCache;
  const tmpData = await readFileSafe(DB_FILE_TMP);
  if (tmpData) {
    try {
      dbMemoryCache = JSON.parse(tmpData);
      return dbMemoryCache;
    } catch {
    }
  }
  const primaryData = await readFileSafe(DB_FILE_PRIMARY);
  if (primaryData) {
    try {
      dbMemoryCache = JSON.parse(primaryData);
      return dbMemoryCache;
    } catch {
    }
  }
  const initialDb = {
    products,
    orders,
    analytics
  };
  dbMemoryCache = initialDb;
  const json = JSON.stringify(initialDb, null, 2);
  const wrotePrimary = await writeFileSafe(DB_FILE_PRIMARY, json);
  if (!wrotePrimary) {
    await writeFileSafe(DB_FILE_TMP, json);
  }
  return initialDb;
}
async function saveDb(data) {
  dbMemoryCache = data;
  writeQueue = writeQueue.then(async () => {
    const json = JSON.stringify(data, null, 2);
    const wrotePrimary = await writeFileSafe(DB_FILE_PRIMARY, json);
    if (!wrotePrimary) {
      await writeFileSafe(DB_FILE_TMP, json);
    }
  });
  await writeQueue;
}
async function getProducts() {
  const db = await initDb();
  return db.products;
}
async function getProductById(id) {
  const db = await initDb();
  return db.products.find((p) => p.id === id);
}
async function addProduct(product) {
  const db = await initDb();
  const maxId = db.products.reduce((max, p) => Math.max(max, parseInt(p.id) || 0), 0);
  const nextId = (maxId + 1).toString();
  const newProduct = {
    ...product,
    id: nextId,
    rating: 5,
    reviews: 0,
    sales: 0,
    createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  };
  db.products.push(newProduct);
  await saveDb(db);
  return newProduct;
}
async function getOrders() {
  const db = await initDb();
  return db.orders;
}
async function addOrder(productId, buyerEmail) {
  const db = await initDb();
  const product = db.products.find((p) => p.id === productId);
  if (!product) throw new Error(`Product with ID ${productId} not found.`);
  const orderCount = db.orders.length;
  const nextOrderNum = (orderCount + 1).toString().padStart(3, "0");
  const orderId = `ORD-${nextOrderNum}`;
  const newOrder = {
    id: orderId,
    productId: product.id,
    productTitle: product.title,
    buyer: buyerEmail,
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    amount: product.price,
    status: "completed"
  };
  db.orders.unshift(newOrder);
  product.sales += 1;
  db.analytics.totalSales += 1;
  db.analytics.totalRevenue = parseFloat((db.analytics.totalRevenue + product.price).toFixed(2));
  db.analytics.avgOrderValue = parseFloat(
    (db.analytics.totalRevenue / db.analytics.totalSales).toFixed(2)
  );
  const currentMonthName = (/* @__PURE__ */ new Date()).toLocaleString("en-US", { month: "short" });
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
async function getAnalytics() {
  const db = await initDb();
  return db.analytics;
}
const fetchProducts_createServerFn_handler = createServerRpc({
  id: "e7261199519588c61baeaf4fb9aab79cc9ee40a0c3038e992c454322dc4cff55",
  name: "fetchProducts",
  filename: "src/lib/api/storefront.functions.ts"
}, (opts) => fetchProducts.__executeServer(opts));
const fetchProducts = createServerFn({
  method: "GET"
}).inputValidator(objectType({
  searchQuery: stringType().optional().default(""),
  category: stringType().optional().default("All"),
  sortBy: stringType().optional().default("featured")
})).handler(fetchProducts_createServerFn_handler, async ({
  data
}) => {
  let result = await getProducts();
  const {
    searchQuery,
    category,
    sortBy
  } = data;
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    result = result.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)) || p.category.toLowerCase().includes(q));
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
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    default:
      result.sort((a, b) => b.sales - a.sales);
      break;
  }
  return result;
});
const fetchProductById_createServerFn_handler = createServerRpc({
  id: "b3e4e46e62702d36c95079092a0088e6f0c66d115869eaca28c78afbc8d33558",
  name: "fetchProductById",
  filename: "src/lib/api/storefront.functions.ts"
}, (opts) => fetchProductById.__executeServer(opts));
const fetchProductById = createServerFn({
  method: "GET"
}).inputValidator(objectType({
  productId: stringType()
})).handler(fetchProductById_createServerFn_handler, async ({
  data
}) => {
  const product = await getProductById(data.productId);
  if (!product) {
    throw new Error(`Product ${data.productId} not found.`);
  }
  return product;
});
const createProductListing_createServerFn_handler = createServerRpc({
  id: "c66b9a6a8d75b8f09dad7da7d6b24b6617f8c4e0c91d2ff85ec5c48ea4c5b103",
  name: "createProductListing",
  filename: "src/lib/api/storefront.functions.ts"
}, (opts) => createProductListing.__executeServer(opts));
const createProductListing = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  title: stringType().min(3),
  description: stringType().min(10),
  price: numberType().positive(),
  category: stringType(),
  image: stringType().url(),
  tags: arrayType(stringType()),
  seller: stringType().default("Studio M"),
  sellerAvatar: stringType().default("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face")
})).handler(createProductListing_createServerFn_handler, async ({
  data
}) => {
  const newProduct = await addProduct(data);
  return newProduct;
});
const purchaseProduct_createServerFn_handler = createServerRpc({
  id: "3c46cc7ae34f49facaeb4bc670194ca33cf07213e8f1e9c85dd2dafb294ba61a",
  name: "purchaseProduct",
  filename: "src/lib/api/storefront.functions.ts"
}, (opts) => purchaseProduct.__executeServer(opts));
const purchaseProduct = createServerFn({
  method: "POST"
}).inputValidator(objectType({
  productId: stringType(),
  buyerEmail: stringType().email()
})).handler(purchaseProduct_createServerFn_handler, async ({
  data
}) => {
  const order = await addOrder(data.productId, data.buyerEmail);
  return order;
});
const fetchSellerDashboardData_createServerFn_handler = createServerRpc({
  id: "d348ea0e1e0fc233b3e859036bd2dc772b4cef09f6ec0001c0567e1debdf0cb0",
  name: "fetchSellerDashboardData",
  filename: "src/lib/api/storefront.functions.ts"
}, (opts) => fetchSellerDashboardData.__executeServer(opts));
const fetchSellerDashboardData = createServerFn({
  method: "GET"
}).handler(fetchSellerDashboardData_createServerFn_handler, async () => {
  const productsList = await getProducts();
  const ordersList = await getOrders();
  const analyticsData = await getAnalytics();
  return {
    products: productsList,
    orders: ordersList,
    analytics: analyticsData
  };
});
export {
  createProductListing_createServerFn_handler,
  fetchProductById_createServerFn_handler,
  fetchProducts_createServerFn_handler,
  fetchSellerDashboardData_createServerFn_handler,
  purchaseProduct_createServerFn_handler
};
