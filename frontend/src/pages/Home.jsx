import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/api.js';
import ProductCard from '../components/ProductCard.jsx';
import { getPageUrl } from '../utils/urlUtils.js';

const Home = ({ searchTerm, lenisRef }) => {
  const { page } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [itemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  // Get current page from URL parameter, default to 1, ensure it's positive
  const currentPage = Math.max(1, parseInt(page) || 1);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let response;
      const skip = (currentPage - 1) * itemsPerPage;
      if (searchTerm) {
        response = await api.get(`/api/products?search=${searchTerm}&limit=${itemsPerPage}&skip=${skip}`);
      } else {
        response = await api.get(`/api/products?limit=${itemsPerPage}&skip=${skip}`);
      }
      setProducts(response.data.data);
      if (lenisRef && lenisRef.current) {
        lenisRef.current.resize();
      }
      setTotalPages(Math.max(0, Math.ceil((response.data.totalProducts || 0) / itemsPerPage)));
      setError('');
    } catch (err) {
      setError('Failed to load products.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, lenisRef]);

  // Navigate to page 1 when search term changes
  useEffect(() => {
    setProducts([]);
    setTotalPages(0);
    if (searchTerm && currentPage !== 1) {
      navigate(getPageUrl(1), { replace: true });
    }
  }, [searchTerm, navigate, currentPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Redirect to page 1 if current page is invalid (greater than total pages)
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      navigate(getPageUrl(1), { replace: true });
    }
  }, [totalPages, currentPage, navigate]);

  // Update page title to include current page number
  useEffect(() => {
    const baseTitle = 'Gaming Store - Premium Games Collection';
    if (searchTerm) {
      document.title = `Search: "${searchTerm}" - Page ${currentPage} | ${baseTitle}`;
    } else if (currentPage > 1) {
      document.title = `Page ${currentPage} | ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
  }, [currentPage, searchTerm]);

  // Navigation functions that update the URL
  const navigateToPage = (pageNumber) => {
    navigate(getPageUrl(pageNumber), { replace: false });
  };

  const handlePreviousPage = () => {
    const prevPage = Math.max(1, currentPage - 1);
    navigateToPage(prevPage);
  };

  const handleNextPage = () => {
    const nextPage = Math.min(totalPages, currentPage + 1);
    navigateToPage(nextPage);
  };

  const handlePageClick = (pageNumber) => {
    navigateToPage(pageNumber);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-neon-blue mx-auto smooth-pulse"></div>
          <p className="mt-4 text-white text-lg smooth-fade-in">Loading amazing games...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16">
          <div className="text-error-red text-6xl mb-4">⚠️</div>
          <p className="text-error-red text-xl mb-6">{error}</p>
          <button
            onClick={loadProducts}
            className="neon-button primary"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="text-neon text-6xl mb-4"></div>
          <p className="text-white text-xl mb-2">No games found.</p>
          {searchTerm && (
            <p className="text-gray-text mt-2">Try searching for something else!</p>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Enhanced Pagination with Page Numbers */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-12">
            {/* Previous Button */}
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="w-12 h-12 bg-charcoal-light border border-white/20 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-charcoal-card hover:border-white/40 transition-all duration-300 flex items-center justify-center group"
            >
              <svg className="w-5 h-5 text-white group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {(() => {
                const pages = [];
                const maxVisiblePages = 5;
                let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                // Adjust start page if we're near the end
                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }

                // First page + ellipsis if needed
                if (startPage > 1) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => handlePageClick(1)}
                      className="w-12 h-12 bg-charcoal-light border border-white/20 rounded-lg hover:bg-charcoal-card hover:border-white/40 transition-all duration-300 flex items-center justify-center text-white font-medium"
                    >
                      1
                    </button>
                  );
                  if (startPage > 2) {
                    pages.push(
                      <span key="ellipsis1" className="px-2 text-gray-text">...</span>
                    );
                  }
                }

                // Visible page numbers
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageClick(i)}
                      className={`w-12 h-12 border rounded-lg transition-all duration-300 flex items-center justify-center font-medium ${
                        i === currentPage
                          ? 'bg-neon-blue border-neon-blue text-charcoal-dark'
                          : 'bg-charcoal-light border-white/20 text-white hover:bg-charcoal-card hover:border-white/40'
                      }`}
                    >
                      {i}
                    </button>
                  );
                }

                // Last page + ellipsis if needed
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="ellipsis2" className="px-2 text-gray-text">...</span>
                    );
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => handlePageClick(totalPages)}
                      className="w-12 h-12 bg-charcoal-light border border-white/20 rounded-lg hover:bg-charcoal-card hover:border-white/40 transition-all duration-300 flex items-center justify-center text-white font-medium"
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="w-12 h-12 bg-charcoal-light border border-white/20 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-charcoal-card hover:border-white/40 transition-all duration-300 flex items-center justify-center group"
            >
              <svg className="w-5 h-5 text-white group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Your Next Gaming Obsession
          </h1>
          <p className="text-xl md:text-2xl text-gray-text max-w-3xl mx-auto mb-12">
            Discover titles that redefine immersion and challenge your skills in a universe of endless play.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            {searchTerm ? `Search Results for "${searchTerm}"` : 'Featured Games'}
          </h2>
          <p className="text-gray-text text-lg">
            {searchTerm
              ? `Found ${products.length} games${totalPages > 1 ? ` - Page ${currentPage} of ${totalPages}` : ''}`
              : `Handpicked titles just for you${totalPages > 1 ? ` - Page ${currentPage} of ${totalPages}` : ''}`
            }
          </p>
        </div>

        {renderContent()}
      </section>
    </div>
  );
};

export default Home;