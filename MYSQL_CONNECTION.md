# MySQL connection guide — Bean & Bloom

This document explains how to connect the Node.js API (`server.js`) to MySQL so products, carts, orders, discounts, and Razorpay payment IDs persist in the database.

## 1. Install MySQL

**Windows:** [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

**macOS (Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**Ubuntu / Debian:**
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

Confirm the service is running:
```bash
mysql --version
```

## 2. Create the database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE bean_bloom CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'beanbloom'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON bean_bloom.* TO 'beanbloom'@'localhost';
FLUSH PRIVILEGES;
USE bean_bloom;
SOURCE /absolute/path/to/Website/schema.sql;
EXIT;
```

You can also use the root user during local development.

## 3. Configure `.env`

Copy or edit `.env` in the project root:

```env
DB_HOST=localhost
DB_USER=beanbloom
DB_PASSWORD=your_strong_password
DB_NAME=bean_bloom
DB_PORT=3306
PORT=3001
NODE_ENV=development

# Razorpay — Key ID is also set in Admin → Settings for Checkout.js
# Key Secret stays on the server only (never in the browser)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

| Variable | Purpose |
|---|---|
| `DB_HOST` | MySQL host (`localhost` or a remote IP) |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name (`bean_bloom`) |
| `DB_PORT` | Usually `3306` |
| `PORT` | Express API port (`3001`) |
| `RAZORPAY_KEY_ID` | Public key (optional server-side mirror) |
| `RAZORPAY_KEY_SECRET` | Private key for signature verification |

## 4. Install dependencies and start the API

```bash
cd /path/to/Website
npm install
npm start
```

Successful startup looks like:

```text
Bean & Bloom Backend Server
Running on http://localhost:3001
✓ Connected to MySQL
✓ Database initialized successfully!
```

Health check:
```bash
curl http://localhost:3001/api/health
```

## 5. How the app connects

`server.js` creates a **connection pool** with `mysql2/promise`:

```js
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10
});
```

On boot it ensures tables exist (same shape as `schema.sql`). Routes under `routes/` receive the pool and run queries.

The browser talks to the API through `api-client.js` (`http://localhost:3001/api`).

## 6. Full table map

| Table | Role |
|---|---|
| `categories` | Product categories |
| `products` | Catalog (price, stock, short/long description, SKU) |
| `users` | Admins + customers |
| `customer_addresses` | Saved delivery addresses |
| `cart` | Per-user cart lines |
| `discounts` | Store / category / product discounts |
| `orders` | Orders + Razorpay IDs + verification flags |
| `order_items` | Line items for each order |
| `site_settings` | Optional JSON settings mirror |
| `inquiries` | Contact form messages |
| `product_reviews` | Product ratings |
| `newsletter_subscribers` | Email signups |

## 7. Razorpay + MySQL flow

1. Admin enables Razorpay and saves **Key ID** in Settings (public).
2. Customer pays in Razorpay Checkout.
3. Checkout stores `razorpay_payment_id` (and optional order id / signature) on the order.
4. Order is saved locally and posted to `POST /api/orders` when the API is up.
5. Admin opens **Orders** and clicks **Verify Razorpay payment** after checking the payment in the Razorpay dashboard (or after server-side signature verify using `RAZORPAY_KEY_SECRET`).

## 8. Common connection errors

| Error | Fix |
|---|---|
| `ECONNREFUSED` | MySQL is not running — start the service |
| `ER_ACCESS_DENIED_ERROR` | Wrong `DB_USER` / `DB_PASSWORD` in `.env` |
| `ER_BAD_DB_ERROR` | Create `bean_bloom` database |
| `ER_NOT_SUPPORTED_AUTH_MODE` | Use `mysql_native_password` or MySQL 8 caching_sha2 with mysql2 |
| Frontend cannot reach API | Serve site + keep `npm start` on port 3001; check CORS |

Reset local schema (destructive):
```sql
DROP DATABASE bean_bloom;
CREATE DATABASE bean_bloom CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bean_bloom;
SOURCE schema.sql;
```

## 9. Remote MySQL (optional)

For a hosted DB (RDS, PlanetScale, Aiven, etc.):

```env
DB_HOST=your-host.example.com
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=bean_bloom
```

Allow your app server IP in the host firewall / security group. Prefer SSL in production (`ssl: { rejectUnauthorized: true }` on the pool).

---

See also: `BACKEND_SETUP.md`, `schema.sql`, Admin → **Discounts** and **Orders**.
