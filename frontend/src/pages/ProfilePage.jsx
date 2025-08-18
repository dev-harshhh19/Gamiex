import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchUserProfile, updateUserProfile, fetchOrderHistory, fetchCurrentOrders, cancelOrder } from '../services/userService.jsx';
import { addMultipleItemsToCart, clearCart } from '../utils/cartUtils.jsx';
import ProfileForm from '../components/profile/ProfileForm.jsx';
import OrderHistory from '../components/profile/OrderHistory.jsx';
import CurrentOrders from '../components/profile/CurrentOrders.jsx';
import { UserIcon, ShoppingBagIcon, ClockIcon, TrashIcon } from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { user, updateAuthUser, logout } = useAuth();
  const [profileData, setProfileData] = useState({});
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const loadProfileData = useCallback(async () => {
    try {
      const [profile, history, current] = await Promise.all([
        fetchUserProfile(user.token),
        fetchOrderHistory(user.token),
        fetchCurrentOrders(user.token),
      ]);
      setProfileData(profile);
      setPurchaseHistory(history);
      setCurrentOrders(current);
    } catch (err) {
      setError('Failed to load profile data.');
      console.error('Error loading profile data:', err);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    if (user && user.token) {
      loadProfileData();
    }
  }, [user, loadProfileData]);

  const handleUpdateProfile = async (formData) => {
    setMessage('');
    setError('');

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const updatedUser = await updateUserProfile(user.token, formData);
      updateAuthUser(updatedUser);
      setMessage('Profile updated successfully!');
      setProfileData({ ...updatedUser, password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
      console.error('Error updating profile:', err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(user.token, orderId);
      await loadProfileData(); // Refresh the data
      setMessage('Order cancelled successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel order.');
      console.error('Error cancelling order:', err);
    }
  };

  const handleReorder = (order) => {
    addMultipleItemsToCart(order.items);
    setMessage('Items from your previous order have been added to your cart.');
  };

  const handleClearCart = () => {
    clearCart();
    setMessage('Your cart has been cleared.');
  };

  const renderTabContent = () => {
    if (loading) {
      return <div className="text-center py-16">Loading...</div>;
    }

    switch (activeTab) {
      case 'profile':
        return <ProfileForm initialData={profileData} onSubmit={handleUpdateProfile} message={message} error={error} />;
      case 'currentOrders':
        return (
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Current Orders</h2>
            <CurrentOrders orders={currentOrders} onCancelOrder={handleCancelOrder} />
          </div>
        );
      case 'orderHistory':
        return (
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Purchase History</h2>
            <OrderHistory orders={purchaseHistory} onReorder={handleReorder} />
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return <div className="text-center py-16 text-destructive">Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">User Profile</h1>
        <div>
          <button
            onClick={handleClearCart}
            className="bg-muted text-muted-foreground px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors mr-4"
          >
            <TrashIcon className="h-5 w-5 mr-2" />
            Clear Cart
          </button>
          <button
            onClick={logout}
            className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex border-b border-border mb-6">
        <button
          className={`flex items-center px-4 py-2 -mb-px border-b-2 ${activeTab === 'profile' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
          onClick={() => setActiveTab('profile')}
        >
          <UserIcon className="h-5 w-5 mr-2" />
          Profile
        </button>
        <button
          className={`flex items-center px-4 py-2 -mb-px border-b-2 ${activeTab === 'currentOrders' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
          onClick={() => setActiveTab('currentOrders')}
        >
          <ShoppingBagIcon className="h-5 w-5 mr-2" />
          Current Orders
        </button>
        <button
          className={`flex items-center px-4 py-2 -mb-px border-b-2 ${activeTab === 'orderHistory' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
          onClick={() => setActiveTab('orderHistory')}
        >
          <ClockIcon className="h-5 w-5 mr-2" />
          Order History
        </button>
      </div>

      {renderTabContent()}
    </div>
  );
};

export default ProfilePage;