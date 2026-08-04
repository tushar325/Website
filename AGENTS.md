# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

This repo contains **Bean & Bloom** — a static HTML/CSS/JS specialty coffee e-commerce storefront with an optional Node.js + MySQL API — and a secondary **Coffee Light** WordPress theme under `wp-content/themes/coffee-light/` (requires a separate WordPress/PHP stack; not covered here).

### Services (Bean & Bloom full stack)

| Service | Command | Port |
|---------|---------|------|
| MySQL | `sudo service mysql start` | 3306 |
| Express API | `npm start` | 3001 |
| Static frontend | `npx serve -l 8080` | 8080 |

The Express server serves **API only** (`/api/*`). HTML pages must be served over HTTP (not `file://`) so `fetch()` calls to the API work.

### MySQL setup (Ubuntu)

On fresh Ubuntu VMs, MySQL `root` uses `auth_socket` by default and Node.js cannot connect with an empty password. Run once after install:

```bash
sudo mysql -e "CREATE DATABASE IF NOT EXISTS bean_bloom;"
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

Credentials match `.env`: `DB_USER=root`, `DB_PASSWORD=` (empty), `DB_NAME=bean_bloom`.

### Database seeding

Tables are auto-created when the API starts (`npm start`). Seed sample data (optional):

```bash
node scripts/seed-database.js
```

### Demo credentials

- **Customer**: register any account via Sign in, or use a test account created during setup.
- **Admin**: `admin` / `admin` (also seeded in MySQL).

### Lint / tests

No lint or test scripts are defined in `package.json`. Validation is manual: start services and exercise the storefront + admin flows.

### Gotchas

- `npm start` exits if MySQL is unreachable — start MySQL first.
- Most storefront data (products, cart, orders) lives in **localStorage**; the API backs reviews, inquiries, and optional cart sync.
- Razorpay payments are disabled by default (`razorpayEnabled: false` in admin settings).
