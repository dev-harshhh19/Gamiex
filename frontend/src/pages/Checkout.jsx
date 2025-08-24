import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLoading } from '../context/LoadingContext.jsx';
import { getCartFromStorage, clearCart } from '../utils/cartUtils.jsx';
import GamingLoader from '../components/GamingLoader.jsx';

const Checkout = () => {
  const [cart, setCart] = useState(() => getCartFromStorage());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'paypal'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  // PayPal SDK Client ID (Sandbox) - Using a demo client ID for testing
  const PAYPAL_CLIENT_ID = "AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R"; // Demo sandbox client ID

  // Load PayPal SDK with improved error handling
  const loadPayPalScript = useCallback(() => {
    // Check if PayPal is already loaded
    if (window.paypal) {
      setPaypalLoaded(true);
      return Promise.resolve();
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existingScript) {
      return new Promise((resolve, reject) => {
        existingScript.onload = () => {
          setPaypalLoaded(true);
          resolve();
        };
        existingScript.onerror = reject;
      });
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture&disable-funding=credit,card`;
      script.async = true;

      script.onload = () => {
        if (window.paypal) {
          setPaypalLoaded(true);
          setError(''); // Clear any previous errors
          resolve();
        } else {
          reject(new Error('PayPal SDK loaded but window.paypal is not available'));
        }
      };

      script.onerror = () => {
        reject(new Error('Failed to load PayPal SDK'));
      };

      // Add timeout for loading
      const timeout = setTimeout(() => {
        reject(new Error('PayPal SDK loading timeout'));
      }, 10000); // 10 second timeout

      script.onload = () => {
        clearTimeout(timeout);
        if (window.paypal) {
          setPaypalLoaded(true);
          setError('');
          resolve();
        } else {
          reject(new Error('PayPal SDK loaded but window.paypal is not available'));
        }
      };

      document.head.appendChild(script);
    }).catch((error) => {
      console.error('PayPal SDK loading error:', error);
      let errorMessage = 'Failed to load PayPal SDK. ';

      if (error.message.includes('timeout')) {
        errorMessage += 'Connection timeout. Please check your internet connection and try again.';
      } else if (error.message.includes('network')) {
        errorMessage += 'Network error. Please check your internet connection.';
      } else {
        errorMessage += 'Please refresh the page and try again.';
      }

      setError(errorMessage);
      setPaypalLoaded(false);
    });
  }, [PAYPAL_CLIENT_ID]);

  // Initialize PayPal buttons with error handling
  const initializePayPal = useCallback(() => {
    if (!window.paypal || !paypalLoaded) {
      console.log('PayPal not ready:', { paypal: !!window.paypal, paypalLoaded });
      return;
    }

    const paypalContainer = document.getElementById('paypal-button-container');
    if (!paypalContainer) {
      console.error('PayPal container not found');
      return;
    }

    // Clear existing buttons
    paypalContainer.innerHTML = '';

    try {
      window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'paypal',
        height: 50
      },
      createOrder: (_, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: cart.totalAmount.toFixed(2),
              currency_code: 'USD'
            },
            description: `Gaming Store Order - ${cart.items.length} items`
          }]
        });
      },
      onApprove: async (_, actions) => {
        try {
          showLoading('Processing Payment...');
          await actions.order.capture();

          // Simulate order processing
          await new Promise(resolve => setTimeout(resolve, 1500));

          // Clear cart and show success
          clearCart();
          setCart({ items: [], totalAmount: 0 });
          hideLoading();
          setOrderPlaced(true);

          // Redirect after 3 seconds
          setTimeout(() => navigate('/'), 3000);

        } catch (error) {
          hideLoading();
          setError('Payment processing failed. Please try again.');
          setLoading(false);
        }
      },
      onError: (err) => {
        console.error('PayPal Error:', err);
        hideLoading();
        setError('Payment failed. Please try again.');
        setLoading(false);
      },
      onCancel: () => {
        hideLoading();
        setError('Payment was cancelled. You can try again when ready.');
        setLoading(false);
      }
    }).render('#paypal-button-container');
    } catch (error) {
      console.error('PayPal button initialization error:', error);
      setError('Failed to initialize PayPal. Please refresh and try again.');
    }
  }, [cart, navigate, paypalLoaded, showLoading, hideLoading, setCart, setOrderPlaced, setError, setLoading]);

  // Initialize form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Load PayPal when component mounts
  useEffect(() => {
    const initPayPal = async () => {
      try {
        await loadPayPalScript();
      } catch (error) {
        console.error('Failed to load PayPal:', error);
      }
    };

    initPayPal();
  }, [loadPayPalScript]);

  // Initialize PayPal buttons when SDK is loaded and payment method is PayPal
  useEffect(() => {
    if (paypalLoaded && formData.paymentMethod === 'paypal' && cart.totalAmount > 0) {
      // Small delay to ensure DOM is ready
      setTimeout(initializePayPal, 100);
    }
  }, [paypalLoaded, formData.paymentMethod, cart.totalAmount, initializePayPal]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  }, []);

  const validateForm = () => {
    const required = ['name', 'email', 'phone', 'address', 'city', 'pincode'];

    for (const field of required) {
      if (!formData[field]?.trim()) {
        setError(`Please fill in ${field}`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }

    // Pincode validation
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      setError('Please enter a valid 6-digit pincode');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (cart.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      setError('');
      showLoading('Processing Demo Payment...');

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear cart and show success
      clearCart();
      setCart({ items: [], totalAmount: 0 });
      hideLoading();
      setOrderPlaced(true);

      // Redirect after 3 seconds
      setTimeout(() => navigate('/'), 3000);

    } catch (error) {
      hideLoading();
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success page
  if (orderPlaced) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-md mx-auto">
          <div className="product-card text-center p-8 animate-fade-in">
            {/* Modern Success Console */}
            <div className="mb-6">
              <div className="w-32 h-20 mx-auto relative">
                {/* Success Border Animation */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 border-radius-2xl bg-gradient-to-r from-success-green via-success-green to-success-green opacity-80 animate-pulse" style={{
                    background: 'conic-gradient(from 0deg, rgba(34, 197, 94, 0.8) 0deg, rgba(34, 197, 94, 0.4) 180deg, rgba(34, 197, 94, 0.8) 360deg)',
                    animation: 'consoleBorderSpin 1.5s linear infinite'
                  }}></div>
                </div>

                {/* Console Body */}
                <div className="w-full h-full bg-charcoal-light rounded-2xl flex items-center justify-center relative border-2 border-success-green/30">
                  <div className="w-28 h-16 bg-charcoal-card rounded-xl relative">
                    {/* Success Screen */}
                    <div className="w-12 h-8 bg-charcoal-base rounded-lg absolute top-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-full h-full bg-gradient-to-br from-success-green/60 to-success-green/20 rounded-lg"></div>
                      {/* Success checkmark */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-4 h-4 text-success-green animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>

                    {/* Analog Sticks - Success State */}
                    <div className="absolute top-3 left-2">
                      <div className="w-3 h-3 bg-success-green/30 rounded-full border border-success-green/60">
                        <div className="w-2 h-2 bg-success-green/80 rounded-full absolute top-0.5 left-0.5 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="absolute top-3 right-2">
                      <div className="w-3 h-3 bg-success-green/30 rounded-full border border-success-green/60">
                        <div className="w-2 h-2 bg-success-green/80 rounded-full absolute top-0.5 left-0.5 animate-pulse"></div>
                      </div>
                    </div>

                    {/* D-Pad - Success */}
                    <div className="absolute bottom-2 left-3">
                      <div className="w-4 h-4 relative">
                        <div className="w-1 h-4 bg-success-green/70 absolute left-1.5 animate-pulse"></div>
                        <div className="w-4 h-1 bg-success-green/70 absolute top-1.5 animate-pulse"></div>
                      </div>
                    </div>

                    {/* Action Buttons - Success */}
                    <div className="absolute bottom-2 right-3">
                      <div className="w-4 h-4 relative">
                        <div className="w-1.5 h-1.5 bg-success-green/80 rounded-full absolute top-0 left-1.5 animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-success-green/80 rounded-full absolute bottom-0 left-1.5 animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-success-green/80 rounded-full absolute top-1.5 left-0 animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-success-green/80 rounded-full absolute top-1.5 right-0 animate-pulse"></div>
                      </div>
                    </div>

                    {/* Power LED - Success */}
                    <div className="absolute top-1 left-1 w-1 h-1 bg-success-green rounded-full animate-pulse" style={{
                      boxShadow: '0 0 6px rgba(34, 197, 94, 0.8)'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
              Payment Successful!
            </h2>
            <p className="text-gray-text mb-6">
              Thank you for your purchase! Your order has been confirmed and you will receive a confirmation email shortly.
            </p>
            <div className="bg-charcoal-light p-4 rounded-lg mb-6">
              <div className="text-center">
                <div className="text-sm text-gray-text">Amount Paid</div>
                <div className="text-2xl font-bold text-success-green">
                  ${cart.totalAmount ? cart.totalAmount.toFixed(2) : '0.00'}
                </div>
              </div>
            </div>
            <button
              className="neon-button primary w-full"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart page
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-md mx-auto">
          <div className="product-card text-center p-8 animate-fade-in">
            {/* Modern Empty Cart Console */}
            <div className="mb-6">
              <div className="w-32 h-20 mx-auto relative">
                {/* Empty State Border Animation */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 border-radius-2xl" style={{
                    background: 'conic-gradient(from 0deg, rgba(255, 159, 67, 0.6) 0deg, rgba(255, 159, 67, 0.2) 180deg, rgba(255, 159, 67, 0.6) 360deg)',
                    animation: 'consoleBorderSpin 3s linear infinite'
                  }}></div>
                </div>

                {/* Console Body */}
                <div className="w-full h-full bg-charcoal-light rounded-2xl flex items-center justify-center relative border-2 border-warning-orange/30">
                  <div className="w-28 h-16 bg-charcoal-card rounded-xl relative">
                    {/* Empty Cart Screen */}
                    <div className="w-12 h-8 bg-charcoal-base rounded-lg absolute top-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-full h-full bg-gradient-to-br from-gray-400/30 to-gray-400/10 rounded-lg"></div>
                      {/* Empty cart icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0L17 13" />
                        </svg>
                      </div>
                    </div>

                    {/* Analog Sticks - Inactive State */}
                    <div className="absolute top-3 left-2">
                      <div className="w-3 h-3 bg-gray-400/20 rounded-full border border-gray-400/40">
                        <div className="w-2 h-2 bg-gray-400/50 rounded-full absolute top-0.5 left-0.5"></div>
                      </div>
                    </div>
                    <div className="absolute top-3 right-2">
                      <div className="w-3 h-3 bg-gray-400/20 rounded-full border border-gray-400/40">
                        <div className="w-2 h-2 bg-gray-400/50 rounded-full absolute top-0.5 left-0.5"></div>
                      </div>
                    </div>

                    {/* D-Pad - Inactive */}
                    <div className="absolute bottom-2 left-3">
                      <div className="w-4 h-4 relative">
                        <div className="w-1 h-4 bg-white/30 absolute left-1.5"></div>
                        <div className="w-4 h-1 bg-white/30 absolute top-1.5"></div>
                      </div>
                    </div>

                    {/* Action Buttons - Inactive */}
                    <div className="absolute bottom-2 right-3">
                      <div className="w-4 h-4 relative">
                        <div className="w-1.5 h-1.5 bg-white/40 rounded-full absolute top-0 left-1.5"></div>
                        <div className="w-1.5 h-1.5 bg-white/40 rounded-full absolute bottom-0 left-1.5"></div>
                        <div className="w-1.5 h-1.5 bg-white/40 rounded-full absolute top-1.5 left-0"></div>
                        <div className="w-1.5 h-1.5 bg-white/40 rounded-full absolute top-1.5 right-0"></div>
                      </div>
                    </div>

                    {/* Power LED - Warning */}
                    <div className="absolute top-1 left-1 w-1 h-1 bg-warning-orange rounded-full animate-pulse" style={{
                      boxShadow: '0 0 6px rgba(255, 159, 67, 0.8)'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-text mb-6">
              Please add some products to your cart before proceeding to checkout.
            </p>
            <button
              className="neon-button primary w-full"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main checkout page
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Gaming Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-charcoal-light rounded-xl mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0L17 13" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Complete Your Order</h1>
          <div className="w-24 h-1 bg-charcoal-light mx-auto rounded-full mb-4"></div>
          <p className="text-gray-text text-lg max-w-2xl mx-auto">
            You're just one step away from getting your amazing gaming products delivered!
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Gaming Form Section */}
          <div className="xl:col-span-3 animate-slide-in-left">
            <div className="product-card p-8">
              {/* Gaming Step Indicator */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-charcoal-light rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-0">Contact Information</h2>
                  <p className="text-gray-text text-sm">Please provide your contact details</p>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-error-red/20 border border-error-red/30 rounded-xl flex items-center gap-3 animate-fade-in">
                  <div className="w-10 h-10 bg-error-red/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-error-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-error-red text-sm">Please fix the following error:</p>
                    <p className="text-error-red/80 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 animate-slide-in-left">
                      <label className="block text-sm font-semibold text-white">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Full Name *
                        </span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-charcoal-light border border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-white placeholder-gray-400"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="space-y-2 animate-slide-in-right">
                      <label className="block text-sm font-semibold text-white">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email Address *
                        </span>
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 bg-charcoal-light border border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-white placeholder-gray-400"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 animate-slide-up">
                    <label className="block text-sm font-semibold text-white">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Phone Number *
                      </span>
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-charcoal-light border border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-white placeholder-gray-400"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      maxLength="10"
                      required
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pt-4">
                    <div className="w-8 h-8 bg-charcoal-light rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Shipping Address</h3>
                      <p className="text-sm text-gray-text">Where should we deliver your order?</p>
                    </div>
                  </div>

                  <div className="space-y-2 animate-slide-up">
                    <label className="block text-sm font-semibold text-white">Address *</label>
                    <textarea
                      className="w-full px-4 py-3 bg-charcoal-light border border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-white placeholder-gray-400 resize-none"
                      name="address"
                      rows="3"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street address, apartment, suite, etc."
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 animate-slide-in-left">
                      <label className="block text-sm font-semibold text-white">City *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-charcoal-light border border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-white placeholder-gray-400"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Mumbai"
                        required
                      />
                    </div>

                    <div className="space-y-2 animate-slide-in-right">
                      <label className="block text-sm font-semibold text-white">Pincode *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-charcoal-light border border-white/20 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 text-white placeholder-gray-400"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="400001"
                        maxLength="6"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Methods Section */}
                <div className="space-y-6 animate-slide-up">
                  <div className="flex items-center gap-3 pt-4">
                    <div className="w-8 h-8 bg-charcoal-light rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Payment Method</h3>
                      <p className="text-sm text-gray-text">Choose your preferred payment option</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* PayPal Payment Option */}
                    <div className={`p-4 rounded-xl border transition-all duration-300 ${
                      formData.paymentMethod === 'paypal'
                        ? 'bg-blue-500/20 border-blue-500/50 ring-2 ring-blue-500/30'
                        : 'bg-charcoal-light/50 border-white/20 hover:border-white/30'
                    }`}>
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={formData.paymentMethod === 'paypal'}
                          onChange={handleChange}
                          className="w-5 h-5 text-blue-500 focus:ring-blue-500/50 focus:ring-2"
                        />

                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2">
                          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a.3.3 0 0 0-.32-.266c-.7-.05-1.453-.05-2.267.15-1.337.328-2.821 1.065-4.25 2.272l-.61 3.874h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.292-1.867-.002-3.137-1.012-4.287C22.566.543 20.558 0 17.988 0h-7.46c-.524 0-.972.382-1.054.901L6.367 21.337h4.606l1.12-7.106c.082-.518.526-.9 1.05-.9h2.19c4.298 0 7.664-1.747 8.647-6.797z" fill="#003087"/>
                            <path d="M6.367 21.337L9.474 0h8.514c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106H6.367z" fill="#0070ba"/>
                          </svg>
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-base">PayPal</h4>
                          <p className="text-sm text-gray-text">Pay securely with PayPal Sandbox</p>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full font-medium">
                              SECURE
                            </span>
                          </div>
                          <p className="text-xs text-gray-text">Instant Processing</p>
                        </div>
                      </div>
                    </div>

                    {/* Demo Payment Option */}
                    <div className={`p-4 rounded-xl border transition-all duration-300 ${
                      formData.paymentMethod === 'demo'
                        ? 'bg-success-green/20 border-success-green/50 ring-2 ring-success-green/30'
                        : 'bg-charcoal-light/50 border-white/20 hover:border-white/30'
                    }`}>
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="demo"
                          checked={formData.paymentMethod === 'demo'}
                          onChange={handleChange}
                          className="w-5 h-5 text-success-green focus:ring-success-green/50 focus:ring-2"
                        />

                        <div className="w-12 h-12 bg-charcoal-light rounded-lg flex items-center justify-center p-2">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>

                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-base">Demo Payment</h4>
                          <p className="text-sm text-gray-text">Quick demo payment for showcase</p>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-success-green/20 text-success-green rounded-full font-medium">
                              INSTANT
                            </span>
                          </div>
                          <p className="text-xs text-gray-text">No Setup Required</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PayPal Button Container */}
                  {formData.paymentMethod === 'paypal' && (
                    <div className="mt-6">
                      <div className="p-4 bg-charcoal-light/30 rounded-xl border border-white/10">
                        <div className="text-center mb-4">
                          <p className="text-sm text-gray-text">Click the PayPal button below to complete your payment</p>
                        </div>
                        <div id="paypal-button-container" className="min-h-[50px]">
                          {!paypalLoaded && !error && (
                            <div className="flex items-center justify-center py-8">
                              <GamingLoader size="medium" text="Loading PayPal..." />
                            </div>
                          )}
                          {error && error.includes('PayPal') && (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <div className="w-12 h-12 bg-warning-orange/20 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-warning-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                              </div>
                              <p className="text-warning-orange font-medium mb-2">PayPal Unavailable</p>
                              <p className="text-gray-text text-sm mb-4">PayPal is currently unavailable. Please use the demo payment option below.</p>
                              <div className="flex gap-3">
                                <button
                                  onClick={async () => {
                                    setError('');
                                    setPaypalLoaded(false);
                                    try {
                                      await loadPayPalScript();
                                    } catch (err) {
                                      console.error('Retry failed:', err);
                                    }
                                  }}
                                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                  Retry PayPal
                                </button>
                                <button
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, paymentMethod: 'demo' }));
                                    setError('');
                                  }}
                                  className="px-4 py-2 bg-charcoal-light text-white rounded-lg hover:bg-charcoal-card transition-colors"
                                >
                                  Use Demo Payment
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-4 p-4 bg-success-green/20 rounded-xl border border-success-green/30">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-success-green/30 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-success-green">Secure Payment</p>
                        <p className="text-xs text-success-green/80">256-bit SSL encryption</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Pay Button - Only show for demo payment */}
                {formData.paymentMethod === 'demo' && (
                  <div className="animate-slide-up">
                    <button
                      type="submit"
                      className="neon-button primary w-full py-4 px-8 text-white font-bold rounded-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
                      disabled={loading}
                    >
                      <div className="relative flex items-center justify-center gap-3">
                        {loading ? (
                          <>
                            {/* Custom Gaming Payment Loader */}
                            <div className="relative">
                              {/* Outer ring */}
                              <div className="w-8 h-8 border-2 border-white/30 rounded-full"></div>
                              {/* Spinning ring */}
                              <div className="absolute inset-0 w-8 h-8 border-2 border-transparent border-t-white border-r-white rounded-full animate-spin"></div>
                              {/* Inner pulsing core */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              </div>
                            </div>
                            <span className="text-lg animate-pulse">Processing Payment...</span>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold">Pay ${cart.totalAmount.toFixed(2)} Securely</div>
                              <div className="text-sm text-white/80">Complete your order now</div>
                            </div>
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                )}

                {/* PayPal Instructions */}
                {formData.paymentMethod === 'paypal' && (
                  <div className="animate-slide-up">
                    <div className="p-4 bg-blue-500/20 rounded-xl border border-blue-500/30 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-blue-400 font-semibold">PayPal Sandbox Mode</span>
                      </div>
                      <p className="text-blue-300 text-sm">
                        Use the PayPal button above to complete your payment. This is a sandbox environment for demonstration.
                      </p>
                    </div>
                  </div>
                )}

                {/* Security Footer */}
                <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-text">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>SSL Secured</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>256-bit Encryption</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Instant Processing</span>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Gaming Order Summary */}
          <div className="xl:col-span-2 animate-slide-in-right">
            <div className="sticky top-4 space-y-6">
              {/* Gaming Order Summary Card */}
              <div className="product-card">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-charcoal-light rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Order Summary</h2>
                      <p className="text-sm text-gray-text">{cart.items.reduce((sum, item) => sum + item.quantity, 0)} items in your cart</p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-4 mb-6">
                    {cart.items.map((item, index) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-4 p-4 bg-charcoal-light rounded-xl hover:bg-charcoal-purple transition-colors border border-white/10 animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="w-16 h-16 bg-charcoal-card rounded-lg flex items-center justify-center shadow-sm border border-white/10">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-lg"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm truncate">{item.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-text">Qty:</span>
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-white text-charcoal-base rounded-full text-xs font-semibold flex items-center justify-center">
                                {item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                          {item.discount > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs px-2 py-0.5 bg-success-green text-charcoal-base rounded-full font-medium">
                                {item.discount}% off
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gaming Pricing Breakdown */}
                  <div className="space-y-3 py-4 border-t border-white/20">
                    <div className="flex justify-between text-gray-text">
                      <span>Subtotal ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span className="font-medium text-white">${cart.totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-gray-text">
                      <span>Shipping</span>
                      <div className="flex items-center gap-2">
                        <span className="text-success-green font-semibold">FREE</span>
                        <div className="px-2 py-1 bg-success-green/20 text-success-green rounded-full text-xs font-medium">
                          Fast delivery
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between text-gray-text">
                      <span>Tax & Fees</span>
                      <span className="text-success-green font-medium">Included</span>
                    </div>
                  </div>

                  {/* Gaming Total */}
                  <div className="py-4 border-t border-white/20 bg-charcoal-light/50 -mx-6 px-6 rounded-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-lg font-bold text-white">Total Amount</span>
                        <p className="text-sm text-gray-text">Includes all taxes and fees</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">${cart.totalAmount.toFixed(2)}</div>
                        <div className="text-sm text-gray-text">≈ ₹{(cart.totalAmount * 83).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gaming Demo Notice */}
              <div className="p-4 bg-warning-orange/20 rounded-xl border border-warning-orange/30 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-warning-orange/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-warning-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-warning-orange text-sm">Demo Mode</p>
                    <p className="text-warning-orange/80 text-xs mt-1">This is a demonstration for internship showcase. No actual payment will be processed or charged to your account.</p>
                    {formData.paymentMethod === 'paypal' && (
                      <p className="text-warning-orange/80 text-xs mt-2">
                        <strong>PayPal Sandbox:</strong> Use test credentials or create a PayPal developer account for testing.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;