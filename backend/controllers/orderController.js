const Order = require('../models/OrderModel');
const Cart = require('../models/CartModel');

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please provide shipping address and payment method'
      });
    }

    const total = await Cart.getCartTotal(userId);
    if (total === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    const orderId = await Order.create(userId, total, shippingAddress, paymentMethod);

    const order = await Order.getOrderDetails(orderId, userId);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.getUserOrders(req.user.id);

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.getOrderDetails(req.params.id, req.user.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAllOrders();

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    await Order.updateStatus(id, status);

    res.json({
      success: true,
      message: 'Order status updated'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const simulatePayment = async (req, res) => {
  try {
    const { orderId, paymentDetails } = req.body;
    
    // Simulate payment processing
    // In real app, integrate with Stripe/Razorpay
    const paymentSuccess = Math.random() > 0.1; // 90% success rate

    if (paymentSuccess) {
      await Order.updatePaymentStatus(orderId, 'paid');
      res.json({
        success: true,
        message: 'Payment successful',
        transactionId: 'TXN_' + Date.now()
      });
    } else {
      await Order.updatePaymentStatus(orderId, 'failed');
      res.status(400).json({
        success: false,
        message: 'Payment failed'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderDetails,
  getAllOrders,
  updateOrderStatus,
  simulatePayment
};