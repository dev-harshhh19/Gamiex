import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-charcoal-card border-t border-subtle mt-auto p-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-charcoal-light rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Gamiex</span>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link to="/help" className="text-sm text-gray-text hover:text-white transition-colors duration-300">Help</Link>
            <Link to="/terms-of-service" className="text-sm text-gray-text hover:text-white transition-colors duration-300">Terms & Conditions</Link>
            <Link to="/privacy-policy" className="text-sm text-gray-text hover:text-white transition-colors duration-300">Privacy Policy</Link>
            <Link to="/contact-us" className="text-sm text-gray-text hover:text-white transition-colors duration-300">Contact Us</Link>
            <Link to="/about-us" className="text-sm text-gray-text hover:text-white transition-colors duration-300">About Us</Link>
          </div>
        </div>
        <div className="border-t border-subtle pt-6 text-center">
          <p className="text-sm text-gray-text">
            &copy; {new Date().getFullYear()} Gamiex. All rights reserved.
            <span className="text-neon ml-2">Game on! 🎮</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
