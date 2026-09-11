import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  // User Preferences
  const [language, setLanguageState] = useState(() => localStorage.getItem('language') || 'en');
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : { orderUpdates: true, priceDrops: true, promos: true, security: true };
  });

  const { addToast } = useToast();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const setLanguage = (langCode) => {
    setLanguageState(langCode);
    localStorage.setItem('language', langCode);
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const updateUserProfile = (profileData) => {
    setUser((prev) => {
      const updated = { ...prev, ...profileData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      const data = await authApi.login(credentials);
      setToken(data.token);
      setUser(data.user);
      addToast(`Welcome back, ${data.user.name}!`, 'success');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to sign in';
      addToast(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (googleData = {}) => {
    setLoading(true);
    try {
      const data = await authApi.googleAuth(googleData);
      setToken(data.token);
      setUser(data.user);
      addToast(`Signed in with Google as ${data.user.name}!`, 'success');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to sign in with Google';
      addToast(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (userData) => {
    setLoading(true);
    try {
      const data = await authApi.signup(userData);
      setToken(data.token);
      setUser(data.user);
      addToast('Account created successfully!', 'success');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create account';
      addToast(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    addToast('Logged out successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        language,
        setLanguage,
        notifications,
        toggleNotification,
        updateUserProfile,
        login: handleLogin,
        googleLogin: handleGoogleLogin,
        signup: handleSignup,
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
