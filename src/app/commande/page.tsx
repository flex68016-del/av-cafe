'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { SlideSheet } from '@/components/motion/SlideSheet';
import { CheckAnimation } from '@/components/motion/CheckAnimation';
import { Counter } from '@/components/motion/Counter';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CommandePage() {
  const { items, total, clearCart } = useCart();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const router = useRouter();

  async function handleSubmit() {
    const newOrderNumber = `#${Date.now().toString().slice(-6)}`;
    setOrderNumber(newOrderNumber);
    setShowConfirmation(true);
    clearCart();
  }

  function handleClose() {
    setShowConfirmation(false);
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-heading font-bold text-center mb-8">COMMANDE</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">Votre panier est vide</p>
            <button
              onClick={() => router.push('/menu')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors min-h-[44px]"
            >
              Voir le menu
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="text-orange-500">{item.price * item.quantity} F</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-800 pt-4 flex justify-between items-center">
                <span className="text-xl font-bold">Total</span>
                <span className="text-2xl font-bold text-orange-500">
                  <Counter value={total} suffix=" F" />
                </span>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Informations</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nom</label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 min-h-[44px]"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 min-h-[44px]"
                    placeholder="Votre numéro"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Type de commande</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 min-h-[44px]">
                    <option>Retrait sur place</option>
                    <option>Livraison (bientôt disponible)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors min-h-[44px]"
            >
              Valider la commande
            </button>
          </>
        )}
      </div>

      <SlideSheet isOpen={showConfirmation} onClose={handleClose} position="bottom">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckAnimation size={80} />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-heading font-bold mb-2">Commande confirmée !</h2>
            <p className="text-orange-500 text-xl font-bold mb-4">{orderNumber}</p>
            <p className="text-gray-400 mb-6">
              Votre commande est prête. Vous pouvez venir la récupérer.
            </p>
            <button
              onClick={handleClose}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors min-h-[44px]"
            >
              Retour à l&apos;accueil
            </button>
          </motion.div>
        </div>
      </SlideSheet>
    </div>
  );
}
