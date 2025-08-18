import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getCartItemCount } from '../utils/cartUtils.jsx';

const Navbar = ({ onOpenSearch }) => {
  const { user } = useAuth();
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => setCartItemCount(getCartItemCount());
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  return (
    <header className="bg-background shadow-sm sticky top-0 z-50 animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
              </svg>
              <span className="text-2xl font-bold text-foreground">Gamiex</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-muted-foreground hover:text-primary font-medium transition-colors duration-300">
              Home
            </Link>
            <button
              onClick={onOpenSearch}
              className="text-muted-foreground hover:text-primary font-medium transition-colors duration-300 focus:outline-none"
              aria-label="Search"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            <Link to="/cart" className="relative text-muted-foreground hover:text-primary font-medium transition-colors duration-300">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-gentle">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <Link to="/profile" className="text-muted-foreground hover:text-primary font-medium transition-colors duration-300 p-2 rounded-full bg-accent/20">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </Link>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login" className="text-muted-foreground hover:text-primary font-medium transition-colors duration-300">
                  Login
                </Link>
                <Link to="/register" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors duration-300">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;