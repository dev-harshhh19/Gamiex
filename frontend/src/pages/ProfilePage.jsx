import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { clearCart } from '../utils/cartUtils.jsx';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [message, setMessage] = useState('');
  const [error] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleClearCart = () => {
    clearCart();
    setMessage('Cart cleared successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-text">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">User Profile</h1>
          <div className="flex gap-4">
            <button
              onClick={handleClearCart}
              className="px-4 py-2 bg-charcoal-light text-white rounded-lg hover:bg-charcoal-card transition-colors duration-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Cart
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-error-red text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 p-4 bg-success-green/20 border border-success-green/30 rounded-lg text-success-green">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-error-red/20 border border-error-red/30 rounded-lg text-error-red">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-white/20 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-medium transition-colors duration-300 border-b-2 ${
              activeTab === 'profile'
                ? 'border-charcoal-light text-white bg-charcoal-light/20'
                : 'border-transparent text-gray-text hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </div>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-medium transition-colors duration-300 border-b-2 ${
              activeTab === 'orders'
                ? 'border-charcoal-light text-white bg-charcoal-light/20'
                : 'border-transparent text-gray-text hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Orders
            </div>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="product-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-text mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-charcoal-light border border-white/20 rounded-lg text-white placeholder-gray-text focus:border-white/40 focus:outline-none transition-colors duration-300"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-text mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-charcoal-light border border-white/20 rounded-lg text-white placeholder-gray-text focus:border-white/40 focus:outline-none transition-colors duration-300"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-text mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-charcoal-light border border-white/20 rounded-lg text-white placeholder-gray-text focus:border-white/40 focus:outline-none transition-colors duration-300"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-text mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-charcoal-light border border-white/20 rounded-lg text-white placeholder-gray-text focus:border-white/40 focus:outline-none transition-colors duration-300"
                    placeholder="Enter your address"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-charcoal-card text-white font-medium rounded-lg hover:bg-charcoal-purple transition-colors duration-300"
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  onClick={() => setProfileData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    address: user.address || ''
                  })}
                  className="px-6 py-3 bg-charcoal-light text-white font-medium rounded-lg hover:bg-charcoal-card transition-colors duration-300"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="product-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Order History</h2>
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-text mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-text text-lg">No orders found</p>
              <p className="text-gray-text/70 mt-2">Start shopping to see your order history here!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;