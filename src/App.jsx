import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { CustomerProvider } from './context/CustomerContext';
import { ProductProvider } from './context/ProductContext';
import Header from './components/Header';
import Home from './pages/Home';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedCustomerRoute from './components/ProtectedCustomerRoute';
import CustomerAuth from './pages/CustomerAuth';
import CustomerAccount from './pages/CustomerAccount';
import './App.css';

function App() {
  return (
    <ProductProvider>
      <AdminProvider>
        <CustomerProvider>
          <CartProvider>
            <Router>
              <div className="App">
                <Header />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/mon-compte" element={<CustomerAuth />} />
                    <Route
                      path="/mon-compte/espace"
                      element={
                        <ProtectedCustomerRoute>
                          <CustomerAccount />
                        </ProtectedCustomerRoute>
                      }
                    />
                    <Route
                      path="/admin/dashboard"
                      element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
              </div>
            </Router>
          </CartProvider>
        </CustomerProvider>
      </AdminProvider>
    </ProductProvider>
  );
}

export default App;
