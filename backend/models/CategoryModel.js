const { pool } = require('../config/db');

const Category = {
  findAll: async () => {
    const [rows] = await pool.execute('SELECT * FROM categories ORDER BY name');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.execute('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  },

  findBySlug: async (slug) => {
    const [rows] = await pool.execute('SELECT * FROM categories WHERE slug = ?', [slug]);
    return rows[0];
  },

  create: async (name, slug) => {
    const [result] = await pool.execute('INSERT INTO categories (name, slug) VALUES (?, ?)', [name, slug]);
    return result.insertId;
  },

  update: async (id, name, slug) => {
    const [result] = await pool.execute('UPDATE categories SET name = ?, slug = ? WHERE id = ?', [name, slug, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = Category;