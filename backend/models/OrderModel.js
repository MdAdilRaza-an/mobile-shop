const { pool } = require('../config/db');

const Order = {
  create: async (userId, totalAmount, shippingAddress, paymentMethod) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [orderResult] = await connection.execute(
        `INSERT INTO orders (user_id, total_amount, shipping_address, payment_method, payment_status) 
         VALUES (?, ?, ?, ?, 'pending')`,
        [userId, totalAmount, shippingAddress, paymentMethod]
      );
      const orderId = orderResult.insertId;

      // Get cart items
      const [cartItems] = await connection.execute(
        `SELECT c.product_id, c.quantity, p.price 
         FROM cart c 
         JOIN products p ON c.product_id = p.id 
         WHERE c.user_id = ?`,
        [userId]
      );

      // Insert order items
      for (const item of cartItems) {
        await connection.execute(
          `INSERT INTO order_items (order_id, product_id, quantity, price) 
           VALUES (?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, item.price]
        );

        // Update product stock
        await connection.execute(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      // Clear cart
      await connection.execute('DELETE FROM cart WHERE user_id = ?', [userId]);

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  getUserOrders: async (userId) => {
    const [rows] = await pool.execute(
      `SELECT o.*, 
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
       FROM orders o 
       WHERE o.user_id = ? 
       ORDER BY o.created_at DESC`,
      [userId]
    );
    return rows;
  },

  getOrderDetails: async (orderId, userId) => {
    const [order] = await pool.execute(
      `SELECT o.*, u.name, u.email 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.id = ? AND o.user_id = ?`,
      [orderId, userId]
    );

    if (order.length === 0) return null;

    const [items] = await pool.execute(
      `SELECT oi.*, p.name, p.image 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [orderId]
    );

    return { ...order[0], items };
  },

  getAllOrders: async () => {
    const [rows] = await pool.execute(
      `SELECT o.*, u.name, u.email,
        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
    );
    return rows;
  },

  updateStatus: async (orderId, status) => {
    const [result] = await pool.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );
    return result.affectedRows;
  },

  updatePaymentStatus: async (orderId, paymentStatus) => {
    const [result] = await pool.execute(
      'UPDATE orders SET payment_status = ? WHERE id = ?',
      [paymentStatus, orderId]
    );
    return result.affectedRows;
  }
};

module.exports = Order;