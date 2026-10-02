import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (loading) return <LoadingSpinner />;

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <FiHeart className="text-6xl text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
        <p className="text-gray-400 mb-6">Save your favorite items here</p>
        <Link to="/products" className="btn-primary inline-block">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div key={item.wishlist_id} className="card">
            <Link to={`/product/${item.product_id}`}>
              <img
                src={item.image || 'https://via.placeholder.com/300'}
                alt={item.name}
                className="w-full h-56 object-cover"
              />
            </Link>
            <div className="p-4">
              <Link to={`/product/${item.product_id}`}>
                <h3 className="font-semibold text-lg mb-1 hover:text-blue-400 transition">
                  {item.name}
                </h3>
              </Link>
              <p className="text-gray-400 text-sm mb-2">{item.brand}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-blue-500">
                  ₹{item.price.toLocaleString()}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => addToCart(item.product_id)}
                    className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                    title="Add to Cart"
                  >
                    <FiShoppingCart />
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.wishlist_id)}
                    className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                    title="Remove"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;