const { pool } = require('../config/db');

const Product = {
  create: async (productData) => {
    const { name, slug, description, price, stock, brand, image, category_id, is_featured } = productData;
    const [result] = await pool.execute(
      `INSERT INTO products (name, slug, description, price, stock, brand, image, category_id, is_featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description, price, stock, brand, image, category_id, is_featured || false]
    );
    return result.insertId;
  },

  findAll: async (filters = {}) => {
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    if (filters.category_id) {
      query += ' AND p.category_id = ?';
      params.push(filters.category_id);
    }

    if (filters.search) {
      query += ' AND (p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (filters.featured) {
      query += ' AND p.is_featured = TRUE';
    }

    query += ' ORDER BY p.created_at DESC';
    
    const [rows] = await pool.execute(query, params);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.execute(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  },

  update: async (id, productData) => {
    const { name, slug, description, price, stock, brand, image, category_id, is_featured } = productData;
    const [result] = await pool.execute(
      `UPDATE products SET 
        name = ?, slug = ?, description = ?, price = ?, 
        stock = ?, brand = ?, image = ?, category_id = ?, is_featured = ?
       WHERE id = ?`,
      [name, slug, description, price, stock, brand, image, category_id, is_featured, id]
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = Product;