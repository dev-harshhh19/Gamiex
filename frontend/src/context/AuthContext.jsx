import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../config/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      // Authorization header is now handled by api interceptors
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      const { data } = response.data;
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data._id,
        name: data.name,
        email: data.email,
        address: data.address || '',
        phoneNumber: data.phoneNumber || '',
        secondaryEmail: data.secondaryEmail || '',
      }));

      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        address: data.address || '',
        phoneNumber: data.phoneNumber || '',
        secondaryEmail: data.secondaryEmail || '',
      });

      // Authorization header is now handled by api interceptors
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/api/auth/register', {
        name,
        email,
        password
      });

      const { data } = response.data;
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data._id,
        name: data.name,
        email: data.email,
        address: data.address || '',
        phoneNumber: data.phoneNumber || '',
        secondaryEmail: data.secondaryEmail || '',
      }));

      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
        address: data.address || '',
        phoneNumber: data.phoneNumber || '',
        secondaryEmail: data.secondaryEmail || '',
      });

      // Authorization header is now handled by api interceptors
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const updateAuthUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    // Authorization header cleanup is handled by api interceptors
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    updateAuthUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};