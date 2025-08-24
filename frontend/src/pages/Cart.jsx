import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCartFromStorage, updateCartItemQuantity, removeFromCart } from '../utils/cartUtils.jsx';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });

  useEffect(() => {
    const updateCart = () => setCart(getCartFromStorage());
    updateCart();
    window.addEventListener('cartUpdated', updateCart);
    return () => window.removeEventListener('cartUpdated', updateCart);
  }, []);

  const handleQuantityChange = (productId, newQuantity) => {
    setCart(updateCartItemQuantity(productId, newQuantity));
  };

  const handleRemoveItem = (productId) => {
    setCart(removeFromCart(productId));
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="modern-card-lg">
              <div className="text-6xl mb-6 text-neon">🛒</div>
              <h1 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
              <p className="text-gray-text mb-8 text-lg">
                Looks like you haven't added any games to your cart yet.
                Discover amazing games and start building your collection!
              </p>
              <Link
                to="/"
                className="neon-button primary inline-flex items-center px-8 py-3 text-lg font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Your Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2 modern-card-lg">
            {cart.items.map(item => (
              <div key={item.productId} className="flex items-center space-x-4 py-6 border-b border-gray-600 last:border-b-0">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-lg border border-gray-600" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                  <p className="product-price text-lg">${item.price}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-charcoal-light border border-subtle text-white flex items-center justify-center hover:border-neon-blue hover:text-neon transition-all duration-300"
                  >
                    -
                  </button>
                  <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-charcoal-light border border-subtle text-white flex items-center justify-center hover:border-neon-blue hover:text-neon transition-all duration-300"
                  >
                    +
                  </button>
                </div>
                <p className="text-lg font-semibold text-neon w-24 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="text-error-red hover:text-red-400 p-2 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1 modern-card-lg h-fit">
            <h2 className="text-2xl font-semibold text-white mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-text">Subtotal</span>
                <span className="text-white">${cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-text">Shipping</span>
                <span className="text-success-green font-semibold">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-text">Tax (8%)</span>
                <span className="text-white">${(cart.totalAmount * 0.08).toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t border-gray-600 pt-6 mb-8">
              <div className="flex justify-between text-xl font-bold">
                <span className="text-white">Total</span>
                <span className="product-price text-2xl">${(cart.totalAmount * 1.08).toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" className="neon-button primary w-full py-4 text-lg font-semibold text-center block">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
