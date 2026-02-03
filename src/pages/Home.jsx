import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Truck, ShieldCheck, Gem, Gift, Headset, ArrowRight } from 'lucide-react';

const Home = () => {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const statsRef = useRef(null);

  const categoryImages = [
    ...new Set(products.map(p => p.category))
  ].slice(0, 4).map(category => {
    return products.find(p => p.category === category);
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animation
    const tl = gsap.timeline();
    tl.fromTo(heroRef.current,
      { scale: 1.1, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out" }
    )
      .fromTo(textRef.current.children,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" },
        "-=1"
      );

    // Stats Animation
    if (statsRef.current) {
      const statNumbers = statsRef.current.querySelectorAll('.stat-number');
      statNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-target'));

        ScrollTrigger.create({
          trigger: stat,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(stat, {
              innerText: target,
              duration: 2,
              snap: { innerText: 1 },
              ease: "power2.out"
            });
          }
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-cream-light min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 to-transparent z-10"></div>
          <img
            src={products[0]?.image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920"}
            alt="Bijoux élégants"
            className="w-full h-full object-cover"
          />
        </div>

        <div ref={textRef} className="relative z-20 text-center max-w-4xl px-4 mt-20">
          <h1 className="font-serif text-5xl md:text-8xl text-white font-bold mb-6 tracking-tight drop-shadow-lg">
            <span className="block mb-2 text-white/90">Découvrez</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold-accent to-gold-dark italic">
              l'Élégance
            </span>
          </h1>
          <p className="font-sans text-xl md:text-2xl text-cream-medium mb-10 font-light max-w-2xl mx-auto drop-shadow-md">
            Des bijoux et accessoires d'exception pour sublimer votre style
          </p>
          <Link
            to="/products"
            className="group relative inline-flex items-center gap-3 px-10 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-serif uppercase tracking-widest hover:bg-white/20 hover:scale-105 transition-all duration-300"
          >
            <span>Explorer la collection</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 px-4 bg-cream-medium">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl text-luxury-text mb-4">Explorez nos Collections</h2>
            <div className="h-1 w-24 bg-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoryImages.map((product, index) => (
              <Link
                key={product.id || index}
                to="/products"
                className="group relative h-[400px] overflow-hidden shadow-luxury"
              >
                <img
                  src={product.image}
                  alt={product.category}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-transparent to-transparent opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="block font-serif text-2xl text-gold-light mb-2">{product.category}</span>
                  <span className="text-white/80 text-sm font-sans tracking-wide group-hover:text-white transition-colors flex items-center gap-2">
                    Voir la collection <span className="text-lg">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-center text-luxury-text mb-16">Pourquoi Nous Choisir</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: <Sparkles className="w-10 h-10 text-gold" />, title: 'Qualité Premium', text: 'Bijoux sélectionnés avec soin pour leur excellence' },
              { icon: <Truck className="w-10 h-10 text-gold" />, title: 'Livraison Rapide', text: 'Expédition sous 24-48h partout au Maroc' },
              { icon: <ShieldCheck className="w-10 h-10 text-gold" />, title: 'Paiement Sécurisé', text: 'Transactions 100% sécurisées et protégées' },
              { icon: <Gem className="w-10 h-10 text-gold" />, title: 'Garantie Qualité', text: 'Garantie satisfait ou remboursé sur tous nos produits' },
              { icon: <Gift className="w-10 h-10 text-gold" />, title: 'Emballage Cadeau', text: 'Emballage élégant offert pour vos cadeaux' },
              { icon: <Headset className="w-10 h-10 text-gold" />, title: 'Service Client', text: 'Support client disponible 7j/7 pour vous aider' }
            ].map((benefit, i) => (
              <div key={i} className="p-8 border border-cream-dark hover:border-gold/30 hover:shadow-luxury transition-all duration-300 group bg-cream-light/30">
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300 inline-block p-4 bg-white rounded-full shadow-sm">
                  {benefit.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-luxury-text mb-3">{benefit.title}</h3>
                <p className="font-sans text-luxury-muted leading-relaxed">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-24 bg-luxury-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { target: 5000, label: 'Clients Satisfaits' },
              { target: 24, label: 'Produits Uniques' },
              { target: 98, label: '% Satisfaction' }
            ].map((stat, i) => (
              <div key={i} className="p-8 border border-white/10 backdrop-blur-sm">
                <div className="font-serif text-5xl md:text-6xl text-gold mb-2 stat-number" data-target={stat.target}>0</div>
                <div className="font-sans text-white/70 uppercase tracking-wider text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="py-24 bg-cream-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-gold/30 z-0"></div>
              <img
                src={products[2]?.image || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800"}
                alt="Inspiration bijoux"
                className="relative z-10 w-full shadow-lg"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-6 md:pl-10">
              <h2 className="font-serif text-4xl md:text-5xl text-luxury-text leading-tight">L'Art de la <br /><span className="text-gold-dark italic">Joaillerie</span></h2>
              <p className="font-sans text-lg text-luxury-muted leading-relaxed">
                Chaque pièce de notre collection est soigneusement sélectionnée pour allier
                qualité exceptionnelle et design intemporel. Découvrez des bijoux qui
                racontent votre histoire.
              </p>
              <Link to="/products" className="inline-block mt-4 text-luxury-text hover:text-gold-dark font-serif text-lg font-bold border-b border-luxury-text hover:border-gold-dark pb-1 transition-all">
                Découvrir notre histoire
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

