"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Add this import
import Cookies from "js-cookie";
import useAuthStore from "@/store/authStore";

// Initialize context with default values
const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter(); // Add router here
  const { getUser, getToken, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const token = getToken();
    const userData = getUser();
    setIsLoggedIn(!!token && isAuthenticated);
    setUser(userData);
  }, [getToken, getUser, isAuthenticated]);

  const login = (token) => {
    localStorage.setItem("token", token, { expires: 7, secure: true });
    setIsLoggedIn(true);
    router.push("/"); // Move router.push inside login function
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/"); // Optionally add redirect on logout
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
