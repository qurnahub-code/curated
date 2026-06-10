import { PrismaClient } from '@prisma/client';
import { products as mockProducts, orders as mockOrders, analytics as mockAnalytics } from "./data";
import type { Product, Order } from "./data";

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getProducts(): Promise<Product[]> {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const product = await prisma.product.findUnique({
    where: { id }
  });
  return product || undefined;
}

export async function addProduct(
  product: Omit<Product, "id" | "createdAt" | "sales" | "rating" | "reviews">
): Promise<Product> {
  return await prisma.product.create({
    data: {
      ...product,
      rating: 5.0,
      reviews: 0,
      sales: 0,
    }
  });
}

export async function getOrders(): Promise<Order[]> {
  const orders = await prisma.order.findMany({
    orderBy: { date: 'desc' }
  });
  
  // Convert date format to match existing mock data format
  return orders.map((o: any) => ({
    ...o,
    date: o.date.toISOString().split("T")[0],
    status: o.status as any
  }));
}

export async function addOrder(productId: string, buyerEmail: string): Promise<Order> {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error(`Product with ID ${productId} not found.`);

  // Create order and increment product sales atomically
  const [newOrder, updatedProduct] = await prisma.$transaction([
    prisma.order.create({
      data: {
        productId: product.id,
        productTitle: product.title,
        buyer: buyerEmail,
        amount: product.price,
        status: "completed",
      }
    }),
    prisma.product.update({
      where: { id: productId },
      data: { sales: { increment: 1 } }
    })
  ]);

  return {
    ...newOrder,
    date: newOrder.date.toISOString().split("T")[0],
    status: newOrder.status as any
  };
}

export async function getAnalytics(): Promise<typeof mockAnalytics> {
  // Aggregate sales and revenue across all orders
  const aggregations = await prisma.order.aggregate({
    _count: { id: true },
    _sum: { amount: true },
    where: { status: "completed" }
  });

  const totalSales = aggregations._count.id || 0;
  const totalRevenue = aggregations._sum.amount || 0;
  const avgOrderValue = totalSales > 0 ? parseFloat((totalRevenue / totalSales).toFixed(2)) : 0;

  // For the dashboard prototype, we'll return the mock data for the charts,
  // but we update the real KPI totals at the top!
  return {
    ...mockAnalytics,
    totalRevenue,
    totalSales,
    avgOrderValue,
  };
}
