import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartNotification, setCartNotification] = useState({
    isVisible: false,
    product: null,
    quantity: 1
  });

  const showCartNotification = (product, quantity = 1) => {
    setCartNotification({
      isVisible: true,
      product,
      quantity
    });
  };

  const hideCartNotification = () => {
    setCartNotification({
      isVisible: false,
      product: null,
      quantity: 1
    });
  };

  const value = {
    cartNotification,
    showCartNotification,
    hideCartNotification
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
