import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-cream-light flex items-center justify-center">
        <div className="text-center p-8 bg-white/50 backdrop-blur-sm shadow-luxury rounded-sm max-w-md w-full">
          <div className="w-16 h-16 bg-cream-medium rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 text-gold-dark" />
          </div>
          <h2 className="font-serif text-3xl text-luxury-text mb-4">Votre panier est vide</h2>
          <p className="font-sans text-luxury-muted mb-8">
            Découvrez nos magnifiques bijoux et accessoires pour trouver votre bonheur.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-luxury-black text-white px-8 py-3 font-serif uppercase tracking-wider hover:bg-gold hover:text-white transition-all duration-300 shadow-lg"
          >
            <span>Voir les produits</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-light min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="flex justify-between items-center mb-8 border-b border-gold/20 pb-4">
              <h1 className="font-serif text-3xl md:text-4xl text-luxury-text">Mon Panier</h1>
              <button
                onClick={clearCart}
                className="text-sm text-red-400 hover:text-red-600 underline font-sans transition-colors"
              >
                Vider le panier
              </button>
            </div>

            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4 shadow-sm border border-gray-100 flex gap-6 items-center group hover:shadow-md transition-all duration-300">
                  <div className="w-24 h-24 bg-gray-50 flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-sans text-luxury-muted uppercase tracking-wide block mb-1">{item.category}</span>
                        <h3 className="font-serif text-xl text-luxury-black">{item.name}</h3>
                      </div>
                      <p className="font-serif text-lg text-gold-dark">
                        {(item.price * item.quantity).toFixed(2)} DH
                      </p>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center border border-gray-200 rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-luxury-muted" />
                        </button>
                        <span className="w-10 text-center font-sans text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-luxury-muted" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-luxury-muted hover:text-red-500 transition-colors p-2"
                        title="Supprimer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-8 shadow-luxury border border-white/40 sticky top-24">
              <h2 className="font-serif text-2xl text-luxury-text mb-6 pb-4 border-b border-gray-100">Résumé</h2>

              <div className="space-y-4 mb-8 font-sans text-sm">
                <div className="flex justify-between text-luxury-muted">
                  <span>Sous-total</span>
                  <span>{getCartTotal().toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between text-luxury-muted">
                  <span>Livraison</span>
                  <span className="italic">Calculé à l'étape suivante</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-luxury-black pt-4 border-t border-gray-100">
                  <span>Total</span>
                  <span>{getCartTotal().toFixed(2)} DH</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full text-center bg-gold text-white py-4 font-serif uppercase tracking-wider hover:bg-luxury-black transition-colors duration-300 shadow-lg mb-4"
              >
                Passer la commande
              </Link>

              <div className="text-center text-xs text-luxury-muted font-sans">
                <p>Paiement sécurisé à la livraison</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
