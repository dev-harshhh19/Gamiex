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
      <div className="container mx-auto px-4 py-8 text-center animate-fade-in">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-4xl font-bold text-foreground mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          {cart.items.map(item => (
            <div key={item.productId} className="flex items-center space-x-4 py-4 border-b border-border last:border-b-0">
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                <p className="text-muted-foreground">${item.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => handleQuantityChange(item.productId, item.quantity - 1)} className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-opacity-90">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.productId, item.quantity + 1)} className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center hover:bg-opacity-90">+</button>
              </div>
              <p className="text-lg font-semibold text-foreground w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => handleRemoveItem(item.productId)} className="text-destructive hover:text-opacity-90 p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1 bg-card border border-border rounded-lg p-6 h-fit">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${cart.totalAmount.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-green-500">Free</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax (8%)</span><span>${(cart.totalAmount * 0.08).toFixed(2)}</span></div>
          </div>
          <div className="border-t border-border pt-4 mb-6">
            <div className="flex justify-between text-xl font-bold text-foreground">
              <span>Total</span>
              <span>${(cart.totalAmount * 1.08).toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout" className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors text-center block">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Cart;
