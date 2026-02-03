import { useEffect, useState } from 'react';
import { useCustomer } from '../context/CustomerContext';
import { updateCustomerProfile } from '../services/api';
import { User, MapPin, ShoppingBag, LogOut, Package, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerAccount = () => {
  const { customer, token, orders, refreshOrders, refreshProfile, logout } = useCustomer();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const [formValues, setFormValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip_code: '',
    password: '',
    password_confirmation: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');

  // Populate form when customer data is available
  useEffect(() => {
    if (customer) {
      setFormValues((prev) => ({
        ...prev,
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        zip_code: customer.zip_code || '',
      }));
    }
  }, [customer]);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!customer) {
    return (
      <div className="min-h-screen pt-32 flex justify-center items-start">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const handleChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProfileMessage('');
    setProfileError('');
    setIsSaving(true);

    try {
      if (formValues.password && formValues.password !== formValues.password_confirmation) {
        setProfileError('Les mots de passe ne correspondent pas');
        setIsSaving(false);
        return;
      }

      const updatePayload = {
        first_name: formValues.first_name,
        last_name: formValues.last_name,
        phone: formValues.phone,
        address: formValues.address,
        city: formValues.city,
        zip_code: formValues.zip_code,
        email: formValues.email, // Ensure email is passed back if needed by mock
      };

      if (formValues.password) {
        updatePayload.password = formValues.password;
      }

      await updateCustomerProfile(token, updatePayload);
      await refreshProfile();

      setProfileMessage('Profil mis à jour avec succès.');
      setFormValues((prev) => ({ ...prev, password: '', password_confirmation: '' }));
    } catch (err) {
      setProfileError(err?.message || 'Impossible de mettre à jour votre profil.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-cream-light min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="font-serif text-4xl text-luxury-black mb-4">Mon Espace</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Bienvenue, {customer.first_name}. Gérez vos informations personnelles et suivez vos commandes.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Navigation */}
          <aside className="lg:w-1/4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white p-6 shadow-luxury rounded-sm sticky top-32">
              <nav className="flex flex-col space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-3 px-4 py-3 text-left transition-all duration-300 ${activeTab === 'profile' ? 'bg-bg-gold/10 text-gold-dark font-medium border-l-2 border-gold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <User className="w-5 h-5" />
                  Mes informations
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-3 px-4 py-3 text-left transition-all duration-300 ${activeTab === 'orders' ? 'bg-bg-gold/10 text-gold-dark font-medium border-l-2 border-gold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Mes commandes
                </button>
                <div className="h-px bg-gray-100 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-left text-red-500 hover:bg-red-50 transition-all duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  Se déconnecter
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

            {activeTab === 'profile' && (
              <div className="bg-white p-8 md:p-10 shadow-luxury rounded-sm">
                <h2 className="font-serif text-2xl mb-8 border-b border-gray-100 pb-4">Mes Informations Personnelles</h2>

                {profileError && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm border-l-4 border-red-500">
                    {profileError}
                  </div>
                )}
                {profileMessage && (
                  <div className="mb-6 p-4 bg-green-50 text-green-600 text-sm border-l-4 border-green-500">
                    {profileMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Prénom</label>
                      <input
                        type="text"
                        value={formValues.first_name}
                        onChange={(e) => handleChange('first_name', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold outline-none transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Nom</label>
                      <input
                        type="text"
                        value={formValues.last_name}
                        onChange={(e) => handleChange('last_name', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={formValues.email}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Téléphone</label>
                      <input
                        type="tel"
                        value={formValues.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Adresse</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={formValues.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Ville</label>
                      <input
                        type="text"
                        value={formValues.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold outline-none transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Code Postal</label>
                      <input
                        type="text"
                        value={formValues.zip_code}
                        onChange={(e) => handleChange('zip_code', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-6 mt-6">
                    <h3 className="font-serif text-lg mb-4 text-luxury-black">Modifier le mot de passe</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                        <input
                          type="password"
                          value={formValues.password}
                          onChange={(e) => handleChange('password', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold outline-none transition-colors"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Confirmer</label>
                        <input
                          type="password"
                          value={formValues.password_confirmation}
                          onChange={(e) => handleChange('password_confirmation', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-gold outline-none transition-colors"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full md:w-auto px-8 py-3 bg-luxury-black text-white font-serif uppercase tracking-wider hover:bg-gold transition-colors duration-300 disabled:opacity-70 mt-4"
                  >
                    {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white p-8 md:p-10 shadow-luxury rounded-sm">
                <h2 className="font-serif text-2xl mb-8 border-b border-gray-100 pb-4">Historique des Commandes</h2>

                {orders.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6">Vous n'avez pas encore passé de commande.</p>
                    <a href="/products" className="text-gold-dark hover:underline font-medium">Découvrir nos collections</a>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex flex-col md:flex-row md:gap-8 gap-2 text-sm text-gray-600">
                            <div>
                              <span className="block text-xs uppercase text-gray-400">Commande</span>
                              <span className="font-mono text-luxury-black font-medium">#{typeof order.id === 'string' && order.id.startsWith('ORD-') ? order.id.split('-')[1] : order.id}</span>
                            </div>
                            <div>
                              <span className="block text-xs uppercase text-gray-400">Date</span>
                              <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="block text-xs uppercase text-gray-400">Total</span>
                              <span className="font-serif text-gold-dark font-bold">{Number(order.total || 0).toFixed(2)} DH</span>
                            </div>
                          </div>
                          <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3" /> {order.status || 'Confirmée'}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow">
                                  <h4 className="font-serif text-luxury-black">{item.name}</h4>
                                  <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                                </div>
                                <div className="text-right font-medium">
                                  {Number(item.price * item.quantity).toFixed(2)} DH
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccount;
