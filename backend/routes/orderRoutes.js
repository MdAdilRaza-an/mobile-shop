const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getUserOrders, 
  getOrderDetails, 
  getAllOrders, 
  updateOrderStatus,
  simulatePayment
} = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.use(verifyToken);
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/all', isAdmin, getAllOrders);
router.get('/:id', getOrderDetails);
router.put('/:id/status', isAdmin, updateOrderStatus);
router.post('/payment', simulatePayment);

module.exports = router;