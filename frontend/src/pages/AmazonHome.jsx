import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import amazonService from '../services/amazonService';

const AmazonHome = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [dealsProducts, setDealsProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get search parameters
      const search = searchParams.get('search') || '';
      const category = searchParams.get('category') || '';
      const deals = searchParams.get('deals') === 'true';
      
      setSearchQuery(search);
      setSelectedCategory(category);

      if (deals) {
        // Fetch deals
        const dealsResponse = await amazonService.getDeals(24);
        if (dealsResponse.success) {
          setProducts(dealsResponse.data);
        }
      } else {
        // Normal product search
        const response = await amazonService.searchProducts(search, {
          category: category,
          limit: 24
        });
        
        if (response.success) {
          setProducts(response.data);
          setError('');
        } else {
          setError(response.error || 'Failed to load products');
          setProducts([]);
        }
      }

      // Always fetch trending and deals for sidebar sections
      if (!deals) {
        const [trendingResponse, dealsResponse] = await Promise.all([
          amazonService.getTrendingProducts(6),
          amazonService.getDeals(6)
        ]);
        
        if (trendingResponse.success) {
          setTrendingProducts(trendingResponse.data);
        }
        
        if (dealsResponse.success) {
          setDealsProducts(dealsResponse.data);
        }
      }
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const categories = [
    { name: 'Electronics', icon: '📱', color: '#FF9900' },
    { name: 'Fashion', icon: '👕', color: '#FF4757' },
    { name: 'Home', icon: '🏠', color: '#2ED573' },
    { name: 'Books', icon: '📚', color: '#5352ED' },
    { name: 'Sports', icon: '⚽', color: '#FF6B35' },
    { name: 'Beauty', icon: '💄', color: '#FF3838' }
  ];

  if (loading) {
    return (
      <div className="amazon-container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <div className="amazon-spinner-lg"></div>
        <p style={{ marginTop: '16px', color: '#565959' }}>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="amazon-container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#D13212', marginBottom: '16px' }}>Something went wrong</h2>
          <p style={{ color: '#565959', marginBottom: '24px' }}>{error}</p>
          <button 
            className="amazon-btn amazon-btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderHeroBanner = () => (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '48px 0',
      marginBottom: '24px'
    }}>
      <div className="amazon-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
          <div style={{ flex: 1 }}>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ 
                fontSize: '48px', 
                fontWeight: '700', 
                marginBottom: '16px',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Welcome to Amazon
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ 
                fontSize: '20px', 
                marginBottom: '24px',
                opacity: 0.9
              }}
            >
              Discover millions of products with fast, free delivery
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button className="amazon-btn amazon-btn-primary amazon-btn-lg">
                Shop Now
              </button>
            </motion.div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              style={{ fontSize: '120px' }}
            >
              📦
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategoryGrid = () => (
    <div className="amazon-container" style={{ marginBottom: '32px' }}>
      <h2 className="amazon-heading-2" style={{ marginBottom: '20px' }}>Shop by Category</h2>
      <div className="amazon-grid amazon-grid-3" style={{ gap: '16px' }}>
        {categories.map((category, index) => (
          <motion.a
            key={category.name}
            href={`/?category=${category.name.toLowerCase()}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              display: 'block',
              padding: '24px',
              backgroundColor: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#0F1111',
              boxShadow: '0 2px 5px rgba(213,217,217,0.5)',
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
            whileHover={{ y: -2, boxShadow: '0 4px 8px rgba(213,217,217,0.5)' }}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{category.icon}</div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0' }}>{category.name}</h3>
          </motion.a>
        ))}
      </div>
    </div>
  );

  const renderProductSection = (title, products, showAll = true) => (
    <div className="amazon-container" style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 className="amazon-heading-2" style={{ margin: 0 }}>{title}</h2>
        {showAll && (
          <button className="amazon-text-link" onClick={() => window.location.reload()}>See all</button>
        )}
      </div>
      <div className="amazon-grid amazon-grid-4" style={{ gap: '16px' }}>
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );

  const renderSearchResults = () => {
    let title = 'All Products';
    if (searchQuery) {
      title = `Search results for "${searchQuery}"`;
    } else if (selectedCategory) {
      title = `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products`;
    } else if (searchParams.get('deals') === 'true') {
      title = "Today's Deals";
    }

    return (
      <div className="amazon-container">
        <div style={{ marginBottom: '20px' }}>
          <h1 className="amazon-heading-2">{title}</h1>
          <p style={{ color: '#565959', fontSize: '14px' }}>
            {products.length} result{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        {products.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px 24px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(213,217,217,0.5)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '24px', marginBottom: '8px', color: '#0F1111' }}>No results found</h3>
            <p style={{ color: '#565959', marginBottom: '24px' }}>
              Try different keywords or remove search filters
            </p>
            <button 
              className="amazon-btn amazon-btn-primary"
              onClick={() => window.location.href = '/'}
            >
              Browse all products
            </button>
          </div>
        ) : (
          <div className="amazon-grid amazon-grid-4" style={{ gap: '16px' }}>
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const hasSearchOrFilter = searchQuery || selectedCategory || searchParams.get('deals') === 'true';

  return (
    <div style={{ backgroundColor: '#EAEDED', minHeight: '100vh' }}>
      {!hasSearchOrFilter && renderHeroBanner()}
      {!hasSearchOrFilter && renderCategoryGrid()}
      
      {hasSearchOrFilter ? (
        renderSearchResults()
      ) : (
        <>
          {renderProductSection('Featured Products', products.slice(0, 8))}
          {trendingProducts.length > 0 && renderProductSection('Trending Now', trendingProducts, false)}
          {dealsProducts.length > 0 && renderProductSection("Today's Deals", dealsProducts)}
        </>
      )}

      {/* Footer Banner */}
      {!hasSearchOrFilter && (
        <div style={{
          background: 'linear-gradient(135deg, #232F3E 0%, #37475A 100%)',
          color: 'white',
          padding: '48px 0',
          marginTop: '48px',
          textAlign: 'center'
        }}>
          <div className="amazon-container">
            <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Get the Amazon App</h2>
            <p style={{ fontSize: '18px', marginBottom: '24px', opacity: 0.9 }}>
              Download the app for exclusive deals and faster checkout
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button className="amazon-btn amazon-btn-primary amazon-btn-lg">
                📱 Download for iOS
              </button>
              <button className="amazon-btn amazon-btn-secondary amazon-btn-lg">
                🤖 Download for Android
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmazonHome;
