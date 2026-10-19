'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { db, CartItem as DBCartItem } from '@/lib/db';

export interface CartItem {
  id: number;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  addedAt: Date;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  addToCart: (product: { id: string; name: string; price: number }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function addToCart(product: { id: string; name: string; price: number }) {
    const existingItem = items.find(item => item.productId === product.id);

    if (existingItem) {
      await updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const dbItem: DBCartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        addedAt: new Date(),
      };
      const id = await db.cart.add(dbItem);
      setItems([...items, { ...dbItem, id }]);
    }
  }

  async function removeFromCart(productId: string) {
    const item = items.find(item => item.productId === productId);
    if (item) {
      await db.cart.delete(item.id);
      setItems(items.filter(i => i.productId !== productId));
    }
  }

  async function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const item = items.find(item => item.productId === productId);
    if (item && item.id) {
      await db.cart.update(item.id, { quantity });
      setItems(items.map(i => i.productId === productId ? { ...i, quantity } : i));
    }
  }

  async function clearCart() {
    await db.cart.clear();
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ items, total, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
