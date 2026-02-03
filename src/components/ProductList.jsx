import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard';
import { Search } from 'lucide-react';

const ProductList = () => {
  const { products, categories } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'Tous' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-cream-light min-h-screen pt-24 pb-20">
      {/* Header / Hero for Shop */}
      <div className="bg-cream-medium/50 py-16 mb-12 border-b border-white/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-luxury-text mb-4">Notre Collection</h1>
          <p className="font-sans text-luxury-muted text-lg max-w-2xl mx-auto">
            Explorez notre sélection exclusive de bijoux raffinés, conçus pour l'élégance quotidienne.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Filters & Search */}
        <div className="flex flex-col items-center gap-10 mb-16">

          {/* Search Bar - Moved to top for better hierarchy */}
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Rechercher une pièce..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-gold/50 focus:border-gold focus:ring-1 focus:ring-gold/30 outline-none rounded-sm font-sans text-base transition-all shadow-luxury hover:shadow-lg"
            />
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-luxury-muted w-5 h-5" />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full font-serif text-sm transition-all duration-300 leading-none ${selectedCategory === category
                  ? 'bg-gold text-white shadow-md transform scale-105'
                  : 'bg-white text-luxury-secondary hover:bg-gold/10 hover:text-gold-dark border border-transparent hover:border-gold/20'
                  }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="font-serif text-2xl text-luxury-muted">Aucun produit ne correspond à votre recherche.</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('Tous'); }}
                className="mt-4 text-gold-dark hover:underline font-sans"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
