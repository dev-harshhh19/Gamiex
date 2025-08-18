import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getCartFromStorage, clearCart } from '../utils/cartUtils';
import paymentService, { PAYMENT_PROVIDERS } from '../services/paymentService';
import '../styles/shopvibe-theme.css';

const Checkout = () => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: PAYMENT_PROVIDERS.RAZORPAY
  });
  const [availableProviders, setAvailableProviders] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const cartData = getCartFromStorage();
    setCart(cartData);
    
    // Initialize payment providers
    paymentService.initializeProviders().then(providers => {
      setAvailableProviders(providers);
    });
    
    // Pre-fill user data if logged in
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const required = ['name', 'email', 'phone', 'address', 'city', 'pincode'];
    for (const field of required) {
      if (!formData[field]) {
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

  const handlePayment = async () => {
    if (!validateForm()) return;
    
    if (cart.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    try {
      setPaymentLoading(true);
      setError('');

      // Convert USD to INR (approximate rate for demo)
      const amountInINR = cart.totalAmount * 83; // 1 USD ≈ 83 INR
      const orderId = `ORDER_${Date.now()}`;

      // Determine currency and amount based on payment method
      let amount = cart.totalAmount;
      let currency = 'USD';
      
      // For INR-based providers like Razorpay, convert to INR
      if (formData.paymentMethod === PAYMENT_PROVIDERS.RAZORPAY) {
        amount = amountInINR;
        currency = 'INR';
      }
      
      // Process payment with selected provider
      const paymentResult = await paymentService.processPayment({
        amount: amount,
        currency: currency,
        orderId: orderId,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        cryptoCurrency: formData.paymentMethod === PAYMENT_PROVIDERS.BASEPAY ? 'USDC' : undefined
      }, formData.paymentMethod);

      setPaymentResult(paymentResult);

      if (paymentResult.success) {
        // Verify payment
        const verification = await paymentService.verifyPayment({
          paymentId: paymentResult.paymentId,
          orderId: paymentResult.orderId,
          signature: paymentResult.signature
        });

        if (verification.verified) {
          // Payment successful - clear cart and show success
          clearCart();
          setCart({ items: [], totalAmount: 0 });
          setOrderPlaced(true);
          
          // Save order details to localStorage for demo
          const orderData = {
            orderId: orderId,
            paymentId: paymentResult.paymentId,
            items: cart.items,
            totalAmount: cart.totalAmount,
            amountPaid: amountInINR,
            currency: 'INR',
            customerInfo: formData,
            timestamp: new Date().toISOString(),
            status: 'confirmed'
          };
          localStorage.setItem('lastOrder', JSON.stringify(orderData));
          
          // Redirect to success page after 3 seconds
          setTimeout(() => {
            navigate('/payment-success', { state: { orderData } });
          }, 3000);
        } else {
          setError('Payment verification failed. Please contact support.');
        }
      } else {
        if (paymentResult.status !== 'cancelled') {
          setError(paymentResult.error || 'Payment failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment processing failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePayment();
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card bg-base-100 shadow-xl max-w-md mx-auto"
        >
          <div className="card-body text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="card-title justify-center text-2xl mb-4 text-success">
              Payment Successful!
            </h2>
            <p className="mb-4">
              Thank you for your purchase! Your order has been confirmed and you will receive a confirmation email shortly.
            </p>
            <div className="stats stats-vertical lg:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Amount Paid</div>
                <div className="stat-value text-success">
                  ₹{paymentResult ? paymentService.fromRazorpayAmount(paymentResult.amount || 0).toFixed(2) : '0.00'}
                </div>
              </div>
            </div>
            <div className="card-actions justify-center mt-6">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-base-100 shadow-xl max-w-md mx-auto"
        >
          <div className="card-body text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="card-title justify-center text-2xl mb-4">
              Your Cart is Empty
            </h2>
            <p className="mb-6">
              Please add some products to your cart before proceeding to checkout.
            </p>
            <div className="card-actions justify-center">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-cyan-300/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        <div className="shopvibe-container py-12">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0L17 13" />
              </svg>
            </div>
            <h1 className="shopvibe-heading-1 text-white mb-4">Complete Your Order</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              You're just one step away from getting your amazing products delivered to your doorstep
            </p>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-2 text-white/80 text-sm">Cart Review</span>
              </div>
              <div className="w-8 h-0.5 bg-white/40"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white border-4 border-white/30 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">2</span>
                </div>
                <span className="ml-2 text-white font-semibold text-sm">Checkout</span>
              </div>
              <div className="w-8 h-0.5 bg-white/20"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white/60 font-bold text-sm">3</span>
                </div>
                <span className="ml-2 text-white/60 text-sm">Confirmation</span>
              </div>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            {/* Enhanced Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="xl:col-span-3"
            >
              <div className="shopvibe-card backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
                <div className="p-8">
                  {/* Step Indicator */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="shopvibe-heading-3 mb-0">Delivery Information</h2>
                      <p className="text-gray-600 text-sm">Please provide your contact and shipping details</p>
                    </div>
                  </div>
                
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                      >
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-red-800 text-sm">Please fix the following error:</p>
                          <p className="text-red-600 text-sm">{error}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Contact Information */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className="space-y-2"
                        >
                          <label className="block text-sm font-semibold text-gray-700">
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Full Name *
                            </span>
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                          />
                        </motion.div>
                        
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-2"
                        >
                          <label className="block text-sm font-semibold text-gray-700">
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              Email Address *
                            </span>
                          </label>
                          <input
                            type="email"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                          />
                        </motion.div>
                      </div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-semibold text-gray-700">
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Phone Number *
                          </span>
                        </label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="9876543210"
                          maxLength="10"
                          required
                        />
                      </motion.div>
                    </div>

                    {/* Shipping Address */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 pt-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
                          <p className="text-sm text-gray-600">Where should we deliver your order?</p>
                        </div>
                      </div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-semibold text-gray-700">Complete Address *</label>
                        <textarea
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white h-24 resize-none"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Street address, apartment, suite, etc."
                          required
                        ></textarea>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                          className="space-y-2"
                        >
                          <label className="block text-sm font-semibold text-gray-700">City *</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Mumbai"
                            required
                          />
                        </motion.div>
                        
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 }}
                          className="space-y-2"
                        >
                          <label className="block text-sm font-semibold text-gray-700">Pincode *</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            placeholder="400001"
                            maxLength="6"
                            required
                          />
                        </motion.div>
                      </div>
                    </div>

                    {/* Payment Methods Section */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 pt-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                          <p className="text-sm text-gray-600">Choose your preferred payment option</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {availableProviders.map((provider, index) => (
                          <motion.div
                            key={provider.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            whileHover={{ scale: 1.01, y: -2 }}
                            className={`group relative p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                              formData.paymentMethod === provider.id
                                ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg'
                                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: provider.id }))}
                          >
                            {formData.paymentMethod === provider.id && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-4">
                              <input
                                type="radio"
                                name="paymentMethod"
                                value={provider.id}
                                checked={formData.paymentMethod === provider.id}
                                onChange={handleChange}
                                className="w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2"
                              />
                              
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center p-2">
                                <img src={provider.icon} alt={provider.name} className="max-w-full max-h-full object-contain" />
                              </div>
                              
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-base">{provider.name}</h4>
                                <p className="text-sm text-gray-600">{provider.description}</p>
                              </div>
                              
                              <div className="text-right space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                    {provider.fees}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">{provider.processingTime}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Security Badge */}
                      <div className="flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-green-800">Secure Payment</p>
                            <p className="text-xs text-green-600">256-bit SSL encryption</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-blue-800">Money-back Guarantee</p>
                            <p className="text-xs text-blue-600">30-day return policy</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Enhanced Pay Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="relative w-full py-4 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                        disabled={paymentLoading}
                      >
                        {/* Button Background Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative flex items-center justify-center gap-3">
                          {paymentLoading ? (
                            <>
                              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-lg">Processing Payment...</span>
                            </>
                          ) : (
                            <>
                              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold">Pay ₹{(cart.totalAmount * 83).toFixed(2)} Securely</div>
                                <div className="text-sm text-white/80">Complete your order now</div>
                              </div>
                            </>
                          )}
                        </div>
                      </motion.button>
                      
                      {/* Security Footer */}
                      <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>SSL Secured</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span>256-bit Encryption</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span>Instant Processing</span>
                        </div>
                      </div>
                    </motion.div>
                  </form>
                </div>
              </div>
            </motion.div>
            
            {/* Enhanced Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="xl:col-span-2"
            >
              <div className="sticky top-4 space-y-6">
                {/* Order Summary Card */}
                <div className="shopvibe-card backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                        <p className="text-sm text-gray-600">{cart.items.reduce((sum, item) => sum + item.quantity, 0)} items in your cart</p>
                      </div>
                    </div>
                    
                    {/* Items List */}
                    <div className="space-y-4 mb-6">
                      {cart.items.map((item, index) => (
                        <motion.div 
                          key={item.productId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name}
                              className="w-14 h-14 object-cover rounded-lg"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">Qty:</span>
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-semibold flex items-center justify-center">
                                  {item.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                            {item.discount > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                                  {item.discount}% off
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Pricing Breakdown */}
                    <div className="space-y-3 py-4 border-t border-gray-200">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                        <span className="font-medium">${cart.totalAmount.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 font-semibold">FREE</span>
                          <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            🚚 Fast delivery
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-gray-600">
                        <span>Tax & Fees</span>
                        <span className="text-green-600 font-medium">Included</span>
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div className="py-4 border-t border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 -mx-6 px-6 rounded-xl">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-lg font-bold text-gray-900">Total Amount</span>
                          <p className="text-sm text-gray-600">Includes all taxes and fees</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-600">${cart.totalAmount.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">≈ ₹{(cart.totalAmount * 83).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Info Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="shopvibe-card backdrop-blur-sm bg-white/95 border-0 shadow-lg"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Delivery Information</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-green-800 text-sm">Free Standard Delivery</p>
                          <p className="text-green-600 text-xs">Delivered within 3-5 business days</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-blue-800 text-sm">30-Day Return Policy</p>
                          <p className="text-blue-600 text-xs">Easy returns and full refund</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-purple-800 text-sm">Secure Packaging</p>
                          <p className="text-purple-600 text-xs">Your items are protected during transit</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Demo Notice */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-amber-800 text-sm">Demo Mode</p>
                      <p className="text-amber-700 text-xs mt-1">This is a demonstration for internship showcase. No actual payment will be processed or charged to your account.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
