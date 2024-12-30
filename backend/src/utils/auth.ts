// src/utils/auth.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

export const setAuthToken = (token: string): void => {
  if (token) {
    // Set token to localStorage and cookie
    localStorage.setItem('token', token);
    Cookies.set('token', token, { expires: 7 }); // Cookie expires in 7 days
    
    // Set token in axios headers for all future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Remove token
    localStorage.removeItem('token');
    Cookies.remove('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token') || Cookies.get('token') || null;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const logout = (message?: string): void => {
  // Clear auth token
  setAuthToken('');
  
  // Clear any other stored data
  localStorage.clear();
  Object.keys(Cookies.get()).forEach(cookieName => {
    Cookies.remove(cookieName);
  });

  // Show logout message if provided
  if (message) {
    toast.success(message);
  }

  // Redirect to signin page
  setTimeout(() => {
    window.location.href = '/auth/signin';
  }, 500);
};