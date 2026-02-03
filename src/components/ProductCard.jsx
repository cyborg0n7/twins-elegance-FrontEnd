import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="group bg-white border border-gray-100 p-2 hover:shadow-luxury transition-all duration-300 relative">
      <Link to={`/products/${product.id}`} className="block overflow-hidden relative">
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {!product.inStock && (
            <div className="absolute top-4 left-4 bg-luxury-black text-white text-xs font-serif px-3 py-1 uppercase tracking-widest z-20">
              Rupture
            </div>
          )}

          {/* Quick Actions */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 px-4">
            <button
              className="flex-1 bg-white text-luxury-black py-2.5 px-3 flex items-center justify-center gap-2 hover:bg-gold hover:text-white transition-colors duration-300 font-sans text-xs uppercase tracking-wide border border-gray-100 shadow-lg"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingBag className="w-4 h-4" />
              {product.inStock ? 'Ajouter' : 'Epuisé'}
            </button>
            <div className="w-10 h-10 bg-white flex items-center justify-center hover:bg-gold hover:text-white transition-colors duration-300 shadow-lg cursor-pointer">
              <Eye className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="pt-4 pb-2 text-center">
          <p className="text-xs font-sans text-luxury-muted uppercase tracking-widest mb-1">{product.category}</p>
          <h3 className="font-serif text-lg text-luxury-black group-hover:text-gold-dark transition-colors duration-300 mb-2 truncate">
            {product.name}
          </h3>
          <p className="font-serif text-gold-dark font-medium text-lg">
            {product.price.toFixed(2)} DH
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
