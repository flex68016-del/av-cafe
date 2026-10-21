'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ORDER_CONFIG } from '@/lib/config';

interface Order {
  id: string;
  total: number;
  status: string;
  source: string;
  customerName: string | null;
  phone: string | null;
  fulfillment: string;
  deliveryAddress: string | null;
  deliveryLandmark: string | null;
  deliveryFee: number | null;
  customerNote: string | null;
  cancelReason: string | null;
  createdAt: string;
  acceptedAt: string | null;
  readyAt: string | null;
  doneAt: string | null;
  cancelledAt: string | null;
  items: Array<{ name: string; quantity: number; price: number }>;
  events: Array<{ type: string; note: string | null; createdAt: string; userId: string | null }>;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Reçue',
  preparing: 'En préparation',
  ready: 'Prête',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'var(--color-status-received)',
  preparing: 'var(--color-status-preparing)',
  ready: 'var(--color-status-ready)',
  completed: 'var(--color-status-completed)',
  cancelled: 'var(--color-status-error)',
};

const FULFILLMENT_LABELS: Record<string, string> = {
  DELIVERY: 'Livraison',
  DINE_IN: 'Sur place',
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [previousOrderIds, setPreviousOrderIds] = useState<Set<string>>(new Set());
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<string>('all');
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const playNotificationSound = useCallback(() => {
    if (!soundEnabled || shouldReduceMotion) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const audioContext = audioContextRef.current;
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
  }, [soundEnabled, shouldReduceMotion]);

  const fetchOrders = useCallback(async () => {
    try {
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
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

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!userStr) {
      router.push('/admin');
      return;
    }

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [fetchOrders, router]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (orders.length === 0) return;

    const currentIds = new Set(orders.map(order => order.id));
    const newIds = orders.filter(order => !previousOrderIds.has(order.id)).map(order => order.id);

    if (newIds.length > 0 && previousOrderIds.size > 0) {
      playNotificationSound();
      
      const pendingCount = orders.filter(o => o.status === 'pending').length;
      document.title = `(${pendingCount}) Avenue Café`;

      setTimeout(() => {
        setNewOrderIds(new Set(newIds));
        setTimeout(() => setNewOrderIds(new Set()), 200);
      }, 0);
    }

    setPreviousOrderIds(currentIds);
  }, [orders, previousOrderIds, playNotificationSound]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Sélectionner automatiquement la commande Reçue la plus ancienne au premier chargement
  useEffect(() => {
    if (!loading && orders.length > 0 && !selectedOrder) {
      const oldestPending = orders
        .filter(o => o.status === 'pending')
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];
      
      if (oldestPending) {
        setTimeout(() => setSelectedOrder(oldestPending), 0);
      } else {
        // Sinon la plus récente
        const mostRecent = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        setTimeout(() => setSelectedOrder(mostRecent), 0);
      }
    }
  }, [loading, orders, selectedOrder]);

  function getOrdersByStatus(status: string): Order[] {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  }

  function getFilteredOrders(): Order[] {
    let filtered = orders;
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }
    
    if (filterMode !== 'all') {
      filtered = filtered.filter(order => order.fulfillment === filterMode);
    }

    // Filtrer pour n'afficher que les commandes d'aujourd'hui
    const today = new Date().toDateString();
    filtered = filtered.filter(order => new Date(order.createdAt).toDateString() === today);

    // Trier : Reçues d'abord (plus ancienne à plus récente), puis les autres
    return filtered.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      if (a.status === 'pending' && b.status === 'pending') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  function getPendingCount(): number {
    const today = new Date().toDateString();
    return orders.filter(o => o.status === 'pending' && new Date(o.createdAt).toDateString() === today).length;
  }

  function getLastOrder(): Order | null {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    if (todayOrders.length === 0) return null;
    return todayOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }

  function getOrderNumber(id: string): string {
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return '????';
    return `#${String(index + 1).padStart(4, '0')}`;
  }

  const getOrderAge = useCallback((order: Order): string => {
    const diff = Date.now() - new Date(order.createdAt).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'il y a moins de 1 min';
    if (minutes < 60) return `il y a ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `il y a ${hours} h`;
    return `il y a ${Math.floor(hours / 24)} j`;
  }, []);

  const isOrderOld = useCallback((order: Order): boolean => {
    const diff = Date.now() - new Date(order.createdAt).getTime();
    return diff > ORDER_CONFIG.OLD_ORDER_THRESHOLD_MINUTES * 60 * 1000;
  }, []);

  function getOldestPendingOrder(): Order | null {
    const pending = orders.filter(o => o.status === 'pending');
    if (pending.length === 0) return null;
    return pending.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())[0];
  }

  function handleOrderClick(order: Order) {
    setSelectedOrder(order);
    setIsMobileDetailOpen(true);
  }

  function handleOldestOrder() {
    const oldest = getOldestPendingOrder();
    if (oldest) {
      setSelectedOrder(oldest);
      setIsMobileDetailOpen(true);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
      setIsUpdating(true);
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
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
        await fetchOrders();
        if (selectedOrder?.id === orderId) {
          const updated = orders.find(o => o.id === orderId);
          if (updated) setSelectedOrder(updated);
        }
      } else if (response.status === 409) {
        setError('Conflit : un autre employé a modifié cette commande. Actualisation en cours...');
        setTimeout(() => {
          setError('');
          fetchOrders();
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Erreur serveur');
    } finally {
      setIsUpdating(false);
    }
  }

  async function cancelOrder(orderId: string) {
    if (!cancelReason.trim()) {
      setError('Le motif d\'annulation est obligatoire');
      return;
    }

    try {
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const user = userStr ? JSON.parse(userStr) : null;

      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (user) {
        headers['Authorization'] = `Bearer ${user.email}`;
      }

      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ reason: cancelReason }),
      });

      if (response.ok) {
        setShowCancelModal(false);
        setCancelReason('');
        setSelectedOrder(null);
        fetchOrders();
      } else {
        const data = await response.json();
        setError(data.error || 'Erreur lors de l\'annulation');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError('Erreur serveur');
    }
  }

  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;
  const isManager = user?.role === 'manager';

  const filteredOrders = getFilteredOrders();
  const pendingCount = getPendingCount();
  const lastOrder = getLastOrder();
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-bg-page text-text-primary">
      {/* Bannière orange */}
      {pendingCount > 0 ? (
        <div className="bg-orange text-orange-text rounded-[14px] px-[18px] py-[14px] mb-[22px]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-[18px] font-bold text-heading">
                {pendingCount} commande{pendingCount !== 1 ? 's' : ''} à traiter
              </h1>
              {lastOrder && (
                <div className="text-[14px] opacity-90">
                  <span className="font-bold">{getOrderNumber(lastOrder.id)}</span>
                  {' · '}
                  {FULFILLMENT_LABELS[lastOrder.fulfillment]}
                  {' · '}
                  {lastOrder.total.toLocaleString('fr-FR')} F
                  {' · '}
                  {getOrderAge(lastOrder)}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="bg-bg-page text-text-primary px-5 py-[11px] rounded-[999px] text-sm font-bold min-h-[44px] transition-colors hover:opacity-90"
                aria-label={soundEnabled ? 'Désactiver le son' : 'Activer le son'}
              >
                {soundEnabled ? 'Son activé' : 'Son désactivé'}
              </button>
              <button
                onClick={handleOldestOrder}
                disabled={!getOldestPendingOrder()}
                className="bg-white text-orange-text px-5 py-[11px] rounded-[999px] text-sm font-bold min-h-[44px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              >
                Traiter la plus ancienne
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-bg-card text-text-tertiary rounded-[14px] px-[18px] py-[14px] mb-[22px]">
          Aucune commande à traiter
        </div>
      )}

      {/* Titre et date */}
      <div className="flex items-end justify-between mb-[14px]">
        <h2 className="text-[44px] font-bold text-heading uppercase leading-none">COMMANDES</h2>
        <span className="text-text-tertiary">{today}</span>
      </div>

      {/* Filtres rangée 1 */}
      <div className="flex flex-wrap gap-[8px] mb-[10px]">
        {[
          { value: 'all', label: 'Toutes' },
          { value: 'pending', label: 'Reçues' },
          { value: 'preparing', label: 'En préparation' },
          { value: 'ready', label: 'Prêtes' },
          { value: 'completed', label: 'Terminées' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilterStatus(value)}
            className={`px-4 py-[9px] rounded-[999px] text-[14px] font-bold min-h-[44px] border-2 transition-colors ${
              filterStatus === value
                ? 'bg-orange text-orange-text border-orange'
                : 'bg-transparent text-text-primary border-border-secondary hover:border-text-secondary'
            }`}
          >
            {label} ({getOrdersByStatus(value).length})
          </button>
        ))}
      </div>

      {/* Filtres rangée 2 */}
      <div className="flex flex-wrap gap-[8px] mb-[22px]">
        {[
          { value: 'all', label: 'Tous les modes' },
          { value: 'DELIVERY', label: 'Livraison' },
          { value: 'DINE_IN', label: 'Sur place' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilterMode(value)}
            className={`px-4 py-[9px] rounded-[999px] text-[14px] font-bold min-h-[44px] border-2 transition-colors ${
              filterMode === value
                ? 'bg-orange text-orange-text border-orange'
                : 'bg-transparent text-text-primary border-border-secondary hover:border-text-secondary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Contenu principal */}
      <div className="flex gap-[22px] items-start">
        {/* File de commandes */}
        <div className={`flex-1 min-w-[360px] ${isMobileDetailOpen ? 'hidden' : 'block'}`}>
          {loading ? (
            <div className="space-y-[10px]">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-bg-card rounded-[14px] p-[14px] px-[16px] h-[88px]" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-text-tertiary">Aucune commande aujourd&apos;hui</div>
          ) : (
            <div className="space-y-[10px]" role="list" aria-label="Liste des commandes">
              {filteredOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => handleOrderClick(order)}
                  className={`w-full text-left bg-bg-card rounded-[14px] p-[14px] px-[16px] border-1 border-border transition-colors hover:bg-bg-subcard focus:outline-none focus-visible:ring-2 focus-visible:ring-orange ${
                    selectedOrder?.id === order.id ? 'bg-bg-selected border-orange' : ''
                  } ${newOrderIds.has(order.id) ? 'animate-pulse' : ''}`}
                  style={{ borderLeftWidth: '6px', borderLeftColor: STATUS_COLORS[order.status] }}
                  role="listitem"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Bloc gauche : numéro et statut */}
                    <div className="w-16">
                      <div className="text-[18px] font-bold">{getOrderNumber(order.id)}</div>
                      <div className="text-[12px] font-bold" style={{ color: STATUS_COLORS[order.status] }}>
                        {STATUS_LABELS[order.status]}
                      </div>
                    </div>

                    {/* Bloc central : nom et mode */}
                    <div className="flex-1">
                      {order.customerName && (
                        <p className="text-[16px] font-bold">{order.customerName}</p>
                      )}
                      <span className={`text-[12px] font-bold px-[10px] py-[3px] rounded-[999px] ${
                        order.fulfillment === 'DELIVERY'
                          ? 'border border-orange text-orange'
                          : 'bg-bg-subcard text-text-primary'
                      }`}>
                        {FULFILLMENT_LABELS[order.fulfillment]}
                      </span>
                    </div>

                    {/* Bloc droite : total et ancienneté */}
                    <div className="text-right">
                      <div className="font-bold text-orange">{order.total.toLocaleString('fr-FR')} F</div>
                      <div className={`text-[13px] ${isOrderOld(order) && order.status === 'pending' ? 'text-status-error' : 'text-text-tertiary'}`}>
                        {getOrderAge(order)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fiche de commande */}
        <AnimatePresence>
          {(selectedOrder || isMobileDetailOpen) && (
            <>
              {/* Desktop */}
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, x: 20 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, x: 20 }}
                transition={shouldReduceMotion ? undefined : { duration: 0.15 }}
                className="hidden lg:block flex-1 min-w-[480px]"
              >
                {selectedOrder && <OrderDetail order={selectedOrder} isManager={isManager} onUpdate={updateOrderStatus} onCancel={() => setShowCancelModal(true)} isUpdating={isUpdating} />}
              </motion.div>

              {/* Mobile */}
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: '100%' }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: '100%' }}
                transition={shouldReduceMotion ? undefined : { duration: 0.15 }}
                className={`lg:hidden fixed inset-0 bg-bg-page z-50 ${isMobileDetailOpen ? 'block' : 'hidden'}`}
              >
                {selectedOrder && (
                  <div className="h-full flex flex-col">
                    <div className="bg-bg-card px-4 py-3 flex items-center gap-4 border-b border-border">
                      <button
                        onClick={() => setIsMobileDetailOpen(false)}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span className="font-bold">Retour</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <OrderDetail order={selectedOrder} isManager={isManager} onUpdate={updateOrderStatus} onCancel={() => setShowCancelModal(true)} isUpdating={isUpdating} />
                    </div>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Aucune commande sélectionnée */}
        {!selectedOrder && !isMobileDetailOpen && (
          <div className="hidden lg:block flex-1 min-w-[480px] bg-bg-card rounded-[18px] p-6 text-center text-text-tertiary">
            Sélectionnez une commande
          </div>
        )}
      </div>

      {/* Modal d'annulation */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-bg-overlay flex items-center justify-center p-4 z-50">
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={shouldReduceMotion ? undefined : { duration: 0.15 }}
            className="bg-bg-card rounded-[18px] p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold mb-4 text-heading">Annuler la commande</h2>
            <div className="mb-4">
              <label className="block text-sm text-text-tertiary mb-2">Motif d&apos;annulation *</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-bg-subcard border border-border rounded-[12px] p-3 text-text-primary min-h-[44px]"
                rows={3}
                maxLength={500}
              />
            </div>
            {error && <p className="text-status-error text-sm mb-4">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                  setError('');
                }}
                className="flex-1 bg-bg-subcard hover:bg-bg-card px-4 py-3 rounded-[12px] text-sm font-bold min-h-[44px] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => selectedOrder && cancelOrder(selectedOrder.id)}
                className="flex-1 bg-status-error hover:opacity-90 px-4 py-3 rounded-[12px] text-sm font-bold min-h-[44px] transition-colors"
              >
                Confirmer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Aria-live pour annonces */}
      <div aria-live="polite" className="sr-only">
        {newOrderIds.size > 0 && `Nouvelle commande reçue`}
      </div>
    </div>
  );
}

function OrderDetail({ order, isManager, onUpdate, onCancel, isUpdating }: { order: Order; isManager: boolean; onUpdate: (id: string, status: string) => void; onCancel: () => void; isUpdating: boolean }) {
  const STATUS_LABELS: Record<string, string> = {
    pending: 'Reçue',
    preparing: 'En préparation',
    ready: 'Prête',
    completed: 'Terminée',
    cancelled: 'Annulée',
  };

  const FULFILLMENT_LABELS: Record<string, string> = {
    DELIVERY: 'Livraison',
    DINE_IN: 'Sur place',
  };

  const nextStatus = {
    pending: 'preparing',
    preparing: 'ready',
    ready: 'completed',
  }[order.status] as string | undefined;

  const nextActionLabel = {
    pending: 'Accepter et lancer la préparation',
    preparing: 'Marquer prête',
    ready: order.fulfillment === 'DELIVERY' ? 'Marquer livrée' : 'Marquer servie',
  }[order.status] as string | undefined;

  const canCancel = order.status !== 'completed' && (order.status !== 'ready' || isManager);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="bg-bg-card border border-border rounded-[18px] p-6 no-print">
        {/* En-tête */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-[40px] font-bold text-heading uppercase leading-none mb-2">
              COMMANDE #{order.id.slice(-4).padStart(4, '0')}
            </h3>
            <div className="text-[14px] text-text-tertiary">
              {STATUS_LABELS[order.status]} à {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              {' · '}
              {order.source === 'online' ? 'en ligne' : 'boutique'}
            </div>
          </div>
          <span className={`text-[12px] font-bold px-[10px] py-[3px] rounded-[999px] ${
            order.fulfillment === 'DELIVERY'
              ? 'border border-orange text-orange'
              : 'bg-bg-subcard text-text-primary'
          }`}>
            {FULFILLMENT_LABELS[order.fulfillment]}
          </span>
        </div>

        {/* Parcours en 4 étapes */}
        {order.status !== 'cancelled' ? (
          <div className="flex justify-between mb-6">
            {['Reçue', 'En préparation', 'Prête', order.fulfillment === 'DELIVERY' ? 'Livrée' : 'Servie'].map((step, index) => {
              const stepStatuses = ['pending', 'preparing', 'ready', 'completed'];
              const isCurrent = stepStatuses[index] === order.status;
              const isPast = index < stepStatuses.indexOf(order.status);
              
              return (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm font-bold mb-1 ${
                    isCurrent ? 'bg-orange text-orange-text' : isPast ? 'bg-orange text-orange-text' : 'bg-bg-subcard text-text-tertiary'
                  }`}>
                    {isPast ? '✓' : index + 1}
                  </div>
                  <span className={`text-[13px] ${isCurrent ? 'text-text-primary font-bold' : isPast ? 'text-text-primary' : 'text-text-tertiary'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-status-error/20 border border-status-error rounded-[12px] p-4 mb-6">
            <p className="text-status-error font-bold">Annulée</p>
            {order.cancelReason && <p className="text-sm text-text-tertiary mt-1">{order.cancelReason}</p>}
          </div>
        )}

        {/* Blocs d'information */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Client */}
          <div className="bg-bg-subcard border border-border-subcard rounded-[12px] p-[14px] px-[16px]">
            <div className="text-[12px] uppercase tracking-[0.08em] text-text-tertiary mb-1">Client</div>
            <div className="text-[18px] font-bold">{order.customerName || 'Non renseigné'}</div>
          </div>

          {/* Téléphone */}
          <div className="bg-bg-subcard border border-border-subcard rounded-[12px] p-[14px] px-[16px]">
            <div className="text-[12px] uppercase tracking-[0.08em] text-text-tertiary mb-1">Téléphone</div>
            {order.phone ? (
              <a href={`tel:${order.phone}`} className="text-[18px] font-bold text-orange hover:underline">
                {order.phone}
              </a>
            ) : (
              <div className="text-[18px] font-bold text-text-tertiary">Non renseigné</div>
            )}
          </div>

          {/* Mode */}
          <div className="bg-bg-subcard border border-border-subcard rounded-[12px] p-[14px] px-[16px]">
            <div className="text-[12px] uppercase tracking-[0.08em] text-text-tertiary mb-1">Mode</div>
            <div className="text-[18px] font-bold">{FULFILLMENT_LABELS[order.fulfillment]}</div>
          </div>

          {/* Adresse ou Table */}
          {order.fulfillment === 'DELIVERY' ? (
            <div className="bg-bg-subcard border border-border-subcard rounded-[12px] p-[14px] px-[16px]">
              <div className="text-[12px] uppercase tracking-[0.08em] text-text-tertiary mb-1">Adresse</div>
              <div className="text-[18px] font-bold">{order.deliveryAddress || 'Non renseigné'}</div>
              {order.deliveryLandmark && (
                <div className="text-[14px] text-text-secondary mt-1">Repère : {order.deliveryLandmark}</div>
              )}
            </div>
          ) : (
            <div className="bg-bg-subcard border border-border-subcard rounded-[12px] p-[14px] px-[16px]">
              <div className="text-[12px] uppercase tracking-[0.08em] text-text-tertiary mb-1">Table</div>
              <div className="text-[18px] font-bold">Non renseigné</div>
            </div>
          )}

          {/* Paiement */}
          <div className="col-span-2 bg-bg-subcard border border-border-subcard rounded-[12px] p-[14px] px-[16px]">
            <div className="text-[12px] uppercase tracking-[0.08em] text-text-tertiary mb-1">Paiement</div>
            <div className="text-[18px] font-bold">À confirmer</div>
          </div>
        </div>

        {/* Articles */}
        <div className="mb-6">
          <h4 className="text-[24px] font-bold text-heading uppercase mb-3">ARTICLES</h4>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-border">
                <span className="font-bold">
                  {item.quantity}× {item.name}
                </span>
                <span className="text-orange font-bold">{item.price.toLocaleString('fr-FR')} F</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-[22px] font-bold">Total</span>
              <span className="text-[22px] font-bold text-orange">{order.total.toLocaleString('fr-FR')} F</span>
            </div>
            {order.deliveryFee !== null && (
              <div className="text-[13px] text-text-tertiary py-2">
                Frais de livraison : {order.deliveryFee.toLocaleString('fr-FR')} F
              </div>
            )}
            {order.customerNote && (
              <div className="text-[13px] text-text-tertiary py-2">
                Note : {order.customerNote}
              </div>
            )}
          </div>
        </div>

        {/* Bouton principal */}
        {nextActionLabel && nextStatus && (
          <button
            onClick={() => onUpdate(order.id, nextStatus)}
            disabled={isUpdating}
            className="w-full bg-orange text-orange-text text-[18px] font-bold rounded-[14px] min-h-[56px] mb-3 transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? 'Envoi…' : nextActionLabel}
          </button>
        )}

        {/* Boutons secondaires */}
        <div className="grid grid-cols-3 gap-[10px]">
          {order.phone && (
            <a
              href={`tel:${order.phone}`}
              className="bg-transparent border-2 border-border-secondary text-text-primary font-bold rounded-[12px] min-h-[44px] flex items-center justify-center hover:border-text-secondary transition-colors"
            >
              Appeler
            </a>
          )}
          <button
            onClick={handlePrint}
            className="bg-transparent border-2 border-border-secondary text-text-primary font-bold rounded-[12px] min-h-[44px] flex items-center justify-center hover:border-text-secondary transition-colors"
          >
            Imprimer
          </button>
          {canCancel && (
            <button
              onClick={onCancel}
              className="bg-transparent border-2 border-border-cancel text-status-error font-bold rounded-[12px] min-h-[44px] flex items-center justify-center hover:border-status-error transition-colors"
            >
              Annuler
            </button>
          )}
        </div>

        {/* Historique */}
        <div className="border-t border-border mt-6 pt-[14px]">
          <h4 className="text-text-primary font-bold mb-3">Historique</h4>
          <div className="space-y-2">
            {order.events.map((event, index) => (
              <div key={index} className="text-[14px] text-text-tertiary leading-[1.7]">
                {new Date(event.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                {' · '}
                {event.note || event.type}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Version imprimable (ticket 80mm) */}
      <div className="ticket-print hidden print:block">
        <div className="order-header">
          <h1>AVENUE CAFÉ</h1>
          <h2>Commande #{order.id.slice(-4).padStart(4, '0')}</h2>
          <div className="order-detail">
            {new Date(order.createdAt).toLocaleString('fr-FR')}
          </div>
          <div className="order-detail">
            {STATUS_LABELS[order.status]} · {FULFILLMENT_LABELS[order.fulfillment]}
          </div>
        </div>

        <div className="order-detail">
          <strong>Client :</strong> {order.customerName || 'Non renseigné'}
        </div>
        {order.phone && (
          <div className="order-detail">
            <strong>Tél :</strong> {order.phone}
          </div>
        )}
        {order.fulfillment === 'DELIVERY' && order.deliveryAddress && (
          <div className="order-detail">
            <strong>Adresse :</strong> {order.deliveryAddress}
            {order.deliveryLandmark && ` (${order.deliveryLandmark})`}
          </div>
        )}

        <div className="order-items">
          {order.items.map((item, index) => (
            <div key={index} className="order-item">
              <span>{item.quantity}× {item.name}</span>
              <span>{item.price.toLocaleString('fr-FR')} F</span>
            </div>
          ))}
        </div>

        <div className="order-total">
          <div className="order-item">
            <span>Total</span>
            <span>{order.total.toLocaleString('fr-FR')} F</span>
          </div>
          {order.deliveryFee !== null && (
            <div className="order-item">
              <span>Frais livraison</span>
              <span>{order.deliveryFee.toLocaleString('fr-FR')} F</span>
            </div>
          )}
        </div>

        {order.customerNote && (
          <div className="order-detail">
            <strong>Note :</strong> {order.customerNote}
          </div>
        )}
      </div>
    </>
  );
}
