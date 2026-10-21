'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
  createdAt: string;
  acceptedAt: string | null;
  readyAt: string | null;
  doneAt: string | null;
  cancelledAt: string | null;
  items: Array<{ name: string; quantity: number; price: number }>;
  events: Array<{ type: string; note: string | null; createdAt: string; userId: string | null }>;
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ['preparing', 'cancelled'],
  preparing: ['ready'],
  ready: ['completed'],
  completed: [],
  cancelled: [],
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Reçue',
  preparing: 'En préparation',
  ready: 'Prête',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-orange-500',
  preparing: 'bg-yellow-500',
  ready: 'bg-green-500',
  completed: 'bg-gray-500',
  cancelled: 'bg-red-500',
};

const FULFILLMENT_LABELS: Record<string, string> = {
  DELIVERY: 'Livraison',
  DINE_IN: 'Sur place',
};

const FULFILLMENT_COLORS: Record<string, string> = {
  DELIVERY: 'bg-purple-900 text-purple-300',
  DINE_IN: 'bg-yellow-900 text-yellow-300',
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
  const [conflictError, setConflictError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<string>('all');
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  
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
      
      // Mettre à jour le titre de l'onglet
      const pendingCount = orders.filter(o => o.status === 'pending').length;
      document.title = `(${pendingCount}) Avenue Café`;

      // Defer setState calls to avoid synchronous setState in effect
      setTimeout(() => {
        setNewOrderIds(new Set(newIds));
        setTimeout(() => setNewOrderIds(new Set()), 200);
      }, 0);
    }

    setPreviousOrderIds(currentIds);
  }, [orders, previousOrderIds, playNotificationSound]);
  /* eslint-enable react-hooks/set-state-in-effect */

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

    // Tri : pending d'abord (du plus ancien au plus récent), puis les autres
    const pendingOrders = filtered.filter(o => o.status === 'pending').sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const otherOrders = filtered.filter(o => o.status !== 'pending').sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return [...pendingOrders, ...otherOrders];
  }

  function getPendingCount(): number {
    return orders.filter(order => order.status === 'pending').length;
  }

  function getLastOrder(): Order | null {
    const pendingOrders = orders.filter(order => order.status === 'pending');
    if (pendingOrders.length === 0) return null;
    return pendingOrders[pendingOrders.length - 1];
  }

  function getOrderAge(order: Order): string {
    const now = new Date();
    const created = new Date(order.createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'il y a moins d&apos;une minute';
    if (diffMins === 1) return 'il y a 1 minute';
    if (diffMins < 60) return `il y a ${diffMins} minutes`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return 'il y a 1 heure';
    return `il y a ${diffHours} heures`;
  }

  function isOrderOld(order: Order): boolean {
    const now = new Date();
    const created = new Date(order.createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins > 10;
  }

  function getOrderNumber(id: string): string {
    return `#${id.slice(-4)}`;
  }

  function getOldestPendingOrder(): Order | null {
    const pendingOrders = orders.filter(order => order.status === 'pending');
    if (pendingOrders.length === 0) return null;
    return pendingOrders.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )[0];
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
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
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          const updated = await response.json();
          setSelectedOrder(updated);
        }
        setConflictError('');
      } else if (response.status === 409) {
        setConflictError('Conflit : un autre employé a modifié cette commande. Actualisation en cours...');
        setTimeout(() => {
          fetchOrders();
          setConflictError('');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Erreur de connexion');
    }
  }

  async function cancelOrder() {
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

      const response = await fetch(`/api/orders/${selectedOrder?.id}/cancel`, {
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
      setError('Erreur de connexion');
    }
  }



  function handleOrderClick(order: Order) {
    setSelectedOrder(order);
    setIsMobileDetailOpen(true);
  }

  function handleBackToList() {
    setIsMobileDetailOpen(false);
    setSelectedOrder(null);
  }

  function handleOldestOrder() {
    const oldest = getOldestPendingOrder();
    if (oldest) {
      setSelectedOrder(oldest);
      setIsMobileDetailOpen(true);
    }
  }

  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : null;
  const isManager = user?.role === 'manager';

  const filteredOrders = getFilteredOrders();
  const pendingCount = getPendingCount();
  const lastOrder = getLastOrder();

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      {/* Bannière orange */}
      <div className="bg-[#F57C1F] px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-heading font-bold">
              {pendingCount} commande{pendingCount !== 1 ? 's' : ''} à traiter
            </h1>
            {lastOrder && (
              <div className="text-sm opacity-90">
                <span className="font-bold">{getOrderNumber(lastOrder.id)}</span>
                {' · '}
                {FULFILLMENT_LABELS[lastOrder.fulfillment]}
                {' · '}
                {lastOrder.total} F
                {' · '}
                {getOrderAge(lastOrder)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-bold min-h-[44px] transition-colors"
              aria-label={soundEnabled ? 'Désactiver le son' : 'Activer le son'}
            >
              {soundEnabled ? 'Son activé' : 'Son désactivé'}
            </button>
            <button
              onClick={handleOldestOrder}
              disabled={!getOldestPendingOrder()}
              className="bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-bold min-h-[44px] transition-colors"
            >
              Traiter la plus ancienne
            </button>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Statut :</span>
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
                className={`px-3 py-1.5 rounded-lg text-sm font-medium min-h-[44px] transition-colors ${
                  filterStatus === value
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {label} ({getOrdersByStatus(value).length})
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Mode :</span>
            {[
              { value: 'all', label: 'Tous les modes' },
              { value: 'DELIVERY', label: 'Livraison' },
              { value: 'DINE_IN', label: 'Sur place' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilterMode(value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium min-h-[44px] transition-colors ${
                  filterMode === value
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-4 flex gap-4">
        {/* File de commandes */}
        <div className={`flex-1 ${isMobileDetailOpen ? 'hidden' : 'block'}`}>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <div className="space-y-2">
              {filteredOrders.map((order) => (
                <motion.button
                  key={order.id}
                  onClick={() => handleOrderClick(order)}
                  initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                  animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                  transition={shouldReduceMotion ? undefined : { duration: 0.15 }}
                  className={`w-full text-left bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors ${
                    selectedOrder?.id === order.id ? 'ring-2 ring-orange-500' : ''
                  } ${newOrderIds.has(order.id) ? 'ring-2 ring-orange-500 animate-pulse' : ''}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{getOrderNumber(order.id)}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                        {isOrderOld(order) && order.status === 'pending' && (
                          <span className="text-xs text-red-500 font-bold">(!)</span>
                        )}
                      </div>
                      {order.customerName && (
                        <p className="text-sm text-gray-300">{order.customerName}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${FULFILLMENT_COLORS[order.fulfillment]}`}>
                        {FULFILLMENT_LABELS[order.fulfillment]}
                      </span>
                      <span className="font-bold text-orange-500">{order.total} F</span>
                      <span className="text-xs text-gray-400">{getOrderAge(order)}</span>
                    </div>
                  </div>
                </motion.button>
              ))}
              {filteredOrders.length === 0 && (
                <div className="text-center py-8 text-gray-400">Aucune commande</div>
              )}
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
                className="hidden lg:block w-96 bg-gray-900 rounded-lg p-6"
              >
                {selectedOrder && <OrderDetail order={selectedOrder} onNextStatus={() => {
                  const transitions = STATUS_TRANSITIONS[selectedOrder.status];
                  if (transitions.length > 0) {
                    updateOrderStatus(selectedOrder.id, transitions[0]);
                  }
                }} onCancel={() => setShowCancelModal(true)} onCall={() => {
                  if (selectedOrder.phone) {
                    window.location.href = `tel:${selectedOrder.phone}`;
                  }
                }} onPrint={() => window.print()} isManager={isManager} />}
              </motion.div>

              {/* Mobile */}
              <motion.div
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: '100%' }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: '100%' }}
                transition={shouldReduceMotion ? undefined : { duration: 0.15 }}
                className={`lg:hidden fixed inset-0 bg-[#0B0B0B] z-50 ${isMobileDetailOpen ? 'block' : 'hidden'}`}
              >
                {selectedOrder && (
                  <div className="h-full flex flex-col">
                    <div className="bg-gray-900 px-4 py-3 flex items-center gap-4 border-b border-gray-800">
                      <button
                        onClick={handleBackToList}
                        className="text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Retour"
                      >
                        ←
                      </button>
                      <h2 className="font-bold">{getOrderNumber(selectedOrder.id)}</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <OrderDetail order={selectedOrder} onNextStatus={() => {
                        const transitions = STATUS_TRANSITIONS[selectedOrder.status];
                        if (transitions.length > 0) {
                          updateOrderStatus(selectedOrder.id, transitions[0]);
                        }
                      }} onCancel={() => setShowCancelModal(true)} onCall={() => {
                      if (selectedOrder.phone) {
                        window.location.href = `tel:${selectedOrder.phone}`;
                      }
                    }} onPrint={() => window.print()} isManager={isManager} />
                    </div>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Modal d'annulation */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={shouldReduceMotion ? undefined : { duration: 0.15 }}
            className="bg-gray-900 rounded-lg p-6 max-w-md w-full"
          >
            <h2 className="text-xl font-bold mb-4">Annuler la commande</h2>
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Motif d&apos;annulation *</label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 min-h-[44px]"
                rows={3}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                  setError('');
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold min-h-[44px]"
              >
                Annuler
              </button>
              <button
                onClick={cancelOrder}
                className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold min-h-[44px]"
              >
                Confirmer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Message de conflit */}
      {conflictError && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg z-50">
          {conflictError}
        </div>
      )}

      {/* Aria-live pour annonces */}
      <div aria-live="polite" className="sr-only">
        {newOrderIds.size > 0 && `Nouvelle commande reçue`}
      </div>
    </div>
  );
}

function OrderDetail({ order, onNextStatus, onCancel, onCall, onPrint, isManager }: {
  order: Order;
  onNextStatus: () => void;
  onCancel: () => void;
  onCall: () => void;
  onPrint: () => void;
  isManager: boolean;
}) {
  const transitions = STATUS_TRANSITIONS[order.status];
  const canCancel = order.status === 'pending' || (isManager && order.status === 'preparing');

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold">{`#${order.id.slice(-4)}`}</h3>
          <span className="text-sm text-gray-400">
            {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded ${order.source === 'online' ? 'bg-blue-900 text-blue-300' : 'bg-green-900 text-green-300'}`}>
            {order.source === 'online' ? 'En ligne' : 'Boutique'}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded ${FULFILLMENT_COLORS[order.fulfillment]}`}>
            {FULFILLMENT_LABELS[order.fulfillment]}
          </span>
        </div>
      </div>

      {/* Parcours en 4 étapes */}
      <div className="flex items-center justify-between">
        {['pending', 'preparing', 'ready', 'completed'].map((status, index) => {
          const isCurrent = order.status === status;
          const isPast = ['pending', 'preparing', 'ready'].includes(status) && 
            ['preparing', 'ready', 'completed'].includes(order.status);
          
          return (
            <div key={status} className="flex-1 flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isCurrent ? 'bg-orange-500' : isPast ? 'bg-green-500' : 'bg-gray-700'
              }`}>
                {isPast || isCurrent ? '✓' : index + 1}
              </div>
              {index < 3 && <div className={`flex-1 h-1 mx-2 ${isPast ? 'bg-green-500' : 'bg-gray-700'}`} />}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>Reçue</span>
        <span>En préparation</span>
        <span>Prête</span>
        <span>{order.fulfillment === 'DELIVERY' ? 'Livrée' : 'Servie'}</span>
      </div>

      {/* Informations client */}
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-400">Client</p>
          <p className="font-bold">{order.customerName || 'Non renseigné'}</p>
        </div>
        {order.phone && (
          <div>
            <p className="text-sm text-gray-400">Téléphone</p>
            <a
              href={`tel:${order.phone}`}
              className="text-orange-500 hover:underline font-bold"
            >
              {order.phone}
            </a>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-400">Mode</p>
          <p>{FULFILLMENT_LABELS[order.fulfillment]}</p>
        </div>
        {order.fulfillment === 'DELIVERY' && (
          <>
            <div>
              <p className="text-sm text-gray-400">Adresse de livraison</p>
              <p>{order.deliveryAddress || 'Non renseigné'}</p>
              {order.deliveryLandmark && <p className="text-sm text-gray-400">({order.deliveryLandmark})</p>}
            </div>
            {order.deliveryFee && (
              <div>
                <p className="text-sm text-gray-400">Frais de livraison</p>
                <p>{order.deliveryFee} F</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Articles */}
      <div>
        <p className="text-sm text-gray-400 mb-2">Articles</p>
        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between">
              <span>{item.name} x{item.quantity}</span>
              <span>{item.price * item.quantity} F</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-800 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">Total</span>
          <span className="text-2xl font-bold text-orange-500">{order.total} F</span>
        </div>
      </div>

      {/* Note client */}
      {order.customerNote && (
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-sm text-gray-400 mb-1">Note du client</p>
          <p className="text-sm italic">{order.customerNote}</p>
        </div>
      )}

      {/* Bouton d'action principal */}
      {transitions.length > 0 && (
        <button
          onClick={onNextStatus}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg min-h-[44px] transition-colors"
        >
          {(() => {
            const nextStatus = transitions[0];
            if (nextStatus === 'preparing') return 'Accepter et lancer la préparation';
            if (nextStatus === 'ready') return 'Marquer prête';
            if (nextStatus === 'completed') {
              return order.fulfillment === 'DELIVERY' ? 'Marquer livrée' : 'Marquer servie';
            }
            return '';
          })()}
        </button>
      )}

      {/* Boutons secondaires */}
      <div className="flex gap-2">
        {order.phone && (
          <button
            onClick={onCall}
            className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold min-h-[44px]"
          >
            Appeler
          </button>
        )}
        <button
          onClick={onPrint}
          className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold min-h-[44px]"
        >
          Imprimer
        </button>
        {canCancel && (
          <button
            onClick={onCancel}
            className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold min-h-[44px]"
          >
            Annuler
          </button>
        )}
      </div>

      {/* Historique */}
      {order.events && order.events.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 mb-2">Historique</p>
          <div className="space-y-2 text-sm">
            {order.events.map((event, idx) => (
              <div key={idx} className="text-gray-300">
                <span className="text-gray-400">
                  {new Date(event.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                {' - '}
                {event.note || event.type}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
