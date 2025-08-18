// Cart utility functions for localStorage management

export const getCartFromStorage = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : { items: [], totalAmount: 0 };
};

export const saveCartToStorage = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
  // Trigger custom event for cart updates
  window.dispatchEvent(new Event('cartUpdated'));
};

export const addToCart = (product, quantity = 1) => {
  const cart = getCartFromStorage();
  const productId = product.id || product._id; // Support both Amazon and old format
  const existingItem = cart.items.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId: productId,
      name: product.title || product.name, // Amazon uses 'title'
      price: parseFloat(product.price?.value || product.price || 0), // Amazon has nested price
      quantity: quantity,
      imageUrl: product.image || product.imageUrl, // Amazon uses 'image'
      discount: product.discount || 0,
      originalPrice: product.originalPrice?.value ? parseFloat(product.originalPrice.value) : null
    });
  }

  cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  saveCartToStorage(cart);
  return cart;
};

export const addMultipleItemsToCart = (items) => {
  const cart = getCartFromStorage();
  items.forEach(item => {
    const existingItem = cart.items.find(cartItem => cartItem.productId === item.productId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.items.push(item);
    }
  });
  cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  saveCartToStorage(cart);
  return cart;
}

export const removeFromCart = (productId) => {
  const cart = getCartFromStorage();
  cart.items = cart.items.filter(item => item.productId !== productId);
  cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  saveCartToStorage(cart);
  return cart;
};

export const updateCartItemQuantity = (productId, quantity) => {
  const cart = getCartFromStorage();
  const item = cart.items.find(item => item.productId === productId);
  
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    item.quantity = quantity;
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    saveCartToStorage(cart);
  }
  
  return cart;
};

export const clearCart = () => {
  const emptyCart = { items: [], totalAmount: 0 };
  saveCartToStorage(emptyCart);
  return emptyCart;
};

export const getCartItemCount = () => {
  const cart = getCartFromStorage();
  return cart.items.reduce((total, item) => total + item.quantity, 0);
};