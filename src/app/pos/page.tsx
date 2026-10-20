/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { CartItem } from '@/lib/db';
import { recordSale, getPendingSalesCount, syncPendingSales, cacheProducts, getCachedProducts, isProductsCacheFresh } from '@/lib/offline';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string | null;
  image: string | null;
  available: boolean;
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'mobile' | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Charger les produits (avec cache hors ligne)
  useEffect(() => {
    let mounted = true;
    
    async function loadProducts() {
      // D'abord essayer le cache
      const cached = await getCachedProducts();
      if (cached.length > 0 && await isProductsCacheFresh()) {
        if (mounted) {
          setProducts(cached.filter((p) => p.available));
        }
      }
      
      // Puis essayer l'API si on est en ligne
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          if (mounted) {
            setProducts(data.filter((p: Product) => p.available));
            // Mettre à jour le cache
            await cacheProducts(data);
          }
        }
      } catch (error) {
        console.error('Erreur chargement produits:', error);
        // On garde les produits du cache s'ils existent
      }
    }
    
    loadProducts();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Surveiller la connexion
  useEffect(() => {
    const updateConnection = () => {
      const online = navigator.onLine;
      setIsConnected(online);
      
      if (online) {
        syncPendingSales();
      }
    };

    updateConnection();
    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);

    const interval = setInterval(async () => {
      const count = await getPendingSalesCount();
      setPendingCount(count);
    }, 2000);

    return () => {
      window.removeEventListener('online', updateConnection);
      window.removeEventListener('offline', updateConnection);
      clearInterval(interval);
    };
  }, []);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          addedAt: new Date(),
        },
      ];
    });

    // Feedback visuel très bref
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 100);
  }

  function removeFromCart(productId: string) {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter((item) => item.productId !== productId);
    });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function completeSale() {
    if (cart.length === 0 || !paymentMode) return;

    try {
      await recordSale(cart, total);
      setCart([]);
      setPaymentMode(null);
      
      // Mettre à jour le compteur
      const count = await getPendingSalesCount();
      setPendingCount(count);
    } catch (error) {
      console.error('Erreur enregistrement vente:', error);
      alert('Erreur lors de l\'enregistrement de la vente');
    }
  }

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      {/* Header avec indicateur de connexion */}
      <header className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-heading font-bold text-orange-500">Caisse</h1>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              isConnected ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              {isConnected ? 'En ligne' : 'Hors ligne'}
            </div>
            {pendingCount > 0 && (
              <div className="bg-orange-900 text-orange-300 px-3 py-1 rounded-full text-sm">
                {pendingCount} vente{pendingCount > 1 ? 's' : ''} en attente
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Grille de produits */}
        <div className="lg:col-span-2">
          {categories.map((category) => (
            <div key={category} className="mb-6">
              <h2 className="text-xl font-bold mb-3 text-orange-500">{category}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {products
                  .filter((p) => p.category === category)
                  .map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className={`bg-gray-800 p-4 rounded-lg text-left transition-colors overflow-hidden ${
                        showFeedback ? 'bg-orange-600' : 'hover:bg-gray-700'
                      }`}
                    >
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                      )}
                      <p className="font-bold">{product.name}</p>
                      <p className="text-orange-500 font-bold">{product.price} F</p>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Ticket de caisse */}
        <div className="bg-gray-900 rounded-lg p-4 h-fit sticky top-4">
          <h2 className="text-xl font-bold mb-4">Ticket</h2>
          
          {cart.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Panier vide</p>
          ) : (
            <>
              <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-400">{item.price} F x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-orange-500">{item.price * item.quantity} F</p>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-sm min-h-[36px]"
                      >
                        -
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4 mb-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span className="text-orange-500">{total} F</span>
                </div>
              </div>

              {!paymentMode ? (
                <div className="space-y-2">
                  <button
                    onClick={() => setPaymentMode('cash')}
                    className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold min-h-[48px]"
                  >
                    Espèces
                  </button>
                  <button
                    onClick={() => setPaymentMode('mobile')}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold min-h-[48px]"
                  >
                    Mobile Money
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-center text-gray-400 mb-2">
                    Paiement : {paymentMode === 'cash' ? 'Espèces' : 'Mobile Money'}
                  </p>
                  <button
                    onClick={completeSale}
                    className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-bold min-h-[48px]"
                  >
                    Valider la vente
                  </button>
                  <button
                    onClick={() => setPaymentMode(null)}
                    className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg min-h-[44px]"
                  >
                    Annuler
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
