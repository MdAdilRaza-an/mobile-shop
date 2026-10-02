const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Cart.addItem(userId, productId, quantity);

    const cart = await Cart.getCart(userId);
    const total = await Cart.getCartTotal(userId);

    res.json({
      success: true,
      message: 'Added to cart',
      cart,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.getCart(req.user.id);
    const total = await Cart.getCartTotal(req.user.id);

    res.json({
      success: true,
      cart,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { cartId } = req.params;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    await Cart.updateQuantity(cartId, req.user.id, quantity);

    const cart = await Cart.getCart(req.user.id);
    const total = await Cart.getCartTotal(req.user.id);

    res.json({
      success: true,
      message: 'Cart updated',
      cart,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    await Cart.removeItem(cartId, req.user.id);

    const cart = await Cart.getCart(req.user.id);
    const total = await Cart.getCartTotal(req.user.id);

    res.json({
      success: true,
      message: 'Removed from cart',
      cart,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = { addToCart, getCart, updateCartItem, removeFromCart };