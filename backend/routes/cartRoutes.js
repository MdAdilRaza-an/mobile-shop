const express = require('express');
const router = express.Router();
const { addToCart, getCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:cartId', updateCartItem);
router.delete('/:cartId', removeFromCart);

module.exports = router;