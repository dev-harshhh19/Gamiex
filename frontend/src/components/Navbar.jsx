import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getCartItemCount } from '../utils/cartUtils.jsx';

const Navbar = ({ onOpenSearch, onGoHome, hasActiveSearch, searchTerm }) => {
  const { user } = useAuth();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateCartCount = () => setCartItemCount(getCartItemCount());
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('header')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <header className="bg-charcoal-card/95 backdrop-blur-md sticky top-0 z-50 border-b border-subtle shadow-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3 group"
              onClick={onGoHome}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-charcoal-light rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success-green rounded-full animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold text-white">
                Gamiex
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Cart Icon */}
            <Link to="/cart" className="relative p-2 text-gray-text hover:text-white transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-neon-blue text-charcoal-base text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Search Button */}
            <button
              onClick={onOpenSearch}
              className="relative p-2 text-gray-text hover:text-white transition-colors"
              aria-label="Search"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {hasActiveSearch && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success-green rounded-full animate-pulse">
                  <div className="absolute inset-0 bg-success-green rounded-full animate-ping"></div>
                </div>
              )}
            </button>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-text hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          <nav className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className="text-gray-text hover:text-white font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-charcoal-light/50"
              onClick={onGoHome}
            >
              Home
            </Link>
            {/* Search Button with Status */}
            <div className="relative">
              <button
                onClick={onOpenSearch}
                className="flex items-center space-x-2 text-gray-text hover:text-white font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-charcoal-light/50 focus:outline-none"
                aria-label="Search"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search</span>
              </button>

              {/* Active Search Indicator */}
              {hasActiveSearch && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success-green rounded-full animate-pulse">
                  <div className="absolute inset-0 bg-success-green rounded-full animate-ping"></div>
                </div>
              )}
            </div>

            {/* Search Status Display */}
            {hasActiveSearch && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-charcoal-light rounded-lg">
                <svg className="w-4 h-4 text-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-white text-sm font-medium">
                  "{searchTerm.length > 15 ? searchTerm.substring(0, 15) + '...' : searchTerm}"
                </span>
                <button
                  onClick={onGoHome}
                  className="text-gray-text hover:text-white transition-colors ml-1"
                  title="Clear search (Alt + H)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <Link to="/cart" className="relative flex items-center space-x-2 text-gray-text hover:text-white font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-charcoal-light/50">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-neon-blue text-charcoal-base text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {user ? (
              <Link to="/profile" className="flex items-center space-x-2 text-gray-text hover:text-white font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-charcoal-light/50">
                <div className="w-8 h-8 bg-charcoal-light rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="hidden lg:block">Profile</span>
              </Link>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login" className="text-gray-text hover:text-white font-medium transition-all duration-300 px-4 py-2 rounded-lg hover:bg-charcoal-light/50">
                  Login
                </Link>
                <Link to="/register" className="neon-button primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-charcoal-card/95 backdrop-blur-md border-t border-subtle mobile-menu-enter">
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-3">
              {/* Home Link */}
              <Link
                to="/"
                className="block text-gray-text hover:text-white font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-charcoal-light/50"
                onClick={() => {
                  onGoHome();
                  setIsMobileMenuOpen(false);
                }}
              >
                Home
              </Link>

              {/* Search Status Display for Mobile */}
              {hasActiveSearch && (
                <div className="flex items-center gap-2 px-3 py-2 bg-charcoal-light rounded-lg">
                  <svg className="w-4 h-4 text-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-white text-sm font-medium">
                    Searching: "{searchTerm.length > 20 ? searchTerm.substring(0, 20) + '...' : searchTerm}"
                  </span>
                  <button
                    onClick={() => {
                      onGoHome();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-gray-text hover:text-white transition-colors ml-auto"
                    title="Clear search"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* User Authentication Links */}
              {user ? (
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-text hover:text-white font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-charcoal-light/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="w-6 h-6 bg-charcoal-light rounded-full flex items-center justify-center">
                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span>Profile</span>
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block text-gray-text hover:text-white font-medium transition-all duration-300 px-3 py-2 rounded-lg hover:bg-charcoal-light/50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block neon-button primary text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;