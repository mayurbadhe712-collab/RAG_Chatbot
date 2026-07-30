import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    email: 'guest@pydoc.ai',
    full_name: 'Python Developer Guest',
    is_active: true
  });
  const [token, setToken] = useState(localStorage.getItem('token') || 'guest_token');
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    return { access_token: 'guest_token', user };
  };

  const register = async (email, password, fullName) => {
    return { id: 1, email, full_name: fullName };
  };

  const logout = () => {
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading: false, login, register, logout, isAuthenticated: true }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
