const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

// Helper to parse JSON fields
const parseProductJSON = (product) => ({
  ...product,
  images: typeof product.images === 'string' ? JSON.parse(product.images) : product.images || [],
  sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes || [],
  colors: typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors || []
});

// Get all products with filters
const getAllProducts = async (req, res) => {
  try {
    const { category_id, search, min_price, max_price, featured, available } = req.query;
    
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    if (category_id) {
      query += ' AND p.category_id = ?';
      params.push(category_id);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (min_price) {
      query += ' AND p.price >= ?';
      params.push(parseFloat(min_price));
    }

    if (max_price) {
      query += ' AND p.price <= ?';
      params.push(parseFloat(max_price));
    }

    if (featured === 'true') {
      query += ' AND p.is_featured = TRUE';
    }

    if (available === 'true') {
      query += ' AND p.is_available = TRUE';
    }

    query += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.query(query, params);
    const products = rows.map(parseProductJSON);
    
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    
    res.json(parseProductJSON(rows[0]));
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
};

// Create product (Admin only)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category_id,
      images,
      sizes,
      colors,
      is_available,
      is_featured
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required.' });
    }

    const productId = uuidv4();
    
    await pool.query(`
      INSERT INTO products (id, name, description, price, category_id, images, sizes, colors, is_available, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      productId,
      name,
      description || null,
      parseFloat(price),
      category_id || null,
      JSON.stringify(images || []),
      JSON.stringify(sizes || []),
      JSON.stringify(colors || []),
      is_available !== false,
      is_featured === true
    ]);

    const [newProduct] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `, [productId]);

    res.status(201).json(parseProductJSON(newProduct[0]));
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product.' });
  }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category_id,
      images,
      sizes,
      colors,
      is_available,
      is_featured
    } = req.body;

    // Check if product exists
    const [existing] = await pool.query('SELECT id FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    await pool.query(`
      UPDATE products SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        category_id = ?,
        images = COALESCE(?, images),
        sizes = COALESCE(?, sizes),
        colors = COALESCE(?, colors),
        is_available = COALESCE(?, is_available),
        is_featured = COALESCE(?, is_featured),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      name,
      description,
      price ? parseFloat(price) : null,
      category_id,
      images ? JSON.stringify(images) : null,
      sizes ? JSON.stringify(sizes) : null,
      colors ? JSON.stringify(colors) : null,
      is_available,
      is_featured,
      id
    ]);

    const [updated] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `, [id]);

    res.json(parseProductJSON(updated[0]));
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product.' });
  }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product.' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
