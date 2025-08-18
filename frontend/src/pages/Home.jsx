import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard.jsx';
import Scene from '../components/Scene.jsx';

const Home = ({ searchTerm }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let response;
      const skip = (currentPage - 1) * itemsPerPage;
      if (searchTerm) {
        response = await axios.get(`/api/products?search=${searchTerm}&limit=${itemsPerPage}&skip=${skip}`);
      } else {
        response = await axios.get(`/api/products?limit=${itemsPerPage}&skip=${skip}`);
      }
      setProducts(response.data.data);
      setTotalProducts(response.data.totalProducts); // Assuming API returns totalProducts
      setTotalPages(Math.max(0, Math.ceil((response.data.totalProducts || 0) / itemsPerPage)));
      setError('');
    } catch (err) {
      setError('Failed to load products.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    setTotalProducts(0);
    setTotalPages(0);
  }, [searchTerm]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(1, prevPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(totalPages, prevPage + 1));
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center py-16">
          <p className="text-destructive text-xl mb-4">⚠️ {error}</p>
          <button onClick={() => { setProducts([]); setCurrentPage(1); setTotalProducts(0); setTotalPages(0); }} className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors">
            Try Again
          </button>
        </div>
      );
    }

    if (loading && products.length === 0) {
      return (
        <div className="col-span-full text-center py-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading products...</p>
        </div>
      );
    }

    if (products.length === 0 && !loading) {
      return (
        <div className="text-center py-16">
          <h3 className="text-2xl font-bold mb-2 text-foreground">No products found</h3>
          <p className="text-muted-foreground mb-6">Try a different search term.</p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-slide-up">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || loading}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              disabled={loading}
              className={`px-4 py-2 rounded-md transition-colors ${currentPage === index + 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-opacity-90'}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || loading}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </>
    );
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Scene />
      <section className="text-center py-12 animate-fade-in">
        <h1 className="text-5xl font-bold text-foreground mb-4">Find Your Next Favorite Thing</h1>
        <p className="text-xl text-muted-foreground">High-quality products, curated for you.</p>
      </section>

      <section className="py-8">
        {renderContent()}
      </section>
    </main>
  );
};

export default Home;