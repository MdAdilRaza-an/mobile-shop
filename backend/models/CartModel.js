const { pool } = require('../config/db');

const Cart = {
  addItem: async (userId, productId, quantity = 1) => {
    const [existing] = await pool.execute(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existing.length > 0) {
      const [result] = await pool.execute(
        'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, userId, productId]
      );
      return result;
    } else {
      const [result] = await pool.execute(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
      return result;
    }
  },

  getCart: async (userId) => {
    const [rows] = await pool.execute(
      `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image, p.stock
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );
    return rows;
  },

  updateQuantity: async (cartId, userId, quantity) => {
    const [result] = await pool.execute(
      'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, cartId, userId]
    );
    return result.affectedRows;
  },

  removeItem: async (cartId, userId) => {
    const [result] = await pool.execute(
      'DELETE FROM cart WHERE id = ? AND user_id = ?',
      [cartId, userId]
    );
    return result.affectedRows;
  },

  clearCart: async (userId) => {
    const [result] = await pool.execute('DELETE FROM cart WHERE user_id = ?', [userId]);
    return result.affectedRows;
  },

  getCartTotal: async (userId) => {
    const [rows] = await pool.execute(
      `SELECT SUM(p.price * c.quantity) as total 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [userId]
    );
    return rows[0].total || 0;
  }
};

module.exports = Cart;