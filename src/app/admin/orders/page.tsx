/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface Order {
  id: string;
  total: number;
  status: string;
  source: string;
  customerName: string | null;
  customerPhone: string | null;
  createdAt: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ['preparing'],
  preparing: ['ready'],
  ready: ['completed'],
  completed: [],
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Nouvelles',
  preparing: 'En préparation',
  ready: 'Prêtes',
  completed: 'Terminées',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());
  const [previousOrderIds, setPreviousOrderIds] = useState<Set<string>>(new Set());
  const [isManager, setIsManager] = useState(false);
  const router = useRouter();
  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const playNotificationSound = useCallback(() => {
    if (shouldReduceMotion) return;
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch {
      // Audio non supporté
    }
  }, [shouldReduceMotion]);

  const fetchOrders = useCallback(async () => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      const headers: HeadersInit = {};
      if (user) {
        headers['Authorization'] = `Bearer ${user.email}`;
      }

      const response = await fetch('/api/orders', { headers });
      const data = await response.json();
      
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/admin');
      return;
    }

    const user = JSON.parse(userStr);
    setIsManager(user.role === 'manager');
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [router, fetchOrders]);

  useEffect(() => {
    if (orders.length === 0) return;
    
    const currentIds = new Set(orders.map(order => order.id));
    const newIds = orders.filter(order => !previousOrderIds.has(order.id)).map(order => order.id);
    
    if (newIds.length > 0 && previousOrderIds.size > 0) {
      setNewOrderIds(new Set(newIds));
      playNotificationSound();
      setTimeout(() => setNewOrderIds(new Set()), 3000);
    }
    
    setPreviousOrderIds(currentIds);
  }, [orders, previousOrderIds, playNotificationSound]);

  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (user) {
        headers['Authorization'] = `Bearer ${user.email}`;
      }

      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  }

  function handleLogout() {
    localStorage.removeItem('user');
    router.push('/admin');
  }

  function getOrdersByStatus(status: string) {
    return orders.filter(order => order.status === status);
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <header className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-heading font-bold text-orange-500">Commandes</h1>
            {isManager && (
              <a
                href="/admin/daily-sales"
                className="text-gray-400 hover:text-white min-h-[44px] flex items-center"
              >
                Ventes du jour
              </a>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg min-h-[44px]"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {loading ? (
        <div className="container mx-auto p-8 text-center">Chargement...</div>
      ) : (
        <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.keys(STATUS_LABELS).map((status) => (
            <div key={status} className="bg-gray-900 rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4 text-center">
                {STATUS_LABELS[status]} ({getOrdersByStatus(status).length})
              </h2>
              <div className="space-y-3">
                {getOrdersByStatus(status).map((order) => (
                  <motion.div
                    key={order.id}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                    animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                    transition={shouldReduceMotion ? {} : { duration: 0.15 }}
                    className={`bg-gray-800 rounded-lg p-4 ${
                      newOrderIds.has(order.id) ? 'ring-2 ring-orange-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold">#{order.id.slice(-6)}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.source === 'online' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'
                      }`}>
                        {order.source === 'online' ? 'En ligne' : 'Boutique'}
                      </span>
                    </div>
                    
                    {order.customerName && (
                      <p className="text-sm text-gray-300 mb-2">{order.customerName}</p>
                    )}
                    
                    <div className="text-sm mb-3">
                      {order.items.map((item, idx) => (
                        <p key={idx}>{item.name} x{item.quantity}</p>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-orange-500">{order.total} F</p>
                      {STATUS_TRANSITIONS[status].length > 0 && (
                        <button
                          onClick={() => updateOrderStatus(order.id, STATUS_TRANSITIONS[status][0])}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm min-h-[36px]"
                        >
                          {STATUS_LABELS[STATUS_TRANSITIONS[status][0]]}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
