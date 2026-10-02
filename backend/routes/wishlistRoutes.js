const express = require('express');
const router = express.Router();
const { addToWishlist, getWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);
router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:wishlistId', removeFromWishlist);

module.exports = router;