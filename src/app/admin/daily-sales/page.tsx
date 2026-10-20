'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface DailySalesData {
  date: string;
  period: string;
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
  const [dayData, setDayData] = useState<DailySalesData | null>(null);
  const [monthData, setMonthData] = useState<DailySalesData | null>(null);
  const [yearData, setYearData] = useState<DailySalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCloseDayModal, setShowCloseDayModal] = useState(false);
  const [closingDay, setClosingDay] = useState(false);
  const [serverTotal, setServerTotal] = useState<number | null>(null);
  const [discrepancy, setDiscrepancy] = useState<number | null>(null);
  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fetchDailySales = useCallback(async (date: string, period: string) => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const headers: HeadersInit = {};
      if (user) {
        headers['Authorization'] = `Bearer ${user.email}`;
      }

      const response = await fetch(`/api/daily-sales?date=${date}&period=${period}`, { headers });
      if (response.ok) {
        const salesData = await response.json();
        return salesData;
      }
    } catch (error) {
      console.error('Error fetching daily sales:', error);
    }
    return null;
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
    const fetchAllPeriods = async () => {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const currentMonth = today.slice(0, 7);
      const currentYear = today.slice(0, 4);

      const [day, month, year] = await Promise.all([
        fetchDailySales(today, 'day'),
        fetchDailySales(currentMonth, 'month'),
        fetchDailySales(currentYear, 'year'),
      ]);

      setDayData(day);
      setMonthData(month);
      setYearData(year);
      setLoading(false);
    };
    fetchAllPeriods();
  }, [fetchDailySales]);

  async function closeDay() {
    setClosingDay(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (user) {
        headers['Authorization'] = `Bearer ${user.email}`;
      }

      const today = new Date().toISOString().split('T')[0];
      const response = await fetch('/api/close-day', {
        method: 'POST',
        headers,
        body: JSON.stringify({ date: today }),
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

  async function exportCSV(data: DailySalesData) {
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
    a.download = `ventes-${data.date}-${data.period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-heading font-bold text-orange-500 mb-4">Ventes</h1>

      {/* Affichage jour/mois/année en parallèle */}
      <div className="space-y-6">
        {/* KPIs du jour */}
        {dayData && (
          <div className="bg-gray-900 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-orange-500">Aujourd&apos;hui</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-800 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-orange-500">{dayData.total} F</p>
              </motion.div>
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-800 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">Encaissé</p>
                <p className="text-2xl font-bold text-green-500">{dayData.completed} F</p>
              </motion.div>
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-800 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">En cours</p>
                <p className="text-2xl font-bold text-yellow-500">{dayData.inProgress} F</p>
              </motion.div>
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-800 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">Panier moyen</p>
                <p className="text-2xl font-bold text-blue-500">{Math.round(dayData.avgOrderValue)} F</p>
              </motion.div>
            </div>

            {/* Répartition par source */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-800 rounded-lg p-4"
              >
              <h3 className="text-lg font-bold mb-3">En ligne vs Boutique</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">En ligne</span>
                  <span className="font-bold">{dayData.sourceBreakdown.online.count} commandes ({dayData.sourceBreakdown.online.total} F)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Boutique</span>
                  <span className="font-bold">{dayData.sourceBreakdown.boutique.count} commandes ({dayData.sourceBreakdown.boutique.total} F)</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? {} : { duration: 0.15 }}
              className="bg-gray-800 rounded-lg p-4"
            >
              <h3 className="text-lg font-bold mb-3">Total commandes</h3>
              <p className="text-4xl font-bold text-orange-500">{dayData.orderCount}</p>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={closeDay}
              disabled={closingDay}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 px-6 py-3 rounded-lg font-bold min-h-[48px]"
            >
              {closingDay ? 'Clôture en cours...' : 'Clôturer la journée'}
            </button>
            <button
              onClick={() => exportCSV(dayData)}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold min-h-[48px]"
            >
              Export CSV
            </button>
          </div>
        </div>
        )}

        {/* KPIs du mois */}
        {monthData && (
          <div className="bg-gray-900 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-orange-500">Ce mois</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-800 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-orange-500">{monthData.total} F</p>
              </motion.div>
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-800 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">Encaissé</p>
                <p className="text-2xl font-bold text-green-500">{monthData.completed} F</p>
              </motion.div>
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-800 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">En cours</p>
                <p className="text-2xl font-bold text-yellow-500">{monthData.inProgress} F</p>
              </motion.div>
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-800 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">Panier moyen</p>
                <p className="text-2xl font-bold text-blue-500">{Math.round(monthData.avgOrderValue)} F</p>
              </motion.div>
            </div>

            {/* Répartition par source */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-800 rounded-lg p-4"
              >
                <h3 className="text-lg font-bold mb-3">En ligne vs Boutique</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">En ligne</span>
                    <span className="font-bold">{monthData.sourceBreakdown.online.count} commandes ({monthData.sourceBreakdown.online.total} F)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Boutique</span>
                    <span className="font-bold">{monthData.sourceBreakdown.boutique.count} commandes ({monthData.sourceBreakdown.boutique.total} F)</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-800 rounded-lg p-4"
              >
                <h3 className="text-lg font-bold mb-3">Total commandes</h3>
                <p className="text-4xl font-bold text-orange-500">{monthData.orderCount}</p>
              </motion.div>
            </div>

            <button
              onClick={() => exportCSV(monthData)}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold min-h-[48px]"
            >
              Export CSV
            </button>
          </div>
        )}

        {/* KPIs de l'année */}
        {yearData && (
          <div className="bg-gray-900 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-orange-500">Cette année</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-800 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-2xl font-bold text-orange-500">{yearData.total} F</p>
              </motion.div>
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-800 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">Encaissé</p>
                <p className="text-2xl font-bold text-green-500">{yearData.completed} F</p>
              </motion.div>
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-800 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">En cours</p>
                <p className="text-2xl font-bold text-yellow-500">{yearData.inProgress} F</p>
              </motion.div>
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-800 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">Panier moyen</p>
                <p className="text-2xl font-bold text-blue-500">{Math.round(yearData.avgOrderValue)} F</p>
              </motion.div>
            </div>

            {/* Répartition par source */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-800 rounded-lg p-4"
              >
                <h3 className="text-lg font-bold mb-3">En ligne vs Boutique</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">En ligne</span>
                    <span className="font-bold">{yearData.sourceBreakdown.online.count} commandes ({yearData.sourceBreakdown.online.total} F)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Boutique</span>
                    <span className="font-bold">{yearData.sourceBreakdown.boutique.count} commandes ({yearData.sourceBreakdown.boutique.total} F)</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                className="bg-gray-800 rounded-lg p-4"
              >
                <h3 className="text-lg font-bold mb-3">Total commandes</h3>
                <p className="text-4xl font-bold text-orange-500">{yearData.orderCount}</p>
              </motion.div>
            </div>

            <button
              onClick={() => exportCSV(yearData)}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold min-h-[48px]"
            >
              Export CSV
            </button>
          </div>
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
                <span className="font-bold">{dayData?.total} F</span>
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
