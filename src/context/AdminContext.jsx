import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { loginAdmin } from '../services/api';

const AdminContext = createContext(undefined);

const ADMIN_STORAGE_KEY = 'twins_elegance_admin_auth';
const ADMIN_TOKEN_KEY = 'twins_elegance_admin_token';

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
    return stored === 'true';
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || null;
  });

  useEffect(() => {
    localStorage.setItem(ADMIN_STORAGE_KEY, String(isAuthenticated));
    if (token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  }, [isAuthenticated, token]);

  const login = async ({ email, password }) => {
    try {
      const response = await loginAdmin(email, password);
      // Admin login returns { success: true, token: "...", admin: {...} }
      if (response.success && response.token) {
        const authToken = response.token;
        setToken(authToken);
        setIsAuthenticated(true);
        return { success: true, token: authToken };
      }
      return {
        success: false,
        message: response.message || 'Identifiants invalides',
      };
    } catch (err) {
      return {
        success: false,
        message: err?.message || 'Identifiants invalides',
      };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      token,
      login,
      logout,
    }),
    [isAuthenticated, token],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }

  return context;
};
