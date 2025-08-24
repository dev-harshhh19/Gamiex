import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addToCart } from '../utils/cartUtils.jsx';
import { useCart } from '../context/CartContext.jsx';

const ProductCard = ({ product }) => {
  const [addedToCart, setAddedToCart] = useState(false);
  const { showCartNotification } = useCart();

  if (!product) {
    return (
      <div className="bg-charcoal-card rounded-lg shadow-subtle p-4 animate-pulse border border-subtle">
        <div className="bg-charcoal-light h-48 rounded-lg mb-4"></div>
        <div className="bg-charcoal-light h-4 rounded mb-2"></div>
        <div className="bg-charcoal-light h-4 rounded w-2/3"></div>
      </div>
    );
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToCart(true);
    showCartNotification(product, 1);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="product-card group h-full flex flex-col">
      <Link to={`/product/${product._id}`} className="block flex-grow flex flex-col">
        <div className="relative h-48 bg-gradient-to-br from-charcoal-purple to-charcoal-light overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200/171027/00e0ff?text=Game+Image';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-70 group-hover:opacity-50 transition-opacity duration-300"></div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-charcoal-light/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium border border-subtle">
              {product.category || 'Game'}
            </span>
          </div>

          {/* Discount Badge */}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-3 right-3">
              <span className="bg-neon-blue text-charcoal-base text-xs px-2 py-1 rounded font-semibold">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-neon transition-colors duration-200">
            {product.name}
          </h3>

          <p className="text-gray-text text-sm mb-4 line-clamp-2 flex-grow">
            {product.description || 'An amazing gaming experience awaits you!'}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="product-price">
                ${product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Platform indicators */}
          {product.platforms && product.platforms.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {product.platforms.slice(0, 3).map((platform, index) => (
                <span key={index} className="text-xs bg-charcoal-purple/50 text-gray-text px-2 py-1 rounded border border-subtle">
                  {platform}
                </span>
              ))}
              {product.platforms.length > 3 && (
                <span className="text-xs bg-charcoal-purple text-neon px-2 py-1 rounded border border-neon-blue/30">
                  +{product.platforms.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Action Button - Always at bottom */}
          <div className="mt-auto">
            {addedToCart ? (
              <Link
                to="/cart"
                className="w-full bg-success-green text-charcoal-base text-sm px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-green-400 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span>Go to Cart</span>
              </Link>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full bg-charcoal-light text-white border border-subtle hover:border-white/40 hover:bg-charcoal-card text-sm px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
