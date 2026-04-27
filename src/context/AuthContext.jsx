import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("rentx_user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  function login(userData) {
    setUser(userData);
    localStorage.setItem("rentx_user", JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("rentx_user");
  }

  function updateUser(data) {
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem("rentx_user", JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
