'use client';

import { useCart } from '@/contexts/CartContext';
import { SlideSheet } from './motion/SlideSheet';
import { Counter } from './motion/Counter';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
  const { items, total, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  function handleCheckout() {
    onClose();
    router.push('/commande');
  }

  return (
    <SlideSheet isOpen={isOpen} onClose={onClose} position="right">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold">VOTRE PANIER</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Votre panier est vide</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between bg-gray-900 p-4 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-orange-500">{item.price} F</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 min-h-[44px]"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 min-h-[44px]"
                    >
                      +
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-gray-800 pt-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Total</span>
                <span className="text-2xl font-bold text-orange-500">
                  <Counter value={total} suffix=" F" />
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors min-h-[44px]"
              >
                Commander
              </button>
              <button
                onClick={clearCart}
                className="w-full py-3 text-gray-400 hover:text-white transition-colors min-h-[44px]"
              >
                Vider le panier
              </button>
            </div>
          </>
        )}
      </div>
    </SlideSheet>
  );
}
