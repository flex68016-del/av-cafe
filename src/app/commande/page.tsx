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
  const [error, setError] = useState('');
  const [fulfillment, setFulfillment] = useState<'DELIVERY' | 'DINE_IN'>('DINE_IN');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total,
          customerName: formData.get('customerName'),
          phone: formData.get('phone'),
          fulfillment: formData.get('fulfillment'),
          deliveryAddress: formData.get('deliveryAddress'),
          deliveryLandmark: formData.get('deliveryLandmark'),
          customerNote: formData.get('customerNote'),
        }),
      });

      const data = await orderResponse.json();

      if (orderResponse.ok) {
        const newOrderNumber = `#${data.id.slice(-4)}`;
        setOrderNumber(newOrderNumber);
        setShowConfirmation(true);
        clearCart();
      } else {
        setError(data.error || 'Erreur lors de la commande');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Erreur de connexion');
    }
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

            <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Informations</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nom *</label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    minLength={2}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 min-h-[44px]"
                    placeholder="Votre nom (minimum 2 lettres)"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    pattern="^\+228\d{8}$|^\d{8}$|^\d{8}\s\d{8}$"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 min-h-[44px]"
                    placeholder="+228 XX XX XX XX"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: +228XXXXXXXX ou 90 00 00 00</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Mode de service *</label>
                  <select
                    name="fulfillment"
                    value={fulfillment}
                    onChange={(e) => setFulfillment(e.target.value as 'DELIVERY' | 'DINE_IN')}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 min-h-[44px]"
                  >
                    <option value="DINE_IN">Sur place</option>
                    <option value="DELIVERY">Livraison</option>
                  </select>
                </div>

                {fulfillment === 'DELIVERY' && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Adresse de livraison *</label>
                      <input
                        type="text"
                        name="deliveryAddress"
                        required
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 min-h-[44px]"
                        placeholder="Votre adresse"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Repère / Quartier (conseillé)</label>
                      <input
                        type="text"
                        name="deliveryLandmark"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 min-h-[44px]"
                        placeholder="Ex: près du marché Lomé"
                      />
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <p className="text-sm text-gray-400">Frais de livraison : <span className="text-orange-500">à confirmer</span></p>
                    </div>
                  </>
                )}



                <div>
                  <label className="block text-sm text-gray-400 mb-2">Note (optionnel, max 200 caractères)</label>
                  <textarea
                    name="customerNote"
                    maxLength={200}
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 min-h-[44px]"
                    placeholder="Instructions spéciales..."
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors min-h-[44px]"
              >
                Valider la commande
              </button>
            </form>
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
              {fulfillment === 'DELIVERY' ? 'Votre commande sera livrée.' : 'Votre commande est prête. Vous pouvez venir la récupérer.'}
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
