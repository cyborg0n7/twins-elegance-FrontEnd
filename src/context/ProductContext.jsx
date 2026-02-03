import { createContext, useContext, useState, useEffect } from 'react';
import { products as defaultProducts, categories as defaultCategories } from '../data/products';
import {
  getProducts as getProductsFromStorage,
  initializeProducts,
  addProduct as addProductToStorage,
  deleteProduct as deleteProductFromStorage,
} from '../utils/database';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialiser les produits au chargement
  useEffect(() => {
    const stored = initializeProducts(defaultProducts);
    setProducts(stored);
    
    // Extraire les catégories uniques
    const uniqueCategories = ['Tous', ...new Set(stored.map((p) => p.category))];
    setCategories(uniqueCategories);
    setIsInitialized(true);
  }, []);

  const refreshProducts = () => {
    const stored = getProductsFromStorage();
    setProducts(stored);
    const uniqueCategories = ['Tous', ...new Set(stored.map((p) => p.category))];
    setCategories(uniqueCategories);
  };

  const addProduct = (product) => {
    addProductToStorage(product);
    refreshProducts();
  };

  const deleteProduct = (productId) => {
    deleteProductFromStorage(productId);
    refreshProducts();
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        isInitialized,
        addProduct,
        deleteProduct,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

