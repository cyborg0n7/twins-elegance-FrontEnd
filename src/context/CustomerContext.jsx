import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  fetchCustomerProfile,
  fetchCustomerOrders,
} from '../services/api';

const CustomerContext = createContext(undefined);

const CUSTOMER_KEY = 'twins_elegance_customer';
const TOKEN_KEY = 'twins_elegance_customer_token';

export const CustomerProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    const stored = localStorage.getItem(CUSTOMER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrders = useCallback(async () => {
    if (!customer || !token) {
      setOrders([]);
      return;
    }
    try {
      const ordersData = await fetchCustomerOrders(token);
      setOrders(ordersData || []);
    } catch (err) {
      console.error('Error loading orders:', err);
      setOrders([]);
    }
  }, [customer, token]);

  useEffect(() => {
    if (customer && token) {
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
      localStorage.setItem(TOKEN_KEY, token);
      loadOrders();
    } else {
      localStorage.removeItem(CUSTOMER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      setOrders([]);
    }
  }, [customer, token, loadOrders]);

  // Load customer profile on mount if token exists
  useEffect(() => {
    const loadProfile = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken && !customer) {
        try {
          const profile = await fetchCustomerProfile(storedToken);
          setCustomer(profile);
          setToken(storedToken);
        } catch (err) {
          // Token might be invalid, clear it
          localStorage.removeItem(TOKEN_KEY);
          console.error('Error loading profile:', err);
        }
      }
    };
    loadProfile();
  }, [customer]);

  const handleLogin = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const response = await loginCustomer(email, password);
      const customerData = response.customer || response;
      const authToken = response.token;

      setCustomer(customerData);
      setToken(authToken);
      return customerData;
    } catch (err) {
      const errorMessage = err.message || 'Erreur de connexion';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegister = useCallback(async (payload) => {
    setError(null);
    setLoading(true);
    try {
      const response = await registerCustomer(payload);
      const customerData = response.customer || response;
      const authToken = response.token;

      setCustomer(customerData);
      setToken(authToken);
      return customerData;
    } catch (err) {
      const errorMessage = err.message || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      if (token) {
        await logoutCustomer(token);
      }
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      setCustomer(null);
      setToken(null);
      setOrders([]);
      setError(null);
    }
  }, [token]);

  const refreshOrders = useCallback(async () => {
    await loadOrders();
    return orders;
  }, [loadOrders, orders]);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    try {
      const profile = await fetchCustomerProfile(token);
      setCustomer(profile);
    } catch (err) {
      console.error('Error refreshing profile:', err);
      // If token is invalid, logout
      if (err.status === 401) {
        handleLogout();
      }
    }
  }, [token, handleLogout]);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(customer && token),
      loading,
      error,
      customer,
      token,
      orders,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      refreshOrders,
      refreshProfile,
      setError,
      setOrders,
    }),
    [
      customer,
      token,
      loading,
      error,
      orders,
      handleLogin,
      handleRegister,
      handleLogout,
      refreshOrders,
      refreshProfile,
    ],
  );

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};
