import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, getWishlistId, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await axios.get(`/api/products?${params.toString()}`);
      setProducts(response.data.products);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistToggle = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to manage wishlist');
      return;
    }

    if (isInWishlist(product.id)) {
      const wishlistId = getWishlistId(product.id);
      await removeFromWishlist(wishlistId);
    } else {
      await addToWishlist(product.id);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Products</h1>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input md:w-64"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="card group">
              <Link to={`/product/${product.id}`}>
                <img 
                  src={product.image || 'https://via.placeholder.com/300'} 
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-lg mb-1 hover:text-blue-400 transition">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-400 text-sm mb-2">{product.brand}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">{product.category_name}</span>
                  <span className={`text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-500">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(product.id)}
                      disabled={product.stock === 0}
                      className={`p-2 rounded-lg transition ${
                        product.stock > 0 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-gray-600 cursor-not-allowed'
                      }`}
                      title="Add to Cart"
                    >
                      <FiShoppingCart />
                    </button>
                    <button
                      onClick={() => handleWishlistToggle(product)}
                      className={`p-2 rounded-lg transition ${
                        isInWishlist(product.id) 
                          ? 'bg-red-600 text-white' 
                          : 'bg-dark-700 hover:bg-dark-600'
                      }`}
                      title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <FiHeart />
                    </button>
                    <Link
                      to={`/product/${product.id}`}
                      className="p-2 bg-dark-700 rounded-lg hover:bg-dark-600 transition"
                      title="View Details"
                    >
                      <FiEye />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;