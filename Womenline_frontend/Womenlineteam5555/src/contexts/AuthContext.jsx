import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserCredits } from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUserCredits = useCallback(async () => {
    try {
      const response = await getUserCredits(token);
      if (response.success) {
        setCredits(response.data.greenCredits);
      }
    } catch (error) {
      console.error('Failed to fetch user credits:', error);
      // If token is invalid, clear it
      if (error.message.includes('401') || error.message.includes('403')) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUserCredits();
    } else {
      setLoading(false);
    }
  }, [token, fetchUserCredits]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCredits(0);
    localStorage.removeItem('token');
  };

  const updateCredits = (newCredits) => {
    setCredits(newCredits);
  };

  const value = {
    user,
    token,
    credits,
    loading,
    login,
    logout,
    updateCredits,
    fetchUserCredits
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 