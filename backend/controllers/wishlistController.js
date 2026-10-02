const Wishlist = require('../models/WishlistModel');
const Product = require('../models/ProductModel');

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const wishlistId = await Wishlist.addItem(userId, productId);
    
    if (!wishlistId) {
      return res.status(400).json({
        success: false,
        message: 'Item already in wishlist'
      });
    }

    const wishlist = await Wishlist.getWishlist(userId);

    res.json({
      success: true,
      message: 'Added to wishlist',
      wishlist
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.getWishlist(req.user.id);

    res.json({
      success: true,
      wishlist
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { wishlistId } = req.params;
    await Wishlist.removeItem(wishlistId, req.user.id);

    const wishlist = await Wishlist.getWishlist(req.user.id);

    res.json({
      success: true,
      message: 'Removed from wishlist',
      wishlist
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist };