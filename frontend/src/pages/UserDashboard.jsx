import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiHeart, FiUser } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const UserDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-dark-800 rounded-xl p-4">
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <FiUser className="text-3xl" />
              </div>
              <h3 className="font-semibold">{user?.name}</h3>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  activeTab === 'orders' ? 'bg-blue-600' : 'hover:bg-dark-700'
                }`}
              >
                <FiPackage className="inline mr-2" /> My Orders
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  activeTab === 'profile' ? 'bg-blue-600' : 'hover:bg-dark-700'
                }`}
              >
                <FiUser className="inline mr-2" /> Profile
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {activeTab === 'orders' && (
            <div className="bg-dark-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">My Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <FiShoppingBag className="text-4xl text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">No orders yet</p>
                  <Link to="/products" className="btn-primary inline-block mt-4">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-dark-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm text-gray-400">Order #{order.id}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'delivered' ? 'bg-green-900 text-green-300' :
                            order.status === 'cancelled' ? 'bg-red-900 text-red-300' :
                            'bg-yellow-900 text-yellow-300'
                          }`}>
                            {order.status}
                          </span>
                          <p className="font-bold mt-1">₹{order.total_amount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>{order.item_count} items</span>
                        <span className={`${
                          order.payment_status === 'paid' ? 'text-green-500' : 'text-yellow-500'
                        }`}>
                          {order.payment_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-dark-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Profile Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400">Name</label>
                  <p className="text-lg">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <p className="text-lg">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Role</label>
                  <p className="text-lg capitalize">{user?.role}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Member Since</label>
                  <p className="text-lg">{new Date(user?.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;