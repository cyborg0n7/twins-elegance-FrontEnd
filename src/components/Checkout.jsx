import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCustomer } from '../context/CustomerContext';
import { submitOrder } from '../services/api';
import { CheckCircle, Truck, CreditCard, ChevronRight } from 'lucide-react';

const MOROCCAN_CITIES = [
  'Agadir', 'Aïn Harrouda', 'Ait Melloul', 'Al Hoceïma', 'Azilal', 'Azrou', 'Béni Mellal',
  'Benslimane', 'Berkane', 'Berrechid', 'Bouskoura', 'Bouznika', 'Casablanca', 'Chefchaouen',
  'Dakhla', 'El Hajeb', 'El Jadida', 'Errachidia', 'Essaouira', 'Fès', 'Fquih Ben Salah',
  'Guelmim', 'Ifrane', 'Imzouren', 'Inzegane', 'Kénitra', 'Khemisset', 'Khouribga', 'Laâyoune',
  'Larache', 'Martil', 'Marrakech', 'Meknès', 'Midelt', 'Mohammedia', 'Nador', 'Ouarzazate',
  'Ouezzane', 'Oujda', 'Rabat', 'Safi', 'Sale', 'Sefrou', 'Settat', 'Sidi Bennour', 'Sidi Ifni',
  'Sidi Kacem', 'Sidi Slimane', 'Skhirat', 'Souk El Arbaa', 'Tanger', 'Taounate', 'Taroudant',
  'Taza', 'Témara', 'Tétouan', 'Tifelt', 'Tinghir', 'Tiznit', 'Youssoufia', 'Zagora', 'Autre',
].sort();

// Villes avec frais de livraison à 25 DH
const LOW_DELIVERY_CITIES = ['Rabat', 'Sale', 'Témara'];

// Fonction pour calculer les frais de livraison
const getDeliveryFee = (city) => {
  if (!city) return 0;
  return LOW_DELIVERY_CITIES.includes(city) ? 25 : 35;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isAuthenticated: isCustomerAuthenticated, customer, token, refreshOrders } = useCustomer();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (isCustomerAuthenticated && customer) {
      setFormData((prev) => ({
        ...prev,
        firstName: customer.first_name || customer.firstName || '',
        lastName: customer.last_name || customer.lastName || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
      }));
    }
  }, [isCustomerAuthenticated, customer]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const deliveryFee = getDeliveryFee(formData.city);
      const subtotal = getCartTotal();
      const total = subtotal + deliveryFee;

      const customerData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zip_code: '',
        email: customer?.email || formData.phone + '@guest.twins-elegance.local',
      };

      const order = {
        customer: customerData,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        status: 'pending',
      };

      await submitOrder(order, token || null);

      if (isCustomerAuthenticated) {
        await refreshOrders();
      }

      setOrderPlaced(true);
      setTimeout(() => {
        clearCart();
        navigate('/');
      }, 3000);
    } catch (err) {
      setSubmitError(err?.message || 'Erreur lors de la soumission de la commande. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-cream-light flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="font-serif text-3xl text-luxury-text mb-4">Votre panier est vide</h2>
          <button
            onClick={() => navigate('/products')}
            className="text-gold-dark font-serif uppercase tracking-wider underline hover:text-luxury-black transition-colors"
          >
            Retourner à la boutique
          </button>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="fixed inset-0 bg-cream-light flex items-center justify-center z-50">
        <div className="text-center p-12 bg-white shadow-luxury max-w-lg mx-4 animate-fade-in-up">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="font-serif text-4xl text-luxury-text mb-4">Commande Confirmée !</h2>
          <p className="font-sans text-luxury-muted mb-6">
            Merci pour votre achat. Nous préparons votre commande avec le plus grand soin.
          </p>
          <div className="w-12 h-1 bg-gold mx-auto rounded-full mb-6"></div>
          <p className="text-sm text-gray-400">Redirection vers l'accueil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-light min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Form Section */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white p-8 shadow-sm">
              <h1 className="font-serif text-3xl text-luxury-text mb-8 flex items-center gap-3">
                <Truck className="w-6 h-6 text-gold" />
                Informations de Livraison
              </h1>

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-sans uppercase tracking-wider text-luxury-muted">Prénom *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-gold outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-sans uppercase tracking-wider text-luxury-muted">Nom *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-gold outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-sans uppercase tracking-wider text-luxury-muted">Téléphone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-gold outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-sans uppercase tracking-wider text-luxury-muted">Adresse *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-gold outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-sans uppercase tracking-wider text-luxury-muted">Ville *</label>
                  <div className="relative">
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-gray-50 border border-gray-200 focus:border-gold outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Sélectionnez votre ville</option>
                      {MOROCCAN_CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {submitError && (
                  <div className="p-4 bg-red-50 text-red-500 text-sm border-l-4 border-red-500">
                    {submitError}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Summary Section */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-8 shadow-luxury border border-white/40 sticky top-24">
              <h2 className="font-serif text-2xl text-luxury-text mb-6 pb-4 border-b border-gray-100">Votre Commande</h2>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-gray-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm truncate text-luxury-black">{item.name}</h4>
                      <p className="text-xs text-luxury-muted">Qté: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-sm text-gold-dark">
                      {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-8 pt-4 border-t border-gray-100 font-sans text-sm">
                <div className="flex justify-between text-luxury-muted">
                  <span>Sous-total</span>
                  <span>{getCartTotal().toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between text-luxury-muted">
                  <span>Livraison</span>
                  <span>
                    {formData.city
                      ? `${getDeliveryFee(formData.city).toFixed(2)} DH`
                      : '--'}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold text-luxury-black pt-4 border-t border-gray-100">
                  <span>Total</span>
                  <span>
                    {formData.city
                      ? (getCartTotal() + getDeliveryFee(formData.city)).toFixed(2)
                      : getCartTotal().toFixed(2)}{' '}
                    DH
                  </span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="block w-full text-center bg-luxury-black text-white py-4 font-serif uppercase tracking-wider hover:bg-gold transition-colors duration-300 shadow-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? 'Traitement...' : <span className="flex items-center justify-center gap-2">Confirmer <CreditCard className="w-4 h-4" /></span>}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
