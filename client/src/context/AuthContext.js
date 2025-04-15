import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Set up axios defaults with the backend URL
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
  axios.defaults.baseURL = backendUrl;
  axios.defaults.withCredentials = true; // Important for handling cookies
  
  // Check if user is logged in on page load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const storedUser = sessionStorage.getItem('user');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          
          // Add the token to axios headers for all subsequent requests
          if (userData.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
          }
          
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Clear potentially corrupted data
        sessionStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      
      if (res.data && res.data.token) {
        const userData = {
          id: res.data.user,
          token: res.data.token
        };
        
        // Set the auth token for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        // Save user data
        setCurrentUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
        
        return userData;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      const res = await axios.post('/auth/signup', userData);
      
      if (res.data && res.data.token) {
        const authData = {
          id: res.data.user,
          token: res.data.token
        };
        
        // Set the auth token for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        // Save user data
        setCurrentUser(authData);
        sessionStorage.setItem('user', JSON.stringify(authData));
        
        return authData;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.get('/auth/signout');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state even if server logout fails
      setCurrentUser(null);
      sessionStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};