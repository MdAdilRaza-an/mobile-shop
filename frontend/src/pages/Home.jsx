import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, getWishlistId, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      const allProducts = response.data.products;
      setFeaturedProducts(allProducts.filter(p => p.is_featured).slice(0, 6));
      setLatestProducts(allProducts.slice(0, 8));
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
    <div>
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-blue-900 to-purple-900 h-[500px] flex items-center">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
              Welcome to Baba Mobile Shop
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover the latest smartphones at unbeatable prices
            </p>
            <Link to="/products" className="btn-primary text-lg px-8 py-3">
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
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
                  <h3 className="font-semibold text-lg mb-2 hover:text-blue-400 transition">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-400 text-sm mb-2">{product.brand}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-500">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(product.id)}
                      className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
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
      </section>

      {/* Latest Mobiles Section */}
      <section className="py-16 bg-dark-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Latest Mobiles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <div key={product.id} className="card group">
                <Link to={`/product/${product.id}`}>
                  <img 
                    src={product.image || 'https://via.placeholder.com/300'} 
                    alt={product.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-semibold text-md mb-1 hover:text-blue-400 transition line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <span className="text-xl font-bold text-blue-500">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="mt-2 w-full btn-primary py-1 text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;