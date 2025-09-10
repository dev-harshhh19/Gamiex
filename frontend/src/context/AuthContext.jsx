import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../config/api.js';
import { supabase } from '../config/supabase.js';

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
      // First check if the email is verified with Supabase
      const { data: { user: supabaseUser }, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) throw supabaseError;

      if (!supabaseUser.email_confirmed_at) {
        throw new Error('Please verify your email before logging in.');
      }

      // Then login with your backend
      const response = await api.post('/api/auth/login', {
        email,
        password,
        supabaseId: supabaseUser.id,
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

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            email_confirmed: false,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Also save user data to your existing backend
      await api.post('/api/auth/register', {
        name,
        email,
        password,
        supabaseId: data.user.id,
      });

      return { 
        success: true,
        message: 'Please check your email to confirm your account.'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed'
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