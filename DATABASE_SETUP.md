# Bean & Bloom - Database Setup Summary

> **Prefer the step-by-step guide:** [`MYSQL_CONNECTION.md`](./MYSQL_CONNECTION.md)  
> **Full schema:** [`schema.sql`](./schema.sql)

## What Was Created

### Database Architecture
- **MySQL Database** with commerce tables (catalog, cart, discounts, orders + Razorpay fields, reviews, settings)
- **Node.js + Express** backend server
- **API Client** for frontend communication

### Files

```
/Website
├── server.js
├── package.json
├── .env / .env.example
├── schema.sql
├── MYSQL_CONNECTION.md
├── api-client.js
├── routes/
│   ├── categories.js
│   ├── products.js
│   ├── cart.js
│   ├── auth.js
│   ├── orders.js
│   ├── discounts.js
│   ├── inquiries.js
│   └── reviews.js
└── scripts/
    └── seed-database.js
```

## Quick Start

1. Install MySQL and create `bean_bloom`
2. Configure `.env` (see `MYSQL_CONNECTION.md`)
3. `npm install && npm start`
4. Optional: `mysql -u root -p bean_bloom < schema.sql`

## Core tables

categories · products · users · customer_addresses · cart · discounts · orders · order_items · site_settings · inquiries · product_reviews · newsletter_subscribers

Orders store `razorpay_payment_id` / signature fields and a `payment_verified` flag for admin verification.
