import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../config/api.js';
import { addToCart } from '../utils/cartUtils.jsx';
import { useCart } from '../context/CartContext.jsx';

// Neon Tab Component
const NeonTab = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`neon-tab ${isActive ? 'active' : ''}`}
  >
    {label}
  </button>
);

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { showCartNotification } = useCart();
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/products/${id}`);
        setProduct(response.data.data);
        setError('');
      } catch (err) {
        setError('Failed to load product details.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      showCartNotification(product, quantity);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-neon-blue mx-auto smooth-pulse"></div>
          <p className="mt-4 text-white text-lg smooth-fade-in">Loading amazing game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-error-red text-xl">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="neon-button primary mt-4"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Product not found.</p>
          <button
            onClick={() => window.history.back()}
            className="neon-button primary mt-4"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${product.imageUrl})`,
          filter: 'blur(8px)',
          transform: 'scale(1.1)'
        }}
      />
      <div className="dynamic-bg-overlay" />

      {/* Content */}
      <div className="dynamic-bg-content relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Product Image Card */}
          <div className="modern-card-lg">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600x400/111111/00e0ff?text=Game+Image';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>

          {/* Product Info Card */}
          <div className="modern-card-lg">
            <h1 className="text-4xl font-bold text-white mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="product-price text-3xl">
                ${product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex flex-col">
                  <span className="text-lg text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                  <span className="product-discount text-sm">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Game Info */}
            <div className="space-y-4 mb-6">
              {/* Publisher & Developer */}
              {(product.publisher || product.developer) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.publisher && (
                    <div>
                      <span className="text-gray-400 text-sm">Publisher:</span>
                      <p className="text-white font-medium">{product.publisher}</p>
                    </div>
                  )}
                  {product.developer && (
                    <div>
                      <span className="text-gray-400 text-sm">Developer:</span>
                      <p className="text-white font-medium">{product.developer}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Release Date & Age Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.releaseDate && (
                  <div>
                    <span className="text-gray-400 text-sm">Release Date:</span>
                    <p className="text-white font-medium">
                      {new Date(product.releaseDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                {product.ageRating && (
                  <div>
                    <span className="text-gray-400 text-sm">Age Rating:</span>
                    <p className="text-white font-medium">{product.ageRating}</p>
                  </div>
                )}
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <span className="text-gray-400 text-sm block mb-2">Tags:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-charcoal-light text-neon-blue px-3 py-1 rounded-full text-sm border border-neon-blue/30 hover:border-neon-blue transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <label htmlFor="quantity" className="font-medium text-white">Quantity:</label>
              <div className="flex items-center bg-charcoal-light border border-gray-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-neon hover:bg-neon-blue hover:text-charcoal-bg transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 px-3 py-2 bg-transparent text-center text-white border-none focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-neon hover:bg-neon-blue hover:text-charcoal-bg transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            {addedToCart ? (
              <Link
                to="/cart"
                className="w-full py-4 text-lg font-semibold rounded-lg transition-all duration-300 bg-success-green text-charcoal-base border border-success-green flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                Go to Cart
              </Link>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full py-4 text-lg font-semibold rounded-lg transition-all duration-300 neon-button primary"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  Add to Cart
                </span>
              </button>
            )}

          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 max-w-7xl mx-auto">
          <div className="modern-card-lg">
            {/* Tab Navigation */}
            <div className="neon-tabs mb-8 mx-auto max-w-full">
              <NeonTab
                label="Description"
                isActive={activeTab === 'description'}
                onClick={() => setActiveTab('description')}
              />
              <NeonTab
                label="System Requirements"
                isActive={activeTab === 'requirements'}
                onClick={() => setActiveTab('requirements')}
              />
              <NeonTab
                label="Screenshots"
                isActive={activeTab === 'screenshots'}
                onClick={() => setActiveTab('screenshots')}
              />
              <NeonTab
                label="Trailer"
                isActive={activeTab === 'trailer'}
                onClick={() => setActiveTab('trailer')}
              />
              <NeonTab
                label="How to Claim"
                isActive={activeTab === 'claim'}
                onClick={() => setActiveTab('claim')}
              />
            </div>
          </div>

            {/* Tab Content */}
            <div className="relative overflow-hidden">
              <div className="transition-all duration-500 ease-in-out transform">
              {activeTab === 'description' && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-2xl font-bold text-white mb-4">About This Game</h3>
                  <p className="text-gray-text leading-relaxed text-lg">
                    {product.description || 'An amazing gaming experience awaits you! Dive into this incredible world and discover what makes this game special.'}
                  </p>
                  {product.platforms && product.platforms.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Available Platforms:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.platforms.map((platform, index) => (
                          <span key={index} className="bg-charcoal-light text-neon px-3 py-2 rounded-lg border border-neon-blue">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'requirements' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-2xl font-bold text-white mb-6">System Requirements</h3>
                  {product.requirements ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Minimum Requirements */}
                      {product.requirements.minimum && (
                        <div className="bg-charcoal-light border border-gray-600 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-neon-blue mb-4">Minimum Requirements</h4>
                          <div className="space-y-3">
                            {Object.entries(product.requirements.minimum).map(([key, value]) => (
                              value && (
                                <div key={key} className="flex justify-between">
                                  <span className="text-gray-400 capitalize">{key}:</span>
                                  <span className="text-white text-right flex-1 ml-4">{value}</span>
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommended Requirements */}
                      {product.requirements.recommended && (
                        <div className="bg-charcoal-light border border-neon-blue rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-neon-blue mb-4">Recommended Requirements</h4>
                          <div className="space-y-3">
                            {Object.entries(product.requirements.recommended).map(([key, value]) => (
                              value && (
                                <div key={key} className="flex justify-between">
                                  <span className="text-gray-400 capitalize">{key}:</span>
                                  <span className="text-white text-right flex-1 ml-4">{value}</span>
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">💻</div>
                      <p className="text-gray-text text-lg">System requirements not available</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'screenshots' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-2xl font-bold text-white mb-6">Screenshots</h3>
                  {product.screenshots && product.screenshots.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {product.screenshots.map((screenshot, index) => (
                        <div key={index} className="relative group overflow-hidden rounded-lg">
                          <img
                            src={screenshot}
                            alt={`${product.name} screenshot ${index + 1}`}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300/111111/00e0ff?text=Screenshot';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📸</div>
                      <p className="text-gray-text text-lg">No screenshots available</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'trailer' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-2xl font-bold text-white mb-6">Game Trailer</h3>
                  {product.trailerUrl ? (
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                      <iframe
                        src={product.trailerUrl.replace('watch?v=', 'embed/')}
                        title={`${product.name} Trailer`}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🎬</div>
                      <p className="text-gray-text text-lg">No trailer available</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'claim' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-2xl font-bold text-white mb-4">How to Claim Your Game</h3>
                  <ol className="list-decimal ml-6 space-y-4 text-gray-text text-lg">
                    <li>Complete checkout with your preferred payment method.</li>
                    <li>After payment, open your order details page.</li>
                    <li>Copy the redeem code(s) shown for each purchased item.</li>
                    <li>
                      Redeem the code in your launcher or store:
                      <ul className="list-disc ml-6 mt-2 space-y-1">
                        <li><span className="text-neon">Steam:</span> Games → Activate a Product on Steam → Enter code</li>
                        <li><span className="text-neon">Epic Games:</span> User icon → Redeem Code</li>
                        <li><span className="text-neon">Xbox / PlayStation / Nintendo:</span> Store → Redeem Code</li>
                        <li><span className="text-neon">PC (other):</span> Use the publisher's launcher or redemption portal</li>
                      </ul>
                    </li>
                  </ol>
                  <div className="bg-charcoal-light border border-neon-blue rounded-lg p-4 mt-6">
                    <p className="text-sm text-gray-text">
                      <span className="text-neon font-semibold">Important:</span> Codes are one-time use. Keep them safe and do not share publicly.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
