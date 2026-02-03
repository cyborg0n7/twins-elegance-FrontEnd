import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingBag, Check, ChevronRight } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-cream-light flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="font-serif text-3xl text-luxury-text mb-4">Produit non trouvé</h2>
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 mx-auto text-gold-dark hover:text-luxury-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour aux produits
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="bg-cream-light min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-luxury-muted mb-8 font-sans">
          <Link to="/" className="hover:text-gold-dark transition-colors">Accueil</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-gold-dark transition-colors">Produits</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-luxury-text font-medium">{product.name}</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          {/* Image Section */}
          <div className="w-full md:w-1/2">
            <div className="relative aspect-[4/5] bg-white overflow-hidden shadow-luxury rounded-sm group">
              <div className="absolute inset-0 bg-white/10 group-hover:bg-white/0 transition-colors duration-500"></div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <span className="font-sans text-sm tracking-[0.2em] text-luxury-muted uppercase mb-4 block">
              {product.category}
            </span>

            <h1 className="font-serif text-4xl md:text-5xl text-luxury-black mb-6 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-6 mb-8 border-b border-gold/20 pb-8">
              <span className="font-serif text-3xl text-gold-dark font-medium">
                {product.price.toFixed(2)} DH
              </span>
              {product.inStock ? (
                <span className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                  <Check className="w-4 h-4" /> En stock
                </span>
              ) : (
                <span className="text-red-500 bg-red-50 px-3 py-1 rounded-full text-sm font-medium">
                  De retour bientôt
                </span>
              )}
            </div>

            <p className="font-sans text-lg text-luxury-muted leading-relaxed mb-10">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                className={`flex-1 py-4 px-8 flex items-center justify-center gap-3 font-serif uppercase tracking-wider text-sm transition-all duration-300 shadow-lg ${product.inStock
                    ? 'bg-luxury-black text-white hover:bg-gold hover:translate-y-[-2px]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingBag className="w-5 h-5" />
                {product.inStock ? 'Ajouter au panier' : 'Indisponible'}
              </button>
            </div>

            {/* Additional Info / Attributes placeholder */}
            <div className="grid grid-cols-2 gap-4 text-sm font-sans text-luxury-muted">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gold rounded-full"></span>
                Livraison Gratuite
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gold rounded-full"></span>
                Garantie Authenticité
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gold rounded-full"></span>
                Retour sous 30 jours
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
