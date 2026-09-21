import { createContext, useState, useEffect } from "react";
import { authApi } from "../api/authApi";
import toast from "react-hot-toast";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("punyakoti_token") || null,
  );

  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("punyakoti_user");
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  });

  const [role, setRole] = useState(
    () => localStorage.getItem("punyakoti_role") || null,
  );
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("punyakoti_token");
    const storedUser = localStorage.getItem("punyakoti_user");
    const expiresAt = localStorage.getItem("punyakoti_expiresAt");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
      setRole(localStorage.getItem("punyakoti_role") || "CUSTOMER");
    }
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem("punyakoti_token");
    localStorage.removeItem("punyakoti_user");
    localStorage.removeItem("punyakoti_role");
    localStorage.removeItem("punyakoti_expiresAt");
    setUser(null);
    setToken(null);
    setRole(null);
  };

  const handleAuthResponse = (authResult) => {
    const { token: resToken, user: resUser, role: resRole, expiresAt } = authResult;
    const validExpiry = expiresAt || Date.now() + 24 * 60 * 60 * 1000;

    localStorage.setItem("punyakoti_token", resToken);
    localStorage.setItem("punyakoti_user", JSON.stringify(resUser));
    localStorage.setItem("punyakoti_role", resRole || "CUSTOMER");
    localStorage.setItem("punyakoti_expiresAt", validExpiry.toString());

    setToken(resToken);
    setUser(resUser);
    setRole(resRole || "CUSTOMER");
    return { success: true, user: resUser, role: resRole };
  };

  const login = async (email, password) => {
    try {
      const authResult = await authApi.login(email, password);
      return handleAuthResponse(authResult);
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password, mobileNumber) => {
    try {
      await authApi.register(name, email, password, mobileNumber);
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const googleLogin = async (googleToken) => {
    try {
      const authResult = await authApi.googleLogin(googleToken);
      return handleAuthResponse(authResult);
    } catch (error) {
      throw error;
    }
  };

  const verifyEmail = async (tokenStr) => {
    try {
      await authApi.verifyEmail(tokenStr);
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error("Logout API failed", e);
    }
    clearAuthData();
  };

  const updateUserProfile = (updatedDetails) => {
    if (user) {
      const newUserData = { ...user, ...updatedDetails };
      localStorage.setItem("punyakoti_user", JSON.stringify(newUserData));
      setUser(newUserData);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        user,
        token,
        role,
        loading,
        login,
        register,
        googleLogin,
        verifyEmail,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
