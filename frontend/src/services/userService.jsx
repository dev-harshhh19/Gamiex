import axios from 'axios';

const API_URL = '/api/auth';

const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchUserProfile = async (token) => {
  const { data } = await axios.get(`${API_URL}/profile`, getAuthConfig(token));
  return data.data;
};

export const updateUserProfile = async (token, profileData) => {
  const { data } = await axios.put(`${API_URL}/profile`, profileData, getAuthConfig(token));
  return data.data;
};

export const fetchOrderHistory = async (token) => {
  const { data } = await axios.get('/api/orders/myorders', getAuthConfig(token));
  return data.data;
};

export const fetchCurrentOrders = async (token) => {
  const { data } = await axios.get('/api/orders/current', getAuthConfig(token));
  return data.data;
};

export const cancelOrder = async (token, orderId) => {
  const { data } = await axios.put(`/api/orders/${orderId}/cancel`, {}, getAuthConfig(token));
  return data.data;
};