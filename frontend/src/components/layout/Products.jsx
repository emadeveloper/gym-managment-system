import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const Products = () => {
  const [sectionRef, isVisible] = useScrollReveal({ threshold: 0.1 });

  const products = [
    // Supplements
    {
      id: 1,
      name: 'Whey Protein Xtrenght',
      category: 'Suplementos',
      price: '$15.999',
      description: 'Proteína de suero de alta calidad, 2kg. Sabor chocolate y vainilla disponible.',
      image: '',
      badge: 'Más Vendido',
    },
    {
      id: 2,
      name: 'Creatina Monohidrato',
      category: 'Suplementos',
      price: '$8.999',
      description: 'Creatina pura en polvo, 500g. Aumenta fuerza y masa muscular.',
      image: '',
    },
    {
      id: 3,
      name: 'BCAA Premium',
      category: 'Suplementos',
      price: '$12.999',
      description: 'Aminoácidos de cadena ramificada. Recuperación y crecimiento muscular.',
      image: '',
    },
    {
      id: 4,
      name: 'Pre-Entrenamiento',
      category: 'Suplementos',
      price: '$9.999',
      description: 'Energía y enfoque para tus entrenamientos más intensos.',
      image: '',
    },
    // Clothing
    {
      id: 5,
      name: 'Gorra La Resistencia',
      category: 'Ropa',
      price: '$7.999',
      description: 'Gorra premium con logo bordado La Resistencia. Varios colores disponibles.',
      image: '',
      badge: 'Nuevo',
    },
    {
      id: 6,
      name: 'Calzas Deportivas',
      category: 'Ropa',
      price: '$6.999',
      description: 'Shorts cómodos y transpirables. Perfectos para entrenar.',
      image: '',
    },
    {
      id: 7,
      name: 'Hoodie La Resistencia',
      category: 'Ropa',
      price: '$18.999',
      description: 'Buzo con capucha, algodón premium. Abrigado y cómodo.',
      image: '',
    },
    {
      id: 8,
      name: 'Leggings Deportivos',
      category: 'Ropa',
      price: '$9.999',
      description: 'Leggings de alta calidad, ajuste perfecto para entrenar.',
      image: '',
    },
    // Accessories
    {
      id: 9,
      name: 'Botella La Resistencia',
      category: 'Accesorios',
      price: '$4.999',
      description: 'Botella de acero inoxidable, 750ml. Mantiene la temperatura.',
      image: '',
    },
    {
      id: 10,
      name: 'Toalla Deportiva',
      category: 'Accesorios',
      price: '$3.999',
      description: 'Toalla de microfibra, rápida absorción. Logo bordado.',
      image: '',
    },
    {
      id: 11,
      name: 'Mochila Deportiva',
      category: 'Accesorios',
      price: '$14.999',
      description: 'Mochila espaciosa con compartimentos para todo tu equipo.',
      image: '',
    },
    {
      id: 12,
      name: 'Guantes de Gimnasio',
      category: 'Accesorios',
      price: '$5.999',
      description: 'Guantes con protección en palmas. Varios tamaños.',
      image: '',
    },
  ];

  const categories = ['Suplementos', 'Ropa', 'Accesorios', 'Todos'];

  const [selectedCategory, setSelectedCategory] = useState('Suplementos');
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 6; // Show 6 products (2 rows on desktop)

  const filteredProducts =
    selectedCategory === 'Todos'
      ? products
      : products.filter((product) => product.category === selectedCategory);

  // Paginate products for slider
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = currentPage * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const displayedProducts = filteredProducts.slice(startIndex, endIndex);

  const goToNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Reset to first page when category changes
  React.useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory]);

  return (
    <section 
      id="products" 
      ref={sectionRef}
      className={`bg-black py-20 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 uppercase tracking-wide">
            Nuestros Productos
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mt-6">
            Equipate con los mejores productos para complementar tu entrenamiento. 
            Suplementos de calidad, ropa deportiva y accesorios con marca La Resistencia.
          </p>
        </div>

        {/* Category Filter */}
        <div className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-lg shadow-primary/50'
                  : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid with Slider */}
        <div className="relative">
          {/* Navigation Arrows */}
          {filteredProducts.length > productsPerPage && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 bg-primary/80 hover:bg-primary text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hidden lg:block"
                aria-label="Previous products"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 bg-primary/80 hover:bg-primary text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hidden lg:block"
                aria-label="Next products"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {displayedProducts.map((product) => (
              <Link
                key={product.id}
                to="/register"
                className="bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 group block cursor-pointer"
              >
              {/* Product Image */}
              <div className="relative h-64 bg-linear-to-br from-gray-800 to-gray-900 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        className="w-24 h-24 text-gray-600 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-gray-500 text-sm">Imagen del producto</p>
                    </div>
                  </div>
                )}
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {product.badge}
                    </span>
                  </div>
                )}
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      {product.price}
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    className="px-4 py-2 text-sm font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = '/register';
                    }}
                  >
                    Comprar
                  </Button>
                </div>
              </div>
              </Link>
            ))}
          </div>

          {/* Slider Dots */}
          {filteredProducts.length > productsPerPage && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentPage
                      ? 'w-12 h-3 bg-primary'
                      : 'w-3 h-3 bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Show All Products Button */}
          {filteredProducts.length > productsPerPage && (
            <div className="text-center mt-8">
              <Link to="/register">
                <Button variant="secondary" className="px-8 py-3">
                  Ver Todos los Productos
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-lg mb-4">
            ¿Querés ver todos nuestros productos?
          </p>
          <Link to="/register">
            <Button variant="secondary" className="px-8 py-3">
              Registrate para Comprar
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products;

