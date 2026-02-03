import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { useCustomer } from '../context/CustomerContext';

const Header = () => {
  const { getCartItemsCount } = useCart();
  const { isAuthenticated: isAdminAuthenticated, logout: adminLogout } = useAdmin();
  const { isAuthenticated: isCustomerAuthenticated, logout: customerLogout } = useCustomer();
  const [logoError, setLogoError] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();



  // Handle scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = "relative font-serif font-medium text-luxury-secondary hover:text-gold-dark transition-colors duration-300 py-2 group";
  const activeLinkClass = "text-gold-dark";

  // Hide header on admin dashboard
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav h-20' : 'bg-transparent h-24'
        }`}
    >
      <div className="container mx-auto px-6 h-full flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          {!logoError && (
            <img
              src="/twins-elegance.png"
              alt="Twin's Elegance"
              className={`object-contain transition-all duration-300 ${isScrolled ? 'h-12' : 'h-16'
                } group-hover:scale-105`}
              onError={() => setLogoError(true)}
            />
          )}
          <span className={`font-serif font-bold text-luxury-text tracking-tight transition-all duration-300 ${isScrolled ? 'text-xl' : 'text-2xl'
            }`}>
            Twin&apos;s Elegance
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className={`${navLinkClass} ${location.pathname === '/' ? activeLinkClass : ''}`}>
            Accueil
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-accent transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/products" className={`${navLinkClass} ${location.pathname === '/products' ? activeLinkClass : ''}`}>
            Produits
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-accent transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link to="/cart" className={`${navLinkClass} flex items-center gap-2`}>
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden md:inline">Panier</span>
            {getCartItemsCount() > 0 && (
              <span className="bg-gold text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center -mt-1 shadow-sm">
                {getCartItemsCount()}
              </span>
            )}
          </Link>

          {/* Customer Auth */}
          {isCustomerAuthenticated ? (
            <div className="flex items-center gap-4 border-l border-gold/30 pl-4">
              <Link to="/mon-compte/espace" className={navLinkClass}>
                Mon Compte
              </Link>
              <button
                type="button"
                className="font-serif text-sm text-luxury-muted hover:text-red-500 transition-colors"
                onClick={customerLogout}
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link to="/mon-compte" className="px-6 py-2 bg-luxury-black text-white font-serif text-sm rounded-sm hover:bg-gold-dark transition-colors duration-300 shadow-lg hover:shadow-xl">
              Connexion
            </Link>
          )}


        </nav>
      </div>
    </header>
  );
};

export default Header;

