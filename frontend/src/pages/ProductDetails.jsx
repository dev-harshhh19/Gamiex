import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { addToCart } from '../utils/cartUtils.jsx';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/products/${id}`);
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
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-destructive text-xl">⚠️ {error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground text-xl">Product not found.</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-card border border-border rounded-lg p-4">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary mb-4">${product.price}</p>
          <p className="text-muted-foreground mb-6">{product.description}</p>
          
          <div className="flex items-center space-x-4 mb-6">
            <label htmlFor="quantity" className="font-medium text-foreground">Quantity:</label>
            <input 
              type="number" 
              id="quantity" 
              value={quantity} 
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 px-3 py-2 bg-input border border-border rounded-md focus:ring-ring focus:border-ring"
            />
          </div>

          <button 
            onClick={handleAddToCart}
            className={`w-full py-3 rounded-md text-lg font-semibold transition-colors ${addedToCart ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground hover:bg-opacity-90'}`}
          >
            {addedToCart ? '✓ Added!' : 'Add to Cart'}
          </button>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">How to claim your game</h3>
            <ol className="list-decimal ml-6 space-y-2 text-muted-foreground">
              <li>Complete checkout with your preferred payment method.</li>
              <li>After payment, open your order details page.</li>
              <li>Copy the redeem code(s) shown for each purchased item.</li>
              <li>
                Redeem the code in your launcher or store:
                <ul className="list-disc ml-6 mt-1">
                  <li>Steam: Games → Activate a Product on Steam → Enter code</li>
                  <li>Epic Games: User icon → Redeem Code</li>
                  <li>Xbox / PlayStation / Nintendo: Store → Redeem Code</li>
                  <li>PC (other): Use the publisher's launcher or redemption portal</li>
                </ul>
              </li>
            </ol>
            <p className="text-xs text-muted-foreground mt-2">Codes are one-time use. Keep them safe and do not share publicly.</p>
          </div>

        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
