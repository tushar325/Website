# Bean & Bloom Backend Setup Guide

## Prerequisites

1. **Node.js** - Download from https://nodejs.org/ (v14 or higher)
2. **MySQL** - Download from https://dev.mysql.com/downloads/mysql/ (or use MySQL Community Server)

## Step-by-Step Setup

### 1. Install MySQL

**On Windows:**
- Download MySQL Community Server from https://dev.mysql.com/downloads/mysql/
- Run the installer and follow the setup wizard
- Default port: 3306
- Create root user with password (or leave blank)

**On Mac (using Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**On Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

### 2. Create Database

Open MySQL and run:

```sql
CREATE DATABASE bean_bloom;
USE bean_bloom;
```

### 3. Install Backend Dependencies

```bash
npm install
```

### 4. Configure Environment (.env)

Update `.env` file in the Website directory with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=bean_bloom
DB_PORT=3306
PORT=3001
NODE_ENV=development
```

### 5. Start the Backend Server

```bash
npm start
```

You should see:
```
Bean & Bloom Backend Server
Running on http://localhost:3001
✓ Connected to MySQL
✓ Database initialized successfully!
```

### 6. API Endpoints

**Categories:**
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

**Products:**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

**Cart:**
- `GET /api/cart` - Get cart items and total value ✨
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item quantity
- `DELETE /api/cart/:productId` - Remove item from cart

**Auth:**
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register user

### 7. Seed Database with Initial Data (Optional)

Run the provided initialization script:

```bash
node scripts/seed-database.js
```

## Troubleshooting

**Connection refused error:**
- Make sure MySQL is running: `mysql.server start` (Mac) or start MySQL service (Windows)
- Check if port 3306 is correct in .env

**Access denied error:**
- Verify username and password in .env match your MySQL setup
- Default MySQL user is usually `root` with no password initially

**Port already in use:**
- Change PORT in .env to another port like 3002
- Or kill process using port 3001: `lsof -ti:3001 | xargs kill -9` (Mac/Linux)

## Next Steps

1. Update frontend (index.html, etc.) to use API endpoints instead of localStorage
2. Replace localStorage calls with fetch() to `/api/cart`, `/api/products`, etc.
3. Update cart value fetching to use database results
4. Implement proper authentication with JWT tokens
5. Add data validation and error handling
