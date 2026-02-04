import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';
import { useAdmin } from '../context/AdminContext';
import { User, Mail, Lock, Eye, EyeOff, MapPin, Phone, Building, Home, ArrowRight } from 'lucide-react';

const defaultRegisterForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  zip_code: '',
  password: '',
  password_confirmation: '',
};

const defaultLoginForm = {
  email: '',
  password: '',
};

const CustomerAuth = () => {
  const { isAuthenticated: isCustomerAuthenticated, login: customerLogin, register, error, setError } = useCustomer();
  const { isAuthenticated: isAdminAuthenticated, login: adminLogin } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginForm, setLoginForm] = useState(defaultLoginForm);
  const [registerForm, setRegisterForm] = useState(defaultRegisterForm);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterPasswordConfirm, setShowRegisterPasswordConfirm] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  if (isCustomerAuthenticated) {
    return <Navigate to="/mon-compte/espace" replace />;
  }

  if (isAdminAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const switchTab = (tab) => {
    setError(null);
    setSuccessMessage('');
    setFormErrors({});
    setActiveTab(tab);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLoginForm = () => {
    const errors = {};
    if (!loginForm.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!validateEmail(loginForm.email)) {
      errors.email = 'Format d\'email invalide';
    }
    if (!loginForm.password) {
      errors.password = 'Le mot de passe est requis';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage('');
    setFormErrors({});

    if (!validateLoginForm()) {
      return;
    }

    setIsSubmitting(true);

    // Unified Login Logic
    if (loginForm.email.trim().toLowerCase() === 'admin@twins.com' || loginForm.email.trim().toLowerCase() === 'admin@twins-elegance.com') {
      try {
        const adminResult = await adminLogin({
          email: loginForm.email.trim(),
          password: loginForm.password
        });

        if (adminResult && adminResult.success) {
          setSuccessMessage('Connexion administrateur réussie !');
          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 500);
          setIsSubmitting(false);
          return;
        }
      } catch (err) {
        // Fallthrough if admin login fails (e.g. wrong password)
        console.error('Admin login error:', err);
      }
    }

    try {
      await customerLogin(loginForm.email.trim(), loginForm.password);
      setSuccessMessage('Connexion réussie !');
      setTimeout(() => {
        navigate('/mon-compte/espace');
      }, 500);
    } catch (err) {
      const errorMsg = err?.message || err?.payload?.message || 'Email ou mot de passe incorrect.';
      setError(errorMsg);
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateRegisterForm = () => {
    const errors = {};
    if (!registerForm.first_name.trim()) errors.first_name = 'Le prénom est requis';
    if (!registerForm.last_name.trim()) errors.last_name = 'Le nom est requis';
    if (!registerForm.email.trim()) errors.email = 'L\'email est requis';
    else if (!validateEmail(registerForm.email)) errors.email = 'Format invalide';
    if (!registerForm.address.trim()) errors.address = 'Adresse requise';
    if (!registerForm.city.trim()) errors.city = 'Ville requise';
    if (!registerForm.password) errors.password = 'Mot de passe requis';
    else if (registerForm.password.length < 6) errors.password = 'Min 6 caractères';
    if (registerForm.password !== registerForm.password_confirmation) errors.password_confirmation = 'Les mots de passe ne correspondent pas';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage('');
    setFormErrors({});

    if (!validateRegisterForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await register(registerForm);
      setSuccessMessage('Inscription réussie ! Vous allez être redirigé...');
      setTimeout(() => {
        window.location.href = '/mon-compte/espace';
      }, 1000);
    } catch (err) {
      const errorMsg = err?.message || err?.payload?.message || 'Impossible de créer le compte.';
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-cream-light min-h-screen pt-32 pb-20 flex items-center justify-center p-4">
      <div className="bg-white shadow-luxury w-full max-w-4xl flex overflow-hidden rounded-sm min-h-[600px]">

        {/* Left Side - Image/Info */}
        <div className="hidden md:flex md:w-1/2 bg-luxury-black relative flex-col justify-center items-center text-white p-12 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800')] bg-cover bg-center opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 to-transparent"></div>

          <div className="relative z-10 text-center">
            <h2 className="font-serif text-4xl mb-6">L'élégance <br /><span className="text-gold italic">au quotidien</span></h2>
            <p className="font-sans text-white/70 mb-8 leading-relaxed max-w-sm mx-auto">
              Rejoignez notre communauté exclusive pour accéder à nos collections privées et suivre vos commandes en temps réel.
            </p>
            <div className="w-16 h-1 bg-gold mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Right Side - Forms */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">

          <div className="flex justify-center mb-10 border-b border-gray-100">
            <button
              className={`pb-4 px-6 font-serif text-lg transition-all duration-300 relative ${activeTab === 'login' ? 'text-luxury-black font-bold' : 'text-luxury-muted'}`}
              onClick={() => switchTab('login')}
            >
              Connexion
              {activeTab === 'login' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold"></div>}
            </button>
            <button
              className={`pb-4 px-6 font-serif text-lg transition-all duration-300 relative ${activeTab === 'register' ? 'text-luxury-black font-bold' : 'text-luxury-muted'}`}
              onClick={() => switchTab('register')}
            >
              Inscription
              {activeTab === 'register' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gold"></div>}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-500 text-sm border-l-4 border-red-500 animate-fade-in">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 text-green-600 text-sm border-l-4 border-green-500 animate-fade-in">
              {successMessage}
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6 animate-fade-in-up">
              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gold transition-colors" />
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 focus:border-gold outline-none transition-all placeholder:text-gray-400 font-sans"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  />
                  {formErrors.email && <span className="text-xs text-red-500 mt-1 block">{formErrors.email}</span>}
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gold transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mot de passe"
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-100 focus:border-gold outline-none transition-all placeholder:text-gray-400 font-sans"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-luxury-black transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {formErrors.password && <span className="text-xs text-red-500 mt-1 block">{formErrors.password}</span>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-luxury-black text-white font-serif uppercase tracking-wider hover:bg-gold transition-colors duration-300 shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? 'Connexion en cours...' : <>Se connecter <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
              </button>

              <p className="text-center text-xs text-luxury-muted">
                Mot de passe oublié ? <button type="button" className="text-gold-dark hover:underline">Réinitialiser</button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fade-in-up">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gold" />
                  <input
                    type="text"
                    placeholder="Prénom"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 focus:border-gold outline-none text-sm"
                    value={registerForm.first_name}
                    onChange={(e) => setRegisterForm({ ...registerForm, first_name: e.target.value })}
                  />
                </div>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gold" />
                  <input
                    type="text"
                    placeholder="Nom"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 focus:border-gold outline-none text-sm"
                    value={registerForm.last_name}
                    onChange={(e) => setRegisterForm({ ...registerForm, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gold" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 focus:border-gold outline-none text-sm"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
                {formErrors.email && <span className="text-xs text-red-500 mt-1 block">{formErrors.email}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gold" />
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 focus:border-gold outline-none text-sm"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  />
                </div>
                <div className="relative group">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gold" />
                  <input
                    type="text"
                    placeholder="Ville"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 focus:border-gold outline-none text-sm"
                    value={registerForm.city}
                    onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gold" />
                <input
                  type="text"
                  placeholder="Adresse complète"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 focus:border-gold outline-none text-sm"
                  value={registerForm.address}
                  onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gold" />
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    placeholder="Mot de passe"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 focus:border-gold outline-none text-sm"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gold" />
                  <input
                    type={showRegisterPasswordConfirm ? 'text' : 'password'}
                    placeholder="Confirmer"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 focus:border-gold outline-none text-sm"
                    value={registerForm.password_confirmation}
                    onChange={(e) => setRegisterForm({ ...registerForm, password_confirmation: e.target.value })}
                  />
                </div>
              </div>

              {formErrors.password && <span className="text-xs text-red-500 block">{formErrors.password}</span>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-luxury-black text-white font-serif uppercase tracking-wider hover:bg-gold transition-colors duration-300 shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 group mt-2"
              >
                {isSubmitting ? 'Inscription...' : <>Créer mon compte <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default CustomerAuth;
