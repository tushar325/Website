const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });

  try {
    console.log('🌱 Seeding database with initial data...\n');

    // Clear existing data
    await connection.execute('DELETE FROM order_items');
    await connection.execute('DELETE FROM orders');
    await connection.execute('DELETE FROM cart');
    await connection.execute('DELETE FROM products');
    await connection.execute('DELETE FROM categories');
    await connection.execute('DELETE FROM users');

    // Insert Categories
    const categories = [
      ['Espresso'],
      ['Espresso Gear'],
      ['Beans & Blends'],
      ['Coffee Machines'],
      ['Barista Tools'],
      ['Latte'],
      ['Pour Over']
    ];

    for (const [name] of categories) {
      await connection.execute(
        'INSERT INTO categories (name) VALUES (?)',
        [name]
      );
    }
    console.log('✓ Categories inserted');

    // Get category IDs
    const [allCategories] = await connection.execute('SELECT id, name FROM categories');
    const categoryMap = {};
    allCategories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // Insert Products
    const products = [
      {
        id: 'prod-1',
        name: 'Signature Espresso',
        price: 4.50,
        category: 'Espresso',
        description: 'Bold and velvety with caramel notes.',
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80'
      },
      {
        id: 'prod-2',
        name: 'Maple Latte',
        price: 5.20,
        category: 'Latte',
        description: 'Creamy latte with maple spice.',
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=80'
      },
      {
        id: 'prod-3',
        name: 'Golden Morning Brew',
        price: 6.00,
        category: 'Pour Over',
        description: 'Bright and floral single-origin roast.',
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80'
      },
      {
        id: 'prod-4',
        name: 'AeroPress Coffee Maker',
        price: 89.99,
        category: 'Coffee Machines',
        description: 'Compact brewer for smooth, clean coffee at home.',
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1517971071642-34a2f8df4d36?auto=format&fit=crop&w=900&q=80'
      },
      {
        id: 'prod-5',
        name: 'Barista Tool Kit',
        price: 49.99,
        category: 'Barista Tools',
        description: 'Essential accessories for home espresso and coffee brewing.',
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80'
      }
    ];

    for (const product of products) {
      const categoryId = categoryMap[product.category];
      await connection.execute(
        'INSERT INTO products (id, name, price, category_id, description, featured, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [product.id, product.name, product.price, categoryId, product.description, product.featured, product.imageUrl]
      );
    }
    console.log('✓ Products inserted');

    // Insert Admin User
    await connection.execute(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      ['admin', 'admin', 'admin']
    );
    console.log('✓ Admin user created (username: admin, password: admin)');

    console.log('\n✅ Database seeding completed successfully!\n');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedDatabase();
