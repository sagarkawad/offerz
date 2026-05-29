/**
 * Dev seed data. Seed clerkIds (seed_shopkeeper_1, seed_buyer_1) are for local API testing only.
 * Real Clerk users need matching User rows with their actual userId.
 */
import 'dotenv/config';

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SEED_SHOPKEEPER = 'seed_shopkeeper_1';
const SEED_BUYER = 'seed_buyer_1';

const locations = [
  { id: 'downtown-austin', label: 'Downtown, Austin', sortOrder: 1 },
  { id: 'south-congress', label: 'South Congress, Austin', sortOrder: 2 },
  { id: 'east-austin', label: 'East Austin', sortOrder: 3 },
  { id: 'domain-austin', label: 'The Domain, Austin', sortOrder: 4 },
];

const categories = [
  { slug: 'food', name: 'Food & Drink', sortOrder: 1 },
  { slug: 'retail', name: 'Retail', sortOrder: 2 },
  { slug: 'fashion', name: 'Fashion', sortOrder: 3 },
  { slug: 'health', name: 'Health & Beauty', sortOrder: 4 },
  { slug: 'services', name: 'Services', sortOrder: 5 },
  { slug: 'entertainment', name: 'Entertainment', sortOrder: 6 },
];

const shops = [
  {
    id: 'seed_shop_sunrise',
    name: 'Sunrise Bakery',
    description: 'Fresh bakery and pastries',
    locationId: 'downtown-austin',
  },
  {
    id: 'seed_shop_greenmart',
    name: 'GreenMart',
    description: 'Groceries and daily essentials',
    locationId: 'downtown-austin',
  },
  {
    id: 'seed_shop_beanbrew',
    name: 'Bean & Brew',
    description: 'Coffee and light bites',
    locationId: 'south-congress',
  },
  {
    id: 'seed_shop_stylestudio',
    name: 'Style Studio',
    description: 'Hair and grooming',
    locationId: 'south-congress',
  },
  {
    id: 'seed_shop_sliceheaven',
    name: 'Slice Heaven',
    description: 'Pizza and Italian',
    locationId: 'east-austin',
  },
  {
    id: 'seed_shop_stepup',
    name: 'StepUp Shoes',
    description: 'Footwear and accessories',
    locationId: 'east-austin',
  },
  {
    id: 'seed_shop_zenfit',
    name: 'ZenFit Studio',
    description: 'Yoga and fitness',
    locationId: 'domain-austin',
  },
  {
    id: 'seed_shop_techhub',
    name: 'TechHub',
    description: 'Electronics and accessories',
    locationId: 'domain-austin',
  },
];

type OfferSeed = {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  shopId: string;
  categorySlug: string;
};

const offers: OfferSeed[] = [
  {
    id: 'seed_offer_1',
    title: 'Buy 2 Get 1 Free',
    description:
      'Valid on all bakery items. Mix and match any three items from our fresh selection.',
    discount: '33% OFF',
    validUntil: '2026-06-15',
    shopId: 'seed_shop_sunrise',
    categorySlug: 'food',
  },
  {
    id: 'seed_offer_2',
    title: 'Flat 20% Off on Groceries',
    description: 'Get 20% off on orders above $50. Fresh produce and daily essentials included.',
    discount: '20% OFF',
    validUntil: '2026-06-30',
    shopId: 'seed_shop_greenmart',
    categorySlug: 'retail',
  },
  {
    id: 'seed_offer_3',
    title: 'Weekend Coffee Special',
    description: 'Any large coffee for the price of a medium. Available Saturday and Sunday only.',
    discount: 'FREE UPGRADE',
    validUntil: '2026-06-08',
    shopId: 'seed_shop_beanbrew',
    categorySlug: 'food',
  },
  {
    id: 'seed_offer_4',
    title: 'Haircut + Beard Trim Combo',
    description: 'Complete grooming package at a special price. Walk-ins welcome.',
    discount: '$15 OFF',
    validUntil: '2026-07-01',
    shopId: 'seed_shop_stylestudio',
    categorySlug: 'services',
  },
  {
    id: 'seed_offer_5',
    title: 'Pizza Party Deal',
    description: 'Two large pizzas with two sides and drinks. Perfect for family gatherings.',
    discount: '25% OFF',
    validUntil: '2026-06-20',
    shopId: 'seed_shop_sliceheaven',
    categorySlug: 'food',
  },
  {
    id: 'seed_offer_6',
    title: 'Summer Sale on Footwear',
    description: 'Up to 40% off on selected sneakers and sandals. Limited stock available.',
    discount: '40% OFF',
    validUntil: '2026-08-01',
    shopId: 'seed_shop_stepup',
    categorySlug: 'fashion',
  },
  {
    id: 'seed_offer_7',
    title: 'Yoga Class Trial Pack',
    description: 'Three trial sessions for new members. All skill levels welcome.',
    discount: '50% OFF',
    validUntil: '2026-06-25',
    shopId: 'seed_shop_zenfit',
    categorySlug: 'health',
  },
  {
    id: 'seed_offer_8',
    title: 'Electronics Clearance',
    description: 'Discounts on headphones, chargers, and phone accessories while stocks last.',
    discount: '30% OFF',
    validUntil: '2026-06-18',
    shopId: 'seed_shop_techhub',
    categorySlug: 'retail',
  },
];

async function main() {
  for (const loc of locations) {
    await prisma.location.upsert({
      where: { id: loc.id },
      create: loc,
      update: { label: loc.label, sortOrder: loc.sortOrder },
    });
  }

  const categoryBySlug = new Map<string, string>();
  for (const cat of categories) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: { name: cat.name, sortOrder: cat.sortOrder },
    });
    categoryBySlug.set(cat.slug, row.id);
  }

  await prisma.user.upsert({
    where: { clerkId: SEED_SHOPKEEPER },
    create: { clerkId: SEED_SHOPKEEPER, role: 'SHOPKEEPER' },
    update: { role: 'SHOPKEEPER' },
  });

  await prisma.user.upsert({
    where: { clerkId: SEED_BUYER },
    create: { clerkId: SEED_BUYER, role: 'BUYER' },
    update: { role: 'BUYER' },
  });

  for (const shop of shops) {
    await prisma.shop.upsert({
      where: { id: shop.id },
      create: {
        ...shop,
        ownerId: SEED_SHOPKEEPER,
      },
      update: {
        name: shop.name,
        description: shop.description,
        locationId: shop.locationId,
      },
    });
  }

  for (const offer of offers) {
    const categoryId = categoryBySlug.get(offer.categorySlug);
    if (!categoryId) {
      throw new Error(`Missing category: ${offer.categorySlug}`);
    }

    await prisma.offer.upsert({
      where: { id: offer.id },
      create: {
        id: offer.id,
        title: offer.title,
        description: offer.description,
        discount: offer.discount,
        validUntil: new Date(offer.validUntil),
        shopId: offer.shopId,
        categoryId,
        createdById: SEED_SHOPKEEPER,
      },
      update: {
        title: offer.title,
        description: offer.description,
        discount: offer.discount,
        validUntil: new Date(offer.validUntil),
        shopId: offer.shopId,
        categoryId,
      },
    });
  }

  console.log('Seed complete:', {
    locations: locations.length,
    categories: categories.length,
    shops: shops.length,
    offers: offers.length,
    shopkeeper: SEED_SHOPKEEPER,
    buyer: SEED_BUYER,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
