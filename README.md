# Bean & Bloom — specialty cafe storefront

Static HTML/CSS/JS shopfront with an Express + MySQL backend.

## Quick start

1. Install MySQL and create the `bean_bloom` database.
2. Copy `.env.example` → `.env` and set DB + Razorpay secrets.
3. Import tables: `mysql -u root -p bean_bloom < schema.sql`
4. `npm install && npm start` (API on port **3001**)
5. Open the HTML pages in a browser (or any static server).

**Full MySQL connection steps:** see [`MYSQL_CONNECTION.md`](./MYSQL_CONNECTION.md).

## Admin portal

- Login: `admin` / `admin` (demo)
- Pages: Dashboard, Analytics, Product categories, Orders, Customers, Inventory, **Discounts**, Settings
- Payments: **Razorpay only** — configure Key ID in Settings; verify payments on Orders
- Product short/long descriptions are edited under Product categories (not Settings)

## Key files

| File | Purpose |
|---|---|
| `schema.sql` | Full MySQL schema |
| `MYSQL_CONNECTION.md` | How to connect MySQL |
| `server.js` | Express API + table bootstrap |
| `api-client.js` | Browser → API helper |
| `checkout.html` | Razorpay checkout |
| `admin-discounts.html` | Store / category / product discounts |
