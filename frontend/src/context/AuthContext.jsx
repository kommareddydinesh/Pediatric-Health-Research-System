import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     // A proper app would fetch user info via a /me route with the token
     // Here we just check token existence for basic routing
     if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Normally fetch user info
        setUser({ role: 'Researcher' }); 
     } else {
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
     }
     setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      await axios.post('/auth/register', { name, email, password });
      // Do not log in automatically, require the user to log in manually via the login page
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, msg: err.response?.data?.msg || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
