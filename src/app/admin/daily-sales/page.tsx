'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface DailySalesData {
  date: string;
  total: number;
  completed: number;
  inProgress: number;
  avgOrderValue: number;
  orderCount: number;
  sourceBreakdown: {
    online: { count: number; total: number };
    boutique: { count: number; total: number };
  };
  orders: Array<{
    id: string;
    total: number;
    status: string;
    source: string;
    createdAt: string;
    items: Array<{ name: string; quantity: number; price: number }>;
  }>;
}

export default function DailySalesPage() {
  const router = useRouter();
  const [data, setData] = useState<DailySalesData | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [showCloseDayModal, setShowCloseDayModal] = useState(false);
  const [closingDay, setClosingDay] = useState(false);
  const [serverTotal, setServerTotal] = useState<number | null>(null);
  const [discrepancy, setDiscrepancy] = useState<number | null>(null);
  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fetchDailySales = useCallback(async (date: string) => {
    try {
      const response = await fetch(`/api/daily-sales?date=${date}`);
      if (response.ok) {
        const salesData = await response.json();
        setData(salesData);
      }
    } catch (error) {
      console.error('Error fetching daily sales:', error);
    }
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/admin');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'manager') {
      router.push('/admin/orders');
      return;
    }
  }, [router]);

  useEffect(() => {
    const fetchWithLoading = async () => {
      if (selectedDate) {
        setLoading(true);
        await fetchDailySales(selectedDate);
        setLoading(false);
      }
    };
    fetchWithLoading();
  }, [selectedDate, fetchDailySales]);

  async function closeDay() {
    setClosingDay(true);
    try {
      const response = await fetch('/api/close-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate }),
      });

      if (response.ok) {
        const result = await response.json();
        setServerTotal(result.serverTotal);
        setDiscrepancy(result.discrepancy);
        setShowCloseDayModal(true);
      }
    } catch (error) {
      console.error('Error closing day:', error);
      alert('Erreur lors de la clôture');
    } finally {
      setClosingDay(false);
    }
  }

  async function exportCSV() {
    if (!data) return;

    const rows = [
      ['ID', 'Date', 'Source', 'Statut', 'Total', 'Articles'].join(','),
      ...data.orders.map((order) => [
        order.id,
        new Date(order.createdAt).toLocaleString('fr-FR'),
        order.source === 'online' ? 'En ligne' : 'Boutique',
        order.status,
        order.total,
        order.items.map((i) => `${i.name} x${i.quantity}`).join(' | '),
      ].join(',')),
    ];

    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventes-${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleLogout() {
    localStorage.removeItem('user');
    router.push('/admin');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center">
        <div>Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <header className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-heading font-bold text-orange-500">Ventes du jour</h1>
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg min-h-[44px]"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <div className="container mx-auto p-4">
        {/* Sélecteur de date */}
        <div className="mb-6">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg min-h-[44px]"
          />
        </div>

        {data && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-900 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-orange-500">{data.total} F</p>
              </motion.div>
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-900 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">Encaissé</p>
                <p className="text-2xl font-bold text-green-500">{data.completed} F</p>
              </motion.div>
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-900 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">En cours</p>
                <p className="text-2xl font-bold text-yellow-500">{data.inProgress} F</p>
              </motion.div>
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-900 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">Panier moyen</p>
                <p className="text-2xl font-bold text-blue-500">{Math.round(data.avgOrderValue)} F</p>
              </motion.div>
            </div>

            {/* Répartition par source */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-900 rounded-lg p-4"
              >
                <h3 className="text-lg font-bold mb-3">En ligne vs Boutique</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">En ligne</span>
                    <span className="font-bold">{data.sourceBreakdown.online.count} commandes ({data.sourceBreakdown.online.total} F)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Boutique</span>
                    <span className="font-bold">{data.sourceBreakdown.boutique.count} commandes ({data.sourceBreakdown.boutique.total} F)</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-900 rounded-lg p-4"
              >
                <h3 className="text-lg font-bold mb-3">Total commandes</h3>
                <p className="text-4xl font-bold text-orange-500">{data.orderCount}</p>
              </motion.div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={closeDay}
                disabled={closingDay}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 px-6 py-3 rounded-lg font-bold min-h-[48px]"
              >
                {closingDay ? 'Clôture en cours...' : 'Clôturer la journée'}
              </button>
              <button
                onClick={exportCSV}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold min-h-[48px]"
              >
                Export CSV
              </button>
            </div>

            {/* Liste des ventes */}
            <div className="bg-gray-900 rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4">Détail des ventes</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-3">ID</th>
                      <th className="text-left p-3">Heure</th>
                      <th className="text-left p-3">Source</th>
                      <th className="text-left p-3">Statut</th>
                      <th className="text-left p-3">Total</th>
                      <th className="text-left p-3">Articles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-800">
                        <td className="p-3 font-mono text-sm">#{order.id.slice(-6)}</td>
                        <td className="p-3 text-sm">
                          {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded ${
                            order.source === 'online' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'
                          }`}>
                            {order.source === 'online' ? 'En ligne' : 'Boutique'}
                          </span>
                        </td>
                        <td className="p-3 text-sm">{order.status}</td>
                        <td className="p-3 font-bold text-orange-500">{order.total} F</td>
                        <td className="p-3 text-sm text-gray-400">
                          {order.items.map((i, idx) => (
                            <span key={idx}>
                              {i.name} x{i.quantity}
                              {idx < order.items.length - 1 && ', '}
                            </span>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de clôture */}
      {showCloseDayModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
            transition={shouldReduceMotion ? {} : { duration: 0.15 }}
            className="bg-gray-900 rounded-lg p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold mb-4">Clôture de journée</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Total caisse locale :</span>
                <span className="font-bold">{data?.total} F</span>
              </div>
              <div className="flex justify-between">
                <span>Total serveur :</span>
                <span className="font-bold">{serverTotal} F</span>
              </div>
              <div className="flex justify-between">
                <span>Écart :</span>
                <span className={`font-bold ${discrepancy === 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {discrepancy} F
                </span>
              </div>
            </div>
            {discrepancy === 0 ? (
              <p className="text-green-500 text-center mb-4">✓ Les totaux correspondent</p>
            ) : (
              <p className="text-red-500 text-center mb-4">⚠ Écart détecté</p>
            )}
            <button
              onClick={() => setShowCloseDayModal(false)}
              className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg min-h-[44px]"
            >
              Fermer
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
