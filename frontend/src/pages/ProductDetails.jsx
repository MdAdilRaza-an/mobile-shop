import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, getWishlistId, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      navigate('/login');
      return;
    }
    await addToCart(product.id, quantity);
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to manage wishlist');
      navigate('/login');
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
  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition"
      >
        <FiArrowLeft />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-dark-800 rounded-xl p-8">
          <img
            src={product.image || 'https://via.placeholder.com/500'}
            alt={product.name}
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-400 mb-4">{product.brand}</p>
          
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-4xl font-bold text-blue-500">
              ₹{product.price.toLocaleString()}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              product.stock > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
            }`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-300 leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Category</h3>
            <p className="text-gray-300">{product.category_name}</p>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Quantity</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 bg-dark-700 rounded-lg hover:bg-dark-600 transition"
                disabled={quantity <= 1}
              >
                <FiMinus />
              </button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-2 bg-dark-700 rounded-lg hover:bg-dark-600 transition"
                disabled={quantity >= product.stock}
              >
                <FiPlus />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 btn-primary py-3 flex items-center justify-center space-x-2 ${
                product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FiShoppingCart />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`px-6 py-3 rounded-lg transition flex items-center justify-center space-x-2 ${
                isInWishlist(product.id)
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-dark-700 hover:bg-dark-600'
              }`}
            >
              <FiHeart />
              <span>{isInWishlist(product.id) ? 'Remove' : 'Wishlist'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;