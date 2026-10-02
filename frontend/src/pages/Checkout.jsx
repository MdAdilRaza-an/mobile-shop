import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
      toast.error('Please fill shipping address');
      return;
    }

    setLoading(true);
    
    try {
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.zipCode}`;
      
      // Create order
      const orderResponse = await axios.post('/api/orders', {
        shippingAddress,
        paymentMethod: 'Credit Card'
      });

      // Simulate payment
      const paymentResponse = await axios.post('/api/orders/payment', {
        orderId: orderResponse.data.order.id,
        paymentDetails: {
          cardNumber: formData.cardNumber.slice(-4),
          cardName: formData.cardName
        }
      });

      if (paymentResponse.data.success) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/dashboard');
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Billing Form */}
        <div className="bg-dark-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>

            <h2 className="text-xl font-bold mt-6 mb-4">Payment Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Cardholder Name</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={formData.expiry}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-dark-800 rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dark-700 pt-3 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-500">Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total</span>
              <span className="text-blue-500">₹{total.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full btn-primary py-3 mt-6 text-lg disabled:opacity-50"
          >
            {loading ? <LoadingSpinner /> : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;