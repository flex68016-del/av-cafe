'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MotionSection } from '@/components/MotionSection';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
}

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tout');
  const [loading, setLoading] = useState(true);

  const categories = ['Tout', 'Boissons', 'Salé', 'Sucré'];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Erreur lors du chargement du menu:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'Tout'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-4">
          NOTRE MENU
        </h1>
        <p className="text-orange-500 text-center mb-8">
          Supplément perles de tapioca : +300 F
        </p>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full min-h-[44px] transition-colors ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Chargement du menu...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Aucun produit disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <MotionSection key={product.id}>
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-600">[PHOTO]</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                    {product.description && (
                      <p className="text-gray-400 text-sm mb-2">{product.description}</p>
                    )}
                    <p className="text-orange-500 font-bold">{product.price} F</p>
                  </div>
                </div>
              </MotionSection>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
