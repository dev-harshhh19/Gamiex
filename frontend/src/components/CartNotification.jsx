import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const CartNotification = ({ isVisible, onClose, product, quantity = 1 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible || !product) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-charcoal-card border border-success-green/50 rounded-xl p-4 shadow-2xl backdrop-blur-sm max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-success-green/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-success-green font-semibold text-sm">Added to Cart!</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-text hover:text-white transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Product Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-charcoal-light rounded-lg overflow-hidden flex-shrink-0">
            {product.image || product.imageUrl ? (
              <img 
                src={product.image || product.imageUrl} 
                alt={product.title || product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-charcoal-base flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium text-sm truncate">
              {product.title || product.name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-gray-text text-xs">Qty: {quantity}</span>
              <span className="text-white font-semibold text-sm">
                ${(parseFloat(product.price?.value || product.price || 0) * quantity).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 bg-charcoal-light text-gray-text text-sm rounded-lg hover:bg-charcoal-base hover:text-white transition-all duration-300"
          >
            Continue Shopping
          </button>
          <Link
            to="/cart"
            onClick={onClose}
            className="flex-1 px-3 py-2 bg-success-green text-charcoal-base text-sm rounded-lg font-medium hover:bg-success-green/90 transition-all duration-300 flex items-center justify-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            Go to Cart
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-charcoal-light rounded-full h-1">
            <div 
              className="bg-success-green h-1 rounded-full transition-all duration-75 ease-linear"
              style={{ 
                animation: 'cartNotificationProgress 5s linear forwards'
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartNotification;
