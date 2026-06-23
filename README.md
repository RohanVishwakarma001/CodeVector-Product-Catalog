# CodeVector — Product Catalog

A production-grade full-stack application featuring a high-performance product catalog with 200,000+ products, cursor-based pagination, and a premium dark-mode UI.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, TanStack Query |
| Backend | Node.js, Express.js, TypeScript |
| Database | Neon PostgreSQL |
| ORM | Prisma |
| Deploy | Vercel (frontend), Render (backend), Neon (database) |

---

## Why Cursor-Based Pagination?

### The Problem with OFFSET

```sql
-- Page 1
SELECT * FROM products ORDER BY updated_at DESC LIMIT 20 OFFSET 0;

-- Page 2
SELECT * FROM products ORDER BY updated_at DESC LIMIT 20 OFFSET 20;
```

If 5 new products are inserted between these two queries, items shift in the ordered result set. Page 2 will **skip** the 5 pushed-down items from page 1 (missing products), or worse, **repeat** the 5 that shifted up (duplicates). Performance also degrades at large offsets because the database must scan and discard all prior rows.

### The Cursor Solution

The cursor encodes the position of the last item seen:

```json
{ "updated_at": "2025-10-01T12:00:00.000Z", "id": "f47ac10b-..." }
```

The next-page query:

```sql
WHERE
  (updated_at < cursor.updated_at)
OR
  (updated_at = cursor.updated_at AND id < cursor.id)
ORDER BY updated_at DESC, id DESC
LIMIT 20
```

**Why this prevents duplicates:** The `WHERE` clause starts *strictly after* the last seen row. No row already returned can satisfy `updated_at < cursor.updated_at` or the tie-breaking `id < cursor.id` condition.

**Why this prevents missing products:** The ordering by `(updated_at DESC, id DESC)` is stable and deterministic. New inserts have `updated_at = NOW()` which is newer than the cursor, so they appear on earlier pages—not in the middle of a paginated session. Products being browsed remain at their current cursor position regardless of concurrent writes.

**Why `id` as tie-breaker:** `updated_at` has millisecond precision; multiple rows may share the same timestamp. The UUID `id` breaks ties and ensures the composite `(updated_at, id)` pair is globally unique, giving a total order across all rows.

### Composite Index

```prisma
@@index([updatedAt(sort: Desc), id(sort: Desc)])
@@index([category, updatedAt(sort: Desc), id(sort: Desc)])
```

The database index matches the `ORDER BY` and `WHERE` clause exactly, allowing an index range scan instead of a full table scan—staying sub-millisecond at 200k+ rows.

---

## Project Structure

```
codevector/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── controllers/      # Request parsing, response shaping
│       ├── services/         # Business logic
│       ├── repositories/     # Database queries (Prisma)
│       ├── routes/           # Express router
│       ├── middleware/        # Error handling
│       └── utils/            # Cursor codec, response helpers
└── frontend/
    └── src/
        ├── components/       # Reusable UI (ProductCard, CategoryFilter, ...)
        ├── pages/            # Route-level components (Home, Products)
        ├── hooks/            # useProducts, useStats, useIntersectionObserver
        ├── services/         # Axios API client
        ├── layouts/          # RootLayout (Navbar + outlet)
        ├── types/            # Shared TypeScript interfaces
        └── lib/              # Utilities, QueryClient setup
```

---

## Local Development

### Prerequisites

- Node.js 20+
- A Neon account with a PostgreSQL database

### 1. Clone

```bash
git clone https://github.com/your-org/codevector
cd codevector
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Fill in DATABASE_URL from your Neon dashboard
npm install
npm run db:generate
npm run db:push
npm run seed        # ~2-4 minutes for 200k products
npm run dev
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:3001/api
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## API Reference

### `GET /api/products`

Returns paginated products sorted by `(updatedAt DESC, id DESC)`.

**Query parameters**

| Param | Type | Default | Description |
|---|---|---|---|
| `limit` | `number` | `20` | Items per page (1–100) |
| `cursor` | `string` | — | Base64url-encoded cursor from `nextCursor` |
| `category` | `string` | — | Filter by category |

**Response**

```json
{
  "success": true,
  "products": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "name": "Pro Wireless Headphones 3421",
      "category": "Electronics",
      "price": "299.99",
      "createdAt": "2024-03-15T10:30:00.000Z",
      "updatedAt": "2025-09-20T14:22:00.000Z"
    }
  ],
  "nextCursor": "eyJ1cGRhdGVkQXQiOiIyMDI1LTA5LTIwVDE0OjIyOjAwLjAwMFoiLCJpZCI6ImY0N2FjMTBiLTU4Y2MtNDM3Mi1hNTY3LTBlMDJiMmMzZDQ3OSJ9",
  "hasMore": true
}
```

Pass `nextCursor` as `cursor` in the next request to get the next page.

### `GET /api/products/stats`

```json
{
  "success": true,
  "totalProducts": 200000,
  "categories": 8,
  "dbSize": "142 MB",
  "categoryBreakdown": [
    { "category": "Electronics", "count": 25234 }
  ]
}
```

### `GET /health`

```json
{ "status": "ok", "timestamp": "2025-10-01T00:00:00.000Z" }
```

---

## Deployment Guide

### Neon (Database)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project and database
3. Copy the **connection string** (with `?sslmode=require`)
4. Set it as `DATABASE_URL` in your backend environment

### Render (Backend)

1. Sign up at [render.com](https://render.com)
2. New → **Web Service** → connect your GitHub repo
3. Set **Root Directory** to `backend`
4. **Build Command:** `npm install && npx prisma generate && npm run build`
5. **Start Command:** `node dist/src/index.js`
6. Add environment variables:
   - `DATABASE_URL` — from Neon
   - `NODE_ENV=production`
   - `CORS_ORIGIN` — your Vercel frontend URL
7. Deploy and note the service URL

### Vercel (Frontend)

1. Sign up at [vercel.com](https://vercel.com)
2. New Project → import your GitHub repo
3. Set **Root Directory** to `frontend`
4. **Framework Preset:** Vite
5. Add environment variable:
   - `VITE_API_URL` — your Render backend URL + `/api`
6. Deploy

---

## Seed Script Details

The seed generates 200,000 products via batched `createMany` calls (1,000 rows per batch = 200 round trips). Each product:

- Gets a randomized name from category-specific word lists
- Has a price appropriate to its category
- Has `createdAt` and `updatedAt` spread across the past 2 years
- `updatedAt` is always ≥ `createdAt`

Run time: ~2–4 minutes depending on Neon region latency.

```bash
npm run seed
```

---

## Performance

| Scenario | Approach |
|---|---|
| 200k row browse | Composite index + cursor pagination |
| Category filter | Dedicated `(category, updatedAt, id)` index |
| Frontend render | TanStack Query cache + React virtualization-friendly grid |
| Concurrent inserts | Cursor position unaffected by newer `updatedAt` values |
| Rate limiting | 300 req/min per IP |
