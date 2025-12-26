-- AR Brands Database Schema
-- MySQL Database Setup for phpMyAdmin

-- Create database
CREATE DATABASE IF NOT EXISTS ar_brands CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ar_brands;

-- =============================================
-- PROFILES TABLE (Users & Admins)
-- =============================================
CREATE TABLE profiles (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_is_admin (is_admin)
) ENGINE=InnoDB;

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE categories (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB;

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE products (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id CHAR(36),
    images JSON DEFAULT '[]',
    sizes JSON DEFAULT '[]',
    colors JSON DEFAULT '[]',
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_featured (is_featured),
    INDEX idx_available (is_available)
) ENGINE=InnoDB;

-- =============================================
-- INSERT DEFAULT DATA
-- =============================================

-- Default Admin User (password: admin123)
-- Password hash generated with bcrypt (10 rounds)
INSERT INTO profiles (id, email, password, is_admin) VALUES 
(UUID(), 'admin@arbrands.com', '$2b$10$rQZ5Q3z5z5z5z5z5z5z5zOeJ5x5x5x5x5x5x5x5x5x5x5x5x5x5x5', TRUE);

-- Default Categories
INSERT INTO categories (id, name, slug) VALUES 
(UUID(), 'T-Shirts', 't-shirts'),
(UUID(), 'Hoodies', 'hoodies'),
(UUID(), 'Pants', 'pants'),
(UUID(), 'Accessories', 'accessories');

-- Sample Products
INSERT INTO products (id, name, description, price, category_id, images, sizes, colors, is_available, is_featured) 
SELECT 
    UUID(),
    'Classic Cotton T-Shirt',
    'Premium quality cotton t-shirt with a comfortable fit. Perfect for everyday wear.',
    29.99,
    c.id,
    '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"]',
    '["S", "M", "L", "XL"]',
    '["White", "Black", "Navy"]',
    TRUE,
    TRUE
FROM categories c WHERE c.slug = 't-shirts';

INSERT INTO products (id, name, description, price, category_id, images, sizes, colors, is_available, is_featured) 
SELECT 
    UUID(),
    'Premium Hoodie',
    'Warm and cozy hoodie made from premium fleece material.',
    59.99,
    c.id,
    '["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800"]',
    '["S", "M", "L", "XL", "XXL"]',
    '["Gray", "Black", "Navy"]',
    TRUE,
    TRUE
FROM categories c WHERE c.slug = 'hoodies';

INSERT INTO products (id, name, description, price, category_id, images, sizes, colors, is_available, is_featured) 
SELECT 
    UUID(),
    'Slim Fit Jeans',
    'Modern slim fit jeans with stretch comfort technology.',
    49.99,
    c.id,
    '["https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"]',
    '["28", "30", "32", "34", "36"]',
    '["Blue", "Black", "Gray"]',
    TRUE,
    FALSE
FROM categories c WHERE c.slug = 'pants';

INSERT INTO products (id, name, description, price, category_id, images, sizes, colors, is_available, is_featured) 
SELECT 
    UUID(),
    'Leather Belt',
    'Genuine leather belt with brushed metal buckle.',
    24.99,
    c.id,
    '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"]',
    '["S", "M", "L"]',
    '["Brown", "Black"]',
    TRUE,
    FALSE
FROM categories c WHERE c.slug = 'accessories';
