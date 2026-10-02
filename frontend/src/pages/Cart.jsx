import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Cart = () => {
  const { cart, total, loading, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FiShoppingBag className="text-6xl text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Looks like you haven't added any items yet</p>
        <Link to="/products" className="btn-primary inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-dark-800 rounded-xl overflow-hidden">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center p-4 border-b border-dark-700 last:border-0">
                <img
                  src={item.image || 'https://via.placeholder.com/80'}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-4"
                />
                <div className="flex-1">
                  <Link to={`/product/${item.product_id}`}>
                    <h3 className="font-semibold hover:text-blue-400 transition">{item.name}</h3>
                  </Link>
                  <p className="text-blue-500 font-bold">₹{item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="p-1 bg-dark-700 rounded hover:bg-dark-600 transition"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-10 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 bg-dark-700 rounded hover:bg-dark-600 transition"
                    disabled={item.quantity >= item.stock}
                  >
                    <FiPlus />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-500 hover:bg-red-900/20 rounded transition"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-dark-800 rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-500">Free</span>
              </div>
              <div className="border-t border-dark-700 pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-500">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full btn-primary py-3 text-lg"
            >
              Proceed to Checkout
            </button>
            <Link to="/products" className="block text-center text-gray-400 hover:text-white mt-4">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;