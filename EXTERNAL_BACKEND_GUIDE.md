# AR Brands - Full Stack External Setup Guide

This guide provides everything you need to build the backend externally with Node.js, Express, and MySQL.

---

## 📁 Project Structure

```
ar-brands/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── categoryController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── categoryRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   └── (React Vite project)
└── database/
    └── schema.sql
```

---

## 🗄️ MySQL Database Schema (phpMyAdmin Compatible)

```sql
-- =============================================
-- AR Brands Database Schema
-- Compatible with MySQL / phpMyAdmin
-- =============================================

CREATE DATABASE IF NOT EXISTS ar_brands;
USE ar_brands;

-- =============================================
-- Profiles Table (Users)
-- =============================================
CREATE TABLE profiles (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Categories Table
-- =============================================
CREATE TABLE categories (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Products Table
-- =============================================
CREATE TABLE products (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id CHAR(36),
    images JSON,
    sizes JSON,
    colors JSON,
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_featured (is_featured),
    INDEX idx_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Insert Default Admin User
-- Password: admin123 (bcrypt hashed)
-- =============================================
INSERT INTO profiles (id, email, password, is_admin) VALUES (
    UUID(),
    'admin@arbrands.com',
    '$2b$10$rIC/UqF.6OQ6XkGHV6kXxOJGHN8IjLM3rHN8yPqRKmNvMdMVxQPyS',
    TRUE
);

-- =============================================
-- Insert Sample Categories
-- =============================================
INSERT INTO categories (id, name, slug) VALUES
    (UUID(), 'T-Shirts', 't-shirts'),
    (UUID(), 'Hoodies', 'hoodies'),
    (UUID(), 'Pants', 'pants'),
    (UUID(), 'Accessories', 'accessories');
```

---

## 📦 Backend Package.json

```json
{
  "name": "ar-brands-backend",
  "version": "1.0.0",
  "description": "AR Brands E-commerce Backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "mysql2": "^3.6.5",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## 🔧 Backend Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ar_brands

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

---

## 🗂️ Backend Files

### config/db.js

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

### middleware/authMiddleware.js

```javascript
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [rows] = await pool.execute(
      'SELECT id, email, is_admin FROM profiles WHERE id = ?',
      [decoded.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
```

### middleware/adminMiddleware.js

```javascript
const adminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

module.exports = adminMiddleware;
```

### controllers/authController.js

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Check if user exists
    const [existing] = await pool.execute(
      'SELECT id FROM profiles WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // Create user
    await pool.execute(
      'INSERT INTO profiles (id, email, password) VALUES (?, ?, ?)',
      [userId, email, hashedPassword]
    );

    // Generate token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: { id: userId, email, is_admin: false }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user
    const [rows] = await pool.execute(
      'SELECT * FROM profiles WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.json({
      message: 'Login successful.',
      token,
      user: { id: user.id, email: user.email, is_admin: user.is_admin }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.getProfile = async (req, res) => {
  res.json({ user: req.user });
};
```

### controllers/productController.js

```javascript
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

exports.getAllProducts = async (req, res) => {
  try {
    const { category, featured, available, search } = req.query;
    
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    if (featured === 'true') {
      query += ' AND p.is_featured = TRUE';
    }

    if (available === 'true') {
      query += ' AND p.is_available = TRUE';
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.execute(query, params);
    
    // Parse JSON fields
    const products = rows.map(row => ({
      ...row,
      images: JSON.parse(row.images || '[]'),
      sizes: JSON.parse(row.sizes || '[]'),
      colors: JSON.parse(row.colors || '[]')
    }));

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(
      `SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const product = {
      ...rows[0],
      images: JSON.parse(rows[0].images || '[]'),
      sizes: JSON.parse(rows[0].sizes || '[]'),
      colors: JSON.parse(rows[0].colors || '[]')
    };

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, images, sizes, colors, is_available, is_featured } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required.' });
    }

    const productId = uuidv4();

    await pool.execute(
      `INSERT INTO products (id, name, description, price, category_id, images, sizes, colors, is_available, is_featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productId,
        name,
        description || null,
        price,
        category_id || null,
        JSON.stringify(images || []),
        JSON.stringify(sizes || []),
        JSON.stringify(colors || []),
        is_available !== false,
        is_featured === true
      ]
    );

    res.status(201).json({ message: 'Product created.', id: productId });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, images, sizes, colors, is_available, is_featured } = req.body;

    const [existing] = await pool.execute('SELECT id FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    await pool.execute(
      `UPDATE products SET 
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        category_id = ?,
        images = COALESCE(?, images),
        sizes = COALESCE(?, sizes),
        colors = COALESCE(?, colors),
        is_available = COALESCE(?, is_available),
        is_featured = COALESCE(?, is_featured)
       WHERE id = ?`,
      [
        name,
        description,
        price,
        category_id,
        images ? JSON.stringify(images) : null,
        sizes ? JSON.stringify(sizes) : null,
        colors ? JSON.stringify(colors) : null,
        is_available,
        is_featured,
        id
      ]
    );

    res.json({ message: 'Product updated.' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json({ message: 'Product deleted.' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};
```

### controllers/categoryController.js

```javascript
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

exports.getAllCategories = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM categories ORDER BY name');
    res.json(rows);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required.' });
    }

    const categoryId = uuidv4();

    await pool.execute(
      'INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)',
      [categoryId, name, slug]
    );

    res.status(201).json({ message: 'Category created.', id: categoryId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Category already exists.' });
    }
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM categories WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.json({ message: 'Category deleted.' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};
```

### routes/authRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
```

### routes/productRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware, adminMiddleware, productController.createProduct);
router.put('/:id', authMiddleware, adminMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = router;
```

### routes/categoryRoutes.js

```javascript
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', categoryController.getAllCategories);
router.post('/', authMiddleware, adminMiddleware, categoryController.createCategory);
router.delete('/:id', authMiddleware, adminMiddleware, categoryController.deleteCategory);

module.exports = router;
```

### server.js

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## 🚀 Setup Instructions

### 1. Setup MySQL Database

1. Open phpMyAdmin
2. Create new database: `ar_brands`
3. Import the SQL schema from above
4. Default admin: `admin@arbrands.com` / `admin123`

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env  # Edit with your DB credentials
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Configure Frontend API

Create `frontend/src/config/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 📡 API Endpoints Summary

| Method | Endpoint | Auth | Admin | Description |
|--------|----------|------|-------|-------------|
| POST | /api/auth/register | ❌ | ❌ | Register user |
| POST | /api/auth/login | ❌ | ❌ | Login user |
| GET | /api/auth/profile | ✅ | ❌ | Get profile |
| GET | /api/products | ❌ | ❌ | List products |
| GET | /api/products/:id | ❌ | ❌ | Get product |
| POST | /api/products | ✅ | ✅ | Create product |
| PUT | /api/products/:id | ✅ | ✅ | Update product |
| DELETE | /api/products/:id | ✅ | ✅ | Delete product |
| GET | /api/categories | ❌ | ❌ | List categories |
| POST | /api/categories | ✅ | ✅ | Create category |
| DELETE | /api/categories/:id | ✅ | ✅ | Delete category |

---

## ✅ Production Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use HTTPS in production
- [ ] Set proper CORS origins
- [ ] Add rate limiting
- [ ] Add input validation (express-validator)
- [ ] Add request logging (morgan)
- [ ] Use PM2 for process management
- [ ] Setup database backups
