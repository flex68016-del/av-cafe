import { db, OfflineOrder, CartItem, CachedProduct } from './db';

// Gestion du numéro de caisse
const CASH_REGISTER_KEY = 'cash_register_id';
const TEMP_REGISTER_PREFIX = 'TEMP-';

// Génération d'un ID temporaire pour appareil
function generateTempRegisterId(): string {
  return `${TEMP_REGISTER_PREFIX}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Obtenir ou créer l'ID de caisse
export function getCashRegisterId(): string {
  const id = localStorage.getItem(CASH_REGISTER_KEY);
  if (id) return id;
  
  const tempId = generateTempRegisterId();
  localStorage.setItem(CASH_REGISTER_KEY, tempId);
  return tempId;
}

// Mettre à jour l'ID de caisse avec l'ID définitif du serveur
export function setCashRegisterId(finalId: string): void {
  localStorage.setItem(CASH_REGISTER_KEY, finalId);
}

// Vérifier si l'ID est temporaire
export function isTempRegisterId(): boolean {
  const id = getCashRegisterId();
  return id.startsWith(TEMP_REGISTER_PREFIX);
}

// Stockage sécurisé du token (sessionStorage au lieu de localStorage)
const TOKEN_KEY = 'cash_register_token';

export function setToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

// Cache des produits
export async function cacheProducts(products: Array<{
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  available: boolean;
}>): Promise<void> {
  await db.cachedProducts.clear();
  const cachedProducts: CachedProduct[] = products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category || '',
    available: p.available,
    cachedAt: new Date(),
  }));
  await db.cachedProducts.bulkAdd(cachedProducts);
}

export async function getCachedProducts(): Promise<CachedProduct[]> {
  return await db.cachedProducts.toArray();
}

export async function isProductsCacheFresh(maxAge: number = 3600000): Promise<boolean> {
  const latest = await db.cachedProducts.orderBy('cachedAt').reverse().first();
  if (!latest) return false;
  const age = Date.now() - latest.cachedAt.getTime();
  return age < maxAge;
}

// Enregistrer une vente hors ligne
export async function recordSale(items: CartItem[], total: number): Promise<number> {
  const order: OfflineOrder = {
    items,
    total,
    status: 'pending',
    createdAt: new Date(),
  };
  
  const id = await db.offlineOrders.add(order);
  return id;
}

// Obtenir les ventes en attente de synchronisation
export async function getPendingSales(): Promise<OfflineOrder[]> {
  return await db.offlineOrders
    .where('status')
    .equals('pending')
    .toArray();
}

// Compter les ventes en attente
export async function getPendingSalesCount(): Promise<number> {
  return await db.offlineOrders
    .where('status')
    .equals('pending')
    .count();
}

// Marquer une vente comme synchronisée
export async function markSaleAsSynced(id: number): Promise<void> {
  await db.offlineOrders.update(id, {
    status: 'synced',
    syncedAt: new Date(),
  });
}

// Nettoyer les ventes synchronisées (optionnel, après un certain temps)
export async function cleanupSyncedSales(daysToKeep: number = 7): Promise<void> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  
  await db.offlineOrders
    .where('status')
    .equals('synced')
    .and((order) => order.syncedAt! < cutoffDate)
    .delete();
}

// Synchroniser les ventes en attente
export async function syncPendingSales(): Promise<void> {
  const pendingSales = await getPendingSales();
  
  for (const sale of pendingSales) {
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          items: sale.items,
          total: sale.total,
          source: 'offline',
          cashRegisterId: getCashRegisterId(),
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Si le serveur retourne un ID de caisse définitif, le mettre à jour
        if (data.cashRegisterId && isTempRegisterId()) {
          setCashRegisterId(data.cashRegisterId);
        }
        
        await markSaleAsSynced(sale.id!);
      }
    } catch (error) {
      console.error('Erreur de synchronisation:', error);
      // On continue avec la vente suivante
    }
  }
}
