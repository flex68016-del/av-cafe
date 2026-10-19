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

class AvenueCafeDB extends Dexie {
  cart!: Table<CartItem>;
  offlineOrders!: Table<OfflineOrder>;

  constructor() {
    super('AvenueCafeDB');
    this.version(1).stores({
      cart: '++id, productId, addedAt',
      offlineOrders: '++id, status, createdAt, syncedAt',
    });
  }
}

export const db = new AvenueCafeDB();
