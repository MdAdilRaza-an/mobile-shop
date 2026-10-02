const { pool } = require('../config/db');

const Wishlist = {
  addItem: async (userId, productId) => {
    try {
      const [result] = await pool.execute(
        'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
        [userId, productId]
      );
      return result.insertId;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return null;
      }
      throw error;
    }
  },

  getWishlist: async (userId) => {
    const [rows] = await pool.execute(
      `SELECT w.id as wishlist_id, p.id as product_id, p.name, p.price, p.image, p.brand
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = ?`,
      [userId]
    );
    return rows;
  },

  removeItem: async (wishlistId, userId) => {
    const [result] = await pool.execute(
      'DELETE FROM wishlist WHERE id = ? AND user_id = ?',
      [wishlistId, userId]
    );
    return result.affectedRows;
  },

  isInWishlist: async (userId, productId) => {
    const [rows] = await pool.execute(
      'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    return rows.length > 0;
  }
};

module.exports = Wishlist;