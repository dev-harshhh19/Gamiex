import api from '../config/api.js';

// Auth headers are now handled by api interceptors, no need for getAuthConfig

export const fetchUserProfile = async () => {
  const { data } = await api.get('/api/auth/profile');
  return data.data;
};

export const updateUserProfile = async (profileData) => {
  const { data } = await api.put('/api/auth/profile', profileData);
  return data.data;
};

export const fetchOrderHistory = async () => {
  const { data } = await api.get('/api/orders/myorders');
  return data.data;
};

export const fetchCurrentOrders = async () => {
  const { data } = await api.get('/api/orders/current');
  return data.data;
};

export const cancelOrder = async (orderId) => {
  const { data } = await api.put(`/api/orders/${orderId}/cancel`, {});
  return data.data;
};