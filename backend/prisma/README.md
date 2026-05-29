# Database setup

## 1. Environment

Ensure `backend/.env` has `DATABASE_URL` and that [`prisma.config.ts`](../prisma.config.ts) loads dotenv (`import 'dotenv/config'`).

## 2. Migrate and generate

```bash
cd backend
bunx prisma migrate dev --name add_locations_and_shops
bunx prisma generate
```

## 3. Seed dummy data

```bash
bunx prisma db seed
```

Seeds 4 locations, 6 categories, dev users (`seed_shopkeeper_1`, `seed_buyer_1`), 8 shops, 8 offers.

## 4. Run API and verify

```bash
bun run dev
```

```bash
curl http://localhost:5000/api/locations
curl http://localhost:5000/api/categories
curl "http://localhost:5000/api/offers?locationId=downtown-austin"
curl http://localhost:5000/api/shops/seed_shop_sunrise
```

Offer creation (requires Clerk Bearer token and `User` row with `clerkId` matching token, `role = SHOPKEEPER`):

```bash
POST http://localhost:5000/api/shops/:shopId/offers
```

`POST /api/offers` is removed; use nested shop route instead.
