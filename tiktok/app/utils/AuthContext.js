import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const userInfo = await AsyncStorage.getItem('userInfo');
        console.log('Token read from storage:', token);
        console.log('User info read from storage:', userInfo);
        if (token) {
          setIsAuthenticated(true);
          setUser(JSON.parse(userInfo));
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error reading token or user info from storage:', error);
        setLoading(false);
      }
    };

    loadAuthState();
  }, []);

  useEffect(() => {
    console.log('Authentication state changed:', isAuthenticated);
    console.log('User info changed:', user);
  }, [isAuthenticated, user]);

  const login = async (userInfo) => {
    try {
      await AsyncStorage.setItem('authToken', 'your-token');
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      setIsAuthenticated(true);
      setUser(userInfo);
      console.log('User logged in, token and user info stored.');
    } catch (error) {
      console.error('Error storing token or user info:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userInfo');
      setIsAuthenticated(false);
      setUser(null);
      console.log('User logged out, token and user info removed.');
    } catch (error) {
      console.error('Error removing token or user info:', error);
    }
  };

  const saveUserActivity = async (activity) => {
    try {
      const userActivity = await AsyncStorage.getItem('userActivity');
      const activityData = userActivity ? JSON.parse(userActivity) : [];
      activityData.push(activity);
      await AsyncStorage.setItem('userActivity', JSON.stringify(activityData));
      console.log('User activity saved:', activity);
    } catch (error) {
      console.error('Error saving user activity:', error);
    }
  };

  const getUserActivity = async () => {
    try {
      const userActivity = await AsyncStorage.getItem('userActivity');
      return userActivity ? JSON.parse(userActivity) : [];
    } catch (error) {
      console.error('Error retrieving user activity:', error);
      return [];
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, saveUserActivity, getUserActivity, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
