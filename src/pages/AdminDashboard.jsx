import { useMemo, useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  getCustomers,
  getOrders,
  deleteCustomer,
  updateOrder,
  getProducts,
  addProduct as addProductToDb,
  deleteProduct as deleteProductFromDb,
  updateProduct as updateProductInDb
} from '../utils/database';
import { categories as defaultCategories } from '../data/products';
import ConfirmationModal from '../components/ConfirmationModal';
import './Admin.css';

const formatCurrency = (value) =>
  new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(value).replace('MAD', 'DH');

const formatDate = (dateString) => {
  if (!dateString) return 'Date inconnue';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? 'Date inconnue' : date.toLocaleString('fr-FR');
};



const AdminDashboard = () => {
  const { logout, adminInfo } = useAdmin();
  // We use local state + DB for immediate updates, bypassing the sometimes-stale Context
  const categories = defaultCategories;

  const [selectedTab, setSelectedTab] = useState('orders');
  const [refreshKey, setRefreshKey] = useState(0);

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: '',
    category: 'Colliers',
    description: '',
    inStock: true,
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  // Fetch data on mount or refresh
  useEffect(() => {
    setOrders(getOrders());
    setCustomers(getCustomers());
    setProducts(getProducts());
  }, [refreshKey]);

  const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);

  // --- Handlers ---

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image est trop volumineuse. Taille maximale : 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setNewProduct({ ...newProduct, image: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert('Veuillez remplir tous les champs obligatoires, y compris l\'image');
      return;
    }
    addProductToDb({
      ...newProduct,
      price: parseFloat(newProduct.price),
    });
    setNewProduct({
      name: '',
      price: '',
      image: '',
      category: 'Colliers',
      description: '',
      inStock: true,
    });
    setImagePreview(null);
    setShowAddProductForm(false);
    setRefreshKey((prev) => prev + 1);
  };

  const handleDeleteProduct = (productId) => {
    setModalState({
      isOpen: true,
      title: 'Supprimer le produit',
      message: 'Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.',
      onConfirm: () => {
        deleteProductFromDb(productId);
        setRefreshKey((prev) => prev + 1);
      }
    });
  };

  const handleToggleStock = (product) => {
    updateProductInDb(product.id, { inStock: !product.inStock });
    setRefreshKey(prev => prev + 1);
  };

  const handleDeleteCustomer = (email) => {
    setModalState({
      isOpen: true,
      title: 'Supprimer le client',
      message: `Voulez-vous vraiment supprimer le client ${email} ? Cette action est irréversible.`,
      onConfirm: () => {
        deleteCustomer(email);
        setRefreshKey(prev => prev + 1);
      }
    });
  };

  const handleOrderStatusChange = (orderId, newStatus) => {
    updateOrder(orderId, { status: newStatus });
    setRefreshKey(prev => prev + 1);
  };

  const availableCategories = categories.filter((cat) => cat !== 'Tous');

  // --- Render Helpers ---

  const StatCard = ({ title, value, icon }) => (
    <div className="bg-white/50 backdrop-blur-md p-6 rounded-lg shadow-luxury border border-white/20 text-center hover:transform hover:-translate-y-1 transition-all duration-300">
      <h3 className="text-luxury-secondary font-serif mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gold-dark">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-light pt-32 px-4 pb-20">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-luxury-black mb-1">Tableau de Bord</h1>
            <p className="text-luxury-muted">Bienvenue, {adminInfo?.email || 'Administrateur'}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setRefreshKey((prev) => prev + 1)}
              className="px-6 py-2 bg-white text-luxury-black border border-luxury-muted/30 rounded-full hover:bg-gold hover:text-white transition-all shadow-sm"
            >
              Actualiser
            </button>
            <button
              onClick={logout}
              className="px-6 py-2 bg-red-50 text-red-500 border border-red-100 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Commandes" value={orders.length} />
          <StatCard title="Clients" value={customers.length} />
          <StatCard title="Produits" value={products.length} />
          <StatCard title="Revenus" value={formatCurrency(totalRevenue)} />
        </section>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 border-b border-gold/20 pb-4">
          {['orders', 'customers', 'products'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-2 rounded-full font-serif text-lg transition-all duration-300 ${selectedTab === tab
                ? 'bg-luxury-black text-gold shadow-lg'
                : 'bg-white text-luxury-muted hover:bg-gold/10'
                }`}
            >
              {tab === 'orders' && 'Commandes'}
              {tab === 'customers' && 'Clients'}
              {tab === 'products' && 'Produits'}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-luxury p-6 md:p-8 min-h-[500px]">

          {/* ORDERS TAB */}
          {selectedTab === 'orders' && (
            <div className="overflow-x-auto">
              {orders.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-luxury-secondary font-serif border-b border-gold/20">
                      <th className="p-4">Détails Commande</th>
                      <th className="p-4">Client</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Statut</th>
                      <th className="p-4">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gold/5 transition-colors">
                        <td className="p-4">
                          <div className="flex flex-col gap-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <img
                                  src={item.image || '/placeholder-jewelry.jpg'}
                                  alt={item.name}
                                  className="w-10 h-10 object-cover rounded-md border border-gold/20"
                                />
                                <div>
                                  <p className="font-medium text-luxury-black text-sm">{item.name}</p>
                                  <p className="text-xs text-luxury-muted">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-luxury-black">
                            {(order.customer.firstName || order.customer.first_name)} {(order.customer.lastName || order.customer.last_name)}
                          </div>
                          <div className="text-sm text-luxury-muted">{order.customer.email}</div>
                          <div className="text-xs text-luxury-muted">{order.customer.phone}</div>
                        </td>
                        <td className="p-4 text-sm text-luxury-secondary">
                          {formatDate(order.date || order.createdAt)}
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status || 'Pending'}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-xs font-bold border outline-none cursor-pointer ${(order.status === 'Shipped' || order.status === 'Delivered') ? 'bg-green-100 text-green-700 border-green-200' :
                              order.status === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                'bg-yellow-100 text-yellow-700 border-yellow-200'
                              }`}
                          >
                            <option value="Pending">En attente</option>
                            <option value="Processing">En cours</option>
                            <option value="Shipped">Expédiée</option>
                            <option value="Delivered">Livrée</option>
                            <option value="Cancelled">Annulée</option>
                          </select>
                        </td>
                        <td className="p-4 font-bold text-gold-dark">
                          {formatCurrency(order.total || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-luxury-muted py-10">Aucune commande pour le moment.</p>
              )}
            </div>
          )}

          {/* CUSTOMERS TAB */}
          {selectedTab === 'customers' && (
            <div className="overflow-x-auto">
              {customers.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-luxury-secondary font-serif border-b border-gold/20">
                      <th className="p-4">Client</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Localisation</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {customers.map(customer => (
                      <tr key={customer.email} className="hover:bg-gold/5 transition-colors">
                        <td className="p-4 font-medium text-luxury-black">
                          {customer.firstName} {customer.lastName}
                        </td>
                        <td className="p-4 text-sm text-luxury-secondary">
                          <p>{customer.email}</p>
                          <p>{customer.phone}</p>
                        </td>
                        <td className="p-4 text-sm text-luxury-muted">
                          {customer.city}, {customer.country || 'Maroc'}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteCustomer(customer.email)}
                            className="px-3 py-1 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-xs font-bold"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-luxury-muted py-10">Aucun client enregistré.</p>
              )}
            </div>
          )}

          {/* PRODUCTS TAB */}
          {selectedTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white/40 p-4 rounded-xl border border-gold/10">
                <h2 className="text-xl font-serif text-luxury-black">Gestion du Catalogue</h2>
                <button
                  onClick={() => setShowAddProductForm(!showAddProductForm)}
                  className="bg-luxury-black text-gold px-6 py-2 rounded-md hover:bg-gold hover:text-white transition-colors shadow-lg"
                >
                  {showAddProductForm ? 'Fermer' : 'Ajouter un Produit'}
                </button>
              </div>

              {showAddProductForm && (
                <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-xl shadow-inner border border-gold/10 animate-fade-in-up">
                  <h3 className="text-lg font-serif mb-4">Nouveau Produit</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Nom du produit"
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold outline-none"
                      value={newProduct.name}
                      onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Prix"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold outline-none pr-12"
                        value={newProduct.price}
                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                        required
                      />
                      <span className="absolute right-4 top-3 text-gray-400">DH</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <select
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold outline-none"
                      value={newProduct.category}
                      onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    >
                      {availableCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold/10 file:text-gold hover:file:bg-gold/20"
                      />
                      {imagePreview && <img src={imagePreview} alt="Preview" className="w-10 h-10 rounded object-cover" />}
                    </div>
                  </div>

                  <textarea
                    placeholder="Description (optionnel)"
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-gold outline-none mb-4 h-24"
                    value={newProduct.description}
                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  />

                  <button type="submit" className="w-full py-3 bg-gold text-white font-bold rounded-lg hover:bg-gold-dark transition-colors shadow-md">
                    Confirmer l'ajout
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 gap-4">
                {products.map(product => (
                  <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4 hover:shadow-md transition-shadow">
                    <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-lg border border-gold/10" />

                    <div className="flex-1 text-center md:text-left">
                      <h4 className="font-serif font-bold text-luxury-black">{product.name}</h4>
                      <p className="text-sm text-luxury-muted">{product.category}</p>
                      <p className="text-gold-dark font-bold mt-1">{product.price.toFixed(2)} DH</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleToggleStock(product)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${product.inStock
                          ? 'bg-green-50 text-green-600 border-green-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 hover:content-["Rupture"]'
                          : 'bg-red-50 text-red-500 border-red-200 hover:bg-green-50 hover:text-green-600'
                          }`}
                      >
                        {product.inStock ? '✓ En Stock' : '❌ Rupture'}
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Supprimer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
      />
    </div>
  );
};

export default AdminDashboard;

