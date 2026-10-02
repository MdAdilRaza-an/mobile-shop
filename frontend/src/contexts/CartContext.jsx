import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('/api/cart');
      setCart(response.data.cart);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return false;
    }

    try {
      const response = await axios.post('/api/cart', { productId, quantity });
      setCart(response.data.cart);
      setTotal(response.data.total);
      toast.success('Added to cart!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      return false;
    }
  };

  const updateQuantity = async (cartId, quantity) => {
    try {
      const response = await axios.put(`/api/cart/${cartId}`, { quantity });
      setCart(response.data.cart);
      setTotal(response.data.total);
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const removeFromCart = async (cartId) => {
    try {
      const response = await axios.delete(`/api/cart/${cartId}`);
      setCart(response.data.cart);
      setTotal(response.data.total);
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove from cart');
    }
  };

  const clearCart = () => {
    setCart([]);
    setTotal(0);
  };

  const value = {
    cart,
    total,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};