import Dexie, { Table } from 'dexie';

export interface CartItem {
  id?: number;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  addedAt: Date;
}

export interface OfflineOrder {
  id?: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'synced';
  createdAt: Date;
  syncedAt?: Date;
}

export interface CachedProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
  available: boolean;
  cachedAt: Date;
}

class AvenueCafeDB extends Dexie {
  cart!: Table<CartItem>;
  offlineOrders!: Table<OfflineOrder>;
  cachedProducts!: Table<CachedProduct>;

  constructor() {
    super('AvenueCafeDB');
    this.version(3).stores({
      cart: '++id, productId, addedAt',
      offlineOrders: '++id, status, createdAt, syncedAt',
      cachedProducts: 'id, category, cachedAt',
    });
  }
}

export const db = new AvenueCafeDB();
