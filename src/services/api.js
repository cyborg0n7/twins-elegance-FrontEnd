import {
  getCustomers,
  addOrUpdateCustomer,
  addOrder,
  getOrders as getFromDatabaseOrders,
  getProducts as getLocalProducts, // Rename to avoid conflict if I kept the export name same, but I'll implement getProducts below from local
  initializeProducts
} from '../utils/database';
import { products as defaultProducts } from '../data/products'; // fallback for initialization

// Helper for simulated delay
const mockDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for mock success response
const mockSuccess = (data) => ({ success: true, ...data });

// Helper to mock a JWT token
const mockToken = (user) => `mock-token-${user.id}-${Date.now()}`;

// --- CUSTOMER AUTH ---

export const loginCustomer = async (email, password) => {
  await mockDelay();
  const customers = getCustomers();
  const user = customers.find(c => c.email === email && c.password === password);

  if (user) {
    const { password, ...userWithoutPassword } = user;
    return mockSuccess({
      message: 'Connexion réussie',
      token: mockToken(user),
      customer: userWithoutPassword
    });
  }

  throw new Error('Email ou mot de passe incorrect');
};

export const registerCustomer = async (data) => {
  await mockDelay();
  const customers = getCustomers();

  if (customers.find(c => c.email === data.email)) {
    throw new Error('Cet email est déjà utilisé');
  }

  const newCustomer = {
    id: Date.now(),
    ...data
  };

  addOrUpdateCustomer(newCustomer);

  const { password, ...userWithoutPassword } = newCustomer;
  return mockSuccess({
    message: 'Inscription réussie',
    token: mockToken(newCustomer),
    customer: userWithoutPassword
  });
};

export const fetchCustomerProfile = async (token) => {
  // In a real app we'd decode the token. Here we'll just mock it or assume the app handles state.
  // Actually, for this mock to work well with Context, let's just return success if token exists.
  await mockDelay(300);
  if (!token) throw new Error('Non authentifié');
  return mockSuccess({ message: 'Profile valid' });
};

export const updateCustomerProfile = async (token, data) => {
  await mockDelay();
  // In mock mode, we assume the frontend context holds the user email to look up, 
  // or we pass the user ID. Simplified: We just update based on email in data if present.
  if (data.email) {
    addOrUpdateCustomer(data);
  }
  return mockSuccess({ message: 'Profil mis à jour', customer: data });
};

export const logoutCustomer = async (token) => {
  await mockDelay(300);
  return mockSuccess({ message: 'Déconnexion réussie' });
};

export const fetchCustomerOrders = async (token) => {
  await mockDelay();
  const customers = getCustomers();
  // Needs logic to find user by token, but simplified: return empty or demo data
  // Implementation note: The checkout flow is what matters most for now.
  return [];
};

// --- ADMIN AUTH (Mock) ---
export const loginAdmin = async (email, password) => {
  await mockDelay();
  // Hardcoded check for frontend-only auth
  if (email === 'admin@twins-elegance.com' && password === 'Admin@2025') {
    return {
      success: true,
      token: 'mock-admin-token-' + Date.now(),
      admin: { id: 1, email: 'admin@twins-elegance.com' }
    };
  }

  return {
    success: false,
    message: 'Email ou mot de passe incorrect'
  };
};

// --- PRODUCTS ---

export const getProducts = async () => {
  // Try local storage first, else use default data
  // initializeProducts now safely checks for key existence (checking if null)
  // so it won't overwrite an intentional empty list.
  const products = initializeProducts(defaultProducts);
  return { data: products };
};

export const createProduct = async (token, productData) => {
  await mockDelay();
  // Reuse database utility if available or simulate
  return mockSuccess({ message: 'Produit créé', product: { id: Date.now(), ...productData } });
};

export const deleteProduct = async (token, productId) => {
  await mockDelay();
  return mockSuccess({ message: 'Produit supprimé' });
};

// --- ORDERS ---

// --- ORDERS ---

export const getOrders = async (token) => {
  await mockDelay();
  // Ensure we check token in real app
  return { success: true, orders: getFromDatabaseOrders() };
};

export const createOrder = async (orderData) => {
  await mockDelay(1500); // Longer delay for effect
  addOrder({
    id: `ORD-${Date.now()}`,
    date: new Date().toISOString(),
    ...orderData
  });
  return mockSuccess({ message: 'Commande enregistrée avec succès' });
};

export const submitOrder = createOrder;

export default {
  loginCustomer,
  registerCustomer,
  fetchCustomerProfile,
  updateCustomerProfile,
  fetchCustomerOrders,
  logoutCustomer,
  loginAdmin,
  getProducts,
  createProduct,
  deleteProduct,
  createOrder,
  submitOrder
};