import { PrismaClient } from '@prisma/client';
import { products, orders } from '../src/lib/data.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with mock data...');

  // Delete existing data to prevent duplicates
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  // Insert Products
  for (const product of products) {
    await prisma.product.create({
      data: {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        rating: product.rating,
        reviews: product.reviews,
        category: product.category,
        image: product.image,
        seller: product.seller,
        sellerAvatar: product.sellerAvatar,
        tags: product.tags,
        createdAt: new Date(product.createdAt),
        sales: product.sales,
      }
    });
  }

  // Insert Orders
  for (const order of orders) {
    await prisma.order.create({
      data: {
        id: order.id,
        productId: order.productId,
        productTitle: order.productTitle,
        buyer: order.buyer,
        date: new Date(order.date),
        amount: order.amount,
        status: order.status,
      }
    });
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
