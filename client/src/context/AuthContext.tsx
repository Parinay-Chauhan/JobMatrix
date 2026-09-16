import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "../api/axios";
import { User, AuthContextType } from "../types/auth";

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check current session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get("/users/current-user");
        setUser(response.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);