# Bean & Bloom - Professional Database Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        WEB BROWSER                              │
│  (index.html, cart.html, admin-product-categories.html, etc.)  │
│                                                                  │
│  Uses: api-client.js library for all API calls                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ HTTP Requests/Responses
                     │ (JSON over HTTP)
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS SERVER                             │
│                   (PORT 3001)                                    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  API Routes                                         │        │
│  │  • /api/categories   → categories.js                │        │
│  │  • /api/products     → products.js                  │        │
│  │  • /api/cart        → cart.js (calculates total)   │        │
│  │  • /api/auth        → auth.js (login/register)     │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  Middleware                                         │        │
│  │  • CORS (allow frontend requests)                   │        │
│  │  • Body Parser (JSON parsing)                       │        │
│  │  • MySQL Connection Pool                           │        │
│  └─────────────────────────────────────────────────────┘        │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ SQL Queries
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MySQL DATABASE                                │
│                  (bean_bloom)                                    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  Core Tables                                        │        │
│  │                                                     │        │
│  │  ┌──────────────┐    ┌──────────────┐              │        │
│  │  │  categories  │◄───┤  products    │              │        │
│  │  │ (7 items)    │    │ (5+ items)   │              │        │
│  │  └──────────────┘    └──────┬───────┘              │        │
│  │                            │                       │        │
│  │                            │                       │        │
│  │                     ┌──────▼────────┐              │        │
│  │                     │     cart       │              │        │
│  │                     │  (persisted)   │◄─────────────┼──────  │
│  │                     └────────────────┘              │        │
│  │                                                     │        │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │        │
│  │  │    users     │  │    orders    │  │order_items
│  │  │  (admin)     │  │  (history)   │  │ (detail) │ │        │
│  │  └──────────────┘  └──────────────┘  └──────────┘ │        │
│  └─────────────────────────────────────────────────────┘        │
│                                                                  │
│  ✨ All calculations (totalValue, discounts, etc.)             │
│     happen here in the database                                 │
│  ✨ Cart value consistent across all devices                   │
│  ✨ Professional data persistence and integrity               │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Adding to Cart (Professional Method)
```
User clicks "Add to cart"
    ↓
Frontend calls: BeanbBloomAPI.Cart.add(productId, qty)
    ↓
HTTP POST /api/cart { product_id, quantity }
    ↓
Express receives request
    ↓
Check if product exists in MySQL
    ↓
INSERT INTO cart or UPDATE quantity
    ↓
Return success response
    ↓
Frontend displays "Added to cart"
```

### 2. Fetching Cart Value (Database-Backed) ✨
```
User opens cart page
    ↓
Frontend calls: BeanbBloomAPI.Cart.getCartValue()
    ↓
HTTP GET /api/cart
    ↓
Express queries MySQL:
    SELECT c.*, p.name, p.price
    FROM cart c
    JOIN products p ON c.product_id = p.id
    ↓
MySQL calculates:
    SUM(p.price * c.quantity) as totalValue
    ↓
Returns: { items: [...], totalValue: 123.45, itemCount: 5 }
    ↓
Frontend uses totalValue from database (not calculated)
    ↓
Display consistent cart value everywhere
```

### 3. Creating Products (Admin)
```
Admin logs in → admin-product-categories.html
    ↓
Fills product form (name, price, category, image, description)
    ↓
Clicks "Save product"
    ↓
Generates UUID: const id = crypto.randomUUID()
    ↓
Calls: BeanbBloomAPI.Products.create({id, name, price, ...})
    ↓
HTTP POST /api/products with all data
    ↓
Express validates and inserts into MySQL products table
    ↓
Product immediately appears:
  - On admin categories page
  - On public index.html category grid
  - In category.html for that category
```

## Key Improvements Over localStorage

| Feature | localStorage | MySQL Database |
|---------|-------------|----------------|
| **Persistence** | Per-browser only | Server-side, permanent |
| **Consistency** | Different on each device | Same everywhere |
| **Cart Value** | Calculated frontend (inconsistent) | Calculated by MySQL (accurate) |
| **Scalability** | ~5MB limit | Unlimited |
| **Security** | No authentication | User/Admin authentication |
| **Data Integrity** | Can be manually deleted | Protected by database |
| **Multi-user** | Single user per browser | Multiple users supported |
| **Order History** | Not tracked | Full order tracking |
| **Real-time Sync** | Not possible | Possible with polling/WebSockets |

## How Cart Value Works Now

**Backend** (routes/cart.js):
```javascript
async router.get('/', async (req, res) => {
  const [cartItems] = await connection.execute(`
    SELECT c.*, p.name, p.price, p.image_url, p.category_id, cat.name as category_name
    FROM cart c
    JOIN products p ON c.product_id = p.id
    LEFT JOIN categories cat ON p.category_id = cat.id
  `);
  
  // MySQL calculates total
  const totalValue = cartItems.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );
  
  res.json({
    items: cartItems,
    totalValue: parseFloat(totalValue.toFixed(2)), // Accurate, from DB
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
  });
});
```

**Frontend** (app.js renderCartFromAPI):
```javascript
const cartData = await BeanbBloomAPI.Cart.getCartValue();
// cartData.totalValue ← from database, always correct
const total = cartData.totalValue; // Use directly, no calculation
const discount = total * 0.08;
const totalAmount = total - discount - coupon + platformFee;
// Display to user
```

---

**Result**: Professional, database-backed cart system! ☕💾
