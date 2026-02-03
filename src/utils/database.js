const ORDERS_KEY = 'twins_elegance_orders';
const CUSTOMERS_KEY = 'twins_elegance_customers';
const PRODUCTS_KEY = 'twins_elegance_products_v3';

const readFromStorage = (key) => {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
};

const writeToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getOrders = () => {
  return readFromStorage(ORDERS_KEY);
};

export const addOrder = (order) => {
  const current = getOrders();
  current.unshift(order);
  writeToStorage(ORDERS_KEY, current);
};

export const getCustomers = () => {
  return readFromStorage(CUSTOMERS_KEY);
};

export const addOrUpdateCustomer = (customer) => {
  const current = getCustomers();
  const existingIndex = current.findIndex(
    (item) => item.email.toLowerCase() === customer.email.toLowerCase(),
  );

  if (existingIndex >= 0) {
    current[existingIndex] = {
      ...current[existingIndex],
      ...customer,
      updatedAt: new Date().toISOString(),
    };
  } else {
    current.unshift({
      ...customer,
      createdAt: new Date().toISOString(),
    });
  }

  writeToStorage(CUSTOMERS_KEY, current);
};



export const updateOrder = (orderId, updates) => {
  const current = getOrders();
  const index = current.findIndex((o) => o.id === orderId);
  if (index >= 0) {
    current[index] = { ...current[index], ...updates };
    writeToStorage(ORDERS_KEY, current);
    return current[index];
  }
  return null;
};

export const getProducts = () => {
  return readFromStorage(PRODUCTS_KEY);
};

export const initializeProducts = (defaultProducts) => {
  // Only initialize if storage is empty to preserve changes
  const existing = getProducts();
  if (!existing || existing.length === 0) {
    writeToStorage(PRODUCTS_KEY, defaultProducts);
    return defaultProducts;
  }
  return existing;
};

export const addProduct = (product) => {
  const current = getProducts();
  // Générer un ID unique si non fourni
  const newId = product.id || Date.now();
  const newProduct = {
    ...product,
    id: newId,
    inStock: product.inStock !== undefined ? product.inStock : true,
  };
  current.unshift(newProduct);
  writeToStorage(PRODUCTS_KEY, current);
  return newProduct;
};

export const deleteProduct = (productId) => {
  const current = getProducts();
  // Use loose inequality to handle string/number ID mismatches
  const filtered = current.filter((p) => p.id != productId);
  writeToStorage(PRODUCTS_KEY, filtered);
  return filtered;
};

export const updateProduct = (productId, updates) => {
  const current = getProducts();
  // Use loose equality for finding index
  const index = current.findIndex((p) => p.id == productId);
  if (index >= 0) {
    current[index] = { ...current[index], ...updates };
    writeToStorage(PRODUCTS_KEY, current);
    return current[index];
  }
  return null;
};

export const deleteCustomer = (email) => {
  const current = getCustomers();
  // Case-insensitive email matching for robustness
  const targetEmail = String(email).trim().toLowerCase();
  const filtered = current.filter((c) =>
    String(c.email).trim().toLowerCase() !== targetEmail
  );
  writeToStorage(CUSTOMERS_KEY, filtered);
  return filtered;
};

export const clearDatabase = () => {
  localStorage.removeItem(ORDERS_KEY);
  localStorage.removeItem(CUSTOMERS_KEY);
  localStorage.removeItem(PRODUCTS_KEY);
};

