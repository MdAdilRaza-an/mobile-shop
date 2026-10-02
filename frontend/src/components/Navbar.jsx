import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { FiShoppingCart, FiHeart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <nav className="bg-dark-900 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Baba Mobile Shop
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-400 transition">Home</Link>
            <Link to="/products" className="hover:text-blue-400 transition">Products</Link>
            
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="hover:text-blue-400 transition">Admin</Link>
                )}
              </>
            )}

            <Link to="/cart" className="relative hover:text-blue-400 transition">
              <FiShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/wishlist" className="relative hover:text-blue-400 transition">
              <FiHeart className="text-xl" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-gray-300">Hi, {user?.name}</span>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="flex items-center space-x-1 bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700 transition"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-700">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="hover:text-blue-400 transition" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/products" className="hover:text-blue-400 transition" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
              
              {isAuthenticated && (
                <>
                  <Link to="/dashboard" className="hover:text-blue-400 transition" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="hover:text-blue-400 transition" onClick={() => setIsMobileMenuOpen(false)}>Admin</Link>
                  )}
                </>
              )}

              <div className="flex space-x-4">
                <Link to="/cart" className="relative" onClick={() => setIsMobileMenuOpen(false)}>
                  <FiShoppingCart className="text-xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/wishlist" className="relative" onClick={() => setIsMobileMenuOpen(false)}>
                  <FiHeart className="text-xl" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </div>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 bg-red-600 px-4 py-2 rounded-lg"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              ) : (
                <Link to="/login" className="bg-blue-600 px-4 py-2 rounded-lg text-center" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;