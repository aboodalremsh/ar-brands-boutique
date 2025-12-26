const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to fetch category.' });
  }
};

// Create category (Admin only)
const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required.' });
    }

    // Check if category exists
    const [existing] = await pool.query(
      'SELECT id FROM categories WHERE name = ? OR slug = ?',
      [name, slug]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Category with this name or slug already exists.' });
    }

    const categoryId = uuidv4();
    await pool.query(
      'INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)',
      [categoryId, name, slug]
    );

    const [newCategory] = await pool.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
    res.status(201).json(newCategory[0]);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category.' });
  }
};

// Update category (Admin only)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    // Check if category exists
    const [existing] = await pool.query('SELECT id FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    // Check for duplicate name/slug
    const [duplicate] = await pool.query(
      'SELECT id FROM categories WHERE (name = ? OR slug = ?) AND id != ?',
      [name, slug, id]
    );
    if (duplicate.length > 0) {
      return res.status(400).json({ error: 'Category with this name or slug already exists.' });
    }

    await pool.query(
      'UPDATE categories SET name = ?, slug = ? WHERE id = ?',
      [name, slug, id]
    );

    const [updated] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category.' });
  }
};

// Delete category (Admin only)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.query('SELECT id FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category.' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
