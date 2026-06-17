import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth status on app start/refresh
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      
      // Fetch full user details after successful login
      const meResponse = await api.get("/auth/me");
      setUser(meResponse.data);
      return { success: true, user: meResponse.data };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please check credentials.";
      return { success: false, error: message };
    }
  };

  // Register handler
  const register = async (username, email, password) => {
    try {
      await api.post("/auth/register", { username, email, password });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed.";
      return { success: false, error: message };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error on backend:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
