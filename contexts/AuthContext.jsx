import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const storedUser = await authService.getCurrentUser();
        setUser(storedUser);
      } catch (e) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username, email, password, confirmPassword) => {
    setIsLoading(true);
    try {
      const userData = await authService.register(username, email, password, confirmPassword);
      setUser(userData);
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
