const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function safeAlter(connection, sql) {
  try {
    await connection.execute(sql);
  } catch (error) {
    // Ignore duplicate column / already-exists style errors
    if (!/Duplicate column|ER_DUP_FIELDNAME|already exists/i.test(error.message)) {
      console.warn('Alter skipped:', error.message);
    }
  }
}

async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('✓ Connected to MySQL');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) NULL,
        image_url LONGTEXT,
        description LONGTEXT,
        sort_order INT NOT NULL DEFAULT 0,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sku VARCHAR(64) NULL,
        price DECIMAL(10, 2) NOT NULL,
        compare_at_price DECIMAL(10, 2) NULL,
        category_id INT NOT NULL,
        image_url LONGTEXT,
        description LONGTEXT,
        long_description LONGTEXT,
        stock INT NOT NULL DEFAULT 0,
        featured TINYINT(1) NOT NULL DEFAULT 0,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);
    await safeAlter(connection, 'ALTER TABLE products ADD COLUMN sku VARCHAR(64) NULL');
    await safeAlter(connection, 'ALTER TABLE products ADD COLUMN compare_at_price DECIMAL(10, 2) NULL');
    await safeAlter(connection, 'ALTER TABLE products ADD COLUMN long_description LONGTEXT');
    await safeAlter(connection, 'ALTER TABLE products ADD COLUMN stock INT NOT NULL DEFAULT 0');
    await safeAlter(connection, 'ALTER TABLE products ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS cart (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        product_id VARCHAR(36) NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_product (user_id, product_id),
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        public_id VARCHAR(36) NULL,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NULL,
        phone VARCHAR(32) NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NULL,
        role ENUM('admin', 'customer') DEFAULT 'customer',
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    await safeAlter(connection, 'ALTER TABLE users ADD COLUMN public_id VARCHAR(36) NULL');
    await safeAlter(connection, 'ALTER TABLE users ADD COLUMN email VARCHAR(255) NULL');
    await safeAlter(connection, 'ALTER TABLE users ADD COLUMN phone VARCHAR(32) NULL');
    await safeAlter(connection, 'ALTER TABLE users ADD COLUMN full_name VARCHAR(255) NULL');
    await safeAlter(connection, 'ALTER TABLE users ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS customer_addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        line1 VARCHAR(255) NOT NULL,
        line2 VARCHAR(255) NULL,
        city VARCHAR(120) NOT NULL,
        state VARCHAR(120) NOT NULL,
        pincode VARCHAR(12) NOT NULL,
        landmark VARCHAR(255) NULL,
        is_default TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS discounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(64) NULL,
        scope ENUM('store', 'category', 'product') NOT NULL DEFAULT 'store',
        value_type ENUM('percent', 'fixed') NOT NULL DEFAULT 'percent',
        value DECIMAL(10, 2) NOT NULL,
        category_id INT NULL,
        product_id VARCHAR(36) NULL,
        starts_at DATETIME NULL,
        ends_at DATETIME NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        usage_limit INT NULL,
        used_count INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Prefer the commerce-ready orders table (VARCHAR ids + Razorpay fields).
    // If a legacy INT-id orders table exists, create shop_orders as the new store.
    let ordersTable = 'orders';
    try {
      const [cols] = await connection.execute(
        `SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'id'`
      );
      if (cols.length && String(cols[0].DATA_TYPE).toLowerCase() !== 'varchar') {
        ordersTable = 'shop_orders';
        console.log('ℹ Legacy orders table detected — using shop_orders for Razorpay commerce');
      }
    } catch (_) {}

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ${ordersTable} (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(36) NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_mobile VARCHAR(20) NOT NULL,
        customer_email VARCHAR(255) NULL,
        address_line1 VARCHAR(255) NOT NULL,
        address_line2 VARCHAR(255) NULL,
        city VARCHAR(120) NOT NULL,
        state VARCHAR(120) NOT NULL,
        pincode VARCHAR(12) NOT NULL,
        landmark VARCHAR(255) NULL,
        subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
        discount_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
        total_amount DECIMAL(10, 2) NOT NULL,
        currency CHAR(3) NOT NULL DEFAULT 'INR',
        pay_method VARCHAR(32) NOT NULL DEFAULT 'razorpay',
        status VARCHAR(40) NOT NULL DEFAULT 'Paid',
        payment_verified TINYINT(1) NOT NULL DEFAULT 0,
        payment_verified_at DATETIME NULL,
        razorpay_payment_id VARCHAR(64) NULL,
        razorpay_order_id VARCHAR(64) NULL,
        razorpay_signature VARCHAR(255) NULL,
        discounts_json JSON NULL,
        notes LONGTEXT NULL,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(64) NOT NULL,
        product_id VARCHAR(36) NULL,
        product_name VARCHAR(255) NOT NULL,
        category_name VARCHAR(255) NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        line_discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
        line_total DECIMAL(10, 2) NOT NULL,
        INDEX idx_order_items_order (order_id)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message LONGTEXT NOT NULL,
        is_read TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await safeAlter(connection, 'ALTER TABLE inquiries ADD COLUMN is_read TINYINT(1) NOT NULL DEFAULT 0');

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS product_reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(36) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        rating TINYINT NOT NULL,
        comment LONGTEXT NOT NULL,
        is_approved TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(120) NOT NULL UNIQUE,
        setting_value LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        source VARCHAR(64) NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure demo admin exists
    await connection.execute(
      `INSERT IGNORE INTO users (username, password, role, full_name) VALUES ('admin', 'admin', 'admin', 'Cafe Admin')`
    );

    app.locals.ordersTable = ordersTable;
    connection.release();
    console.log('\n✓ Database initialized successfully!\n');
  } catch (error) {
    console.error('✗ Database initialization error:', error.message);
    process.exit(1);
  }
}

const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const authRoutes = require('./routes/auth');
const inquiryRoutes = require('./routes/inquiries');
const reviewRoutes = require('./routes/reviews');
const orderRoutes = require('./routes/orders');
const discountRoutes = require('./routes/discounts');

app.use('/api/categories', categoryRoutes(pool));
app.use('/api/products', productRoutes(pool));
app.use('/api/cart', cartRoutes(pool));
app.use('/api/auth', authRoutes(pool));
app.use('/api/inquiries', inquiryRoutes(pool));
app.use('/api/reviews', reviewRoutes(pool));
app.use('/api/orders', orderRoutes(pool));
app.use('/api/discounts', discountRoutes(pool));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date(),
    razorpayConfigured: Boolean(process.env.RAZORPAY_KEY_SECRET),
    ordersTable: app.locals.ordersTable || 'orders'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log('Bean & Bloom Backend Server');
  console.log(`Running on http://localhost:${PORT}`);
  console.log('Initializing database...\n');
  await initializeDatabase();
});

module.exports = { pool };
