import { describe, it, expect } from 'vitest';
import { orderSchema } from './validations';

describe('Validations de commande', () => {
  describe('Validation du téléphone', () => {
    it('accepte le format +228XXXXXXXX', () => {
      const result = orderSchema.safeParse({
        items: [{ productId: '1', name: 'Test', price: 1000, quantity: 1 }],
        total: 1000,
        customerName: 'Test',
        phone: '+22890000000',
        fulfillment: 'DINE_IN',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phone).toBe('+22890000000');
      }
    });

    it('accepte le format sans préfixe (8 chiffres)', () => {
      const result = orderSchema.safeParse({
        items: [{ productId: '1', name: 'Test', price: 1000, quantity: 1 }],
        total: 1000,
        customerName: 'Test',
        phone: '90000000',
        fulfillment: 'DINE_IN',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phone).toBe('+22890000000');
      }
    });

    it('accepte le format avec espaces', () => {
      const result = orderSchema.safeParse({
        items: [{ productId: '1', name: 'Test', price: 1000, quantity: 1 }],
        total: 1000,
        customerName: 'Test',
        phone: '90 00 00 00',
        fulfillment: 'DINE_IN',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phone).toBe('+22890000000');
      }
    });

    it('accepte le format 00228XXXXXXXX', () => {
      const result = orderSchema.safeParse({
        items: [{ productId: '1', name: 'Test', price: 1000, quantity: 1 }],
        total: 1000,
        customerName: 'Test',
        phone: '0022890000000',
        fulfillment: 'DINE_IN',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phone).toBe('+22890000000');
      }
    });

    it('rejette un numéro sans préfixe mais pas 8 chiffres', () => {
      const result = orderSchema.safeParse({
        items: [{ productId: '1', name: 'Test', price: 1000, quantity: 1 }],
        total: 1000,
        customerName: 'Test',
        phone: '1234567',
        fulfillment: 'DINE_IN',
      });
      expect(result.success).toBe(false);
    });

    it('rejette un numéro international autre que Togo', () => {
      const result = orderSchema.safeParse({
        items: [{ productId: '1', name: 'Test', price: 1000, quantity: 1 }],
        total: 1000,
        customerName: 'Test',
        phone: '+33123456789',
        fulfillment: 'DINE_IN',
      });
      expect(result.success).toBe(false);
    });

    it('rejette un téléphone vide', () => {
      const result = orderSchema.safeParse({
        items: [{ productId: '1', name: 'Test', price: 1000, quantity: 1 }],
        total: 1000,
        customerName: 'Test',
        phone: '',
        fulfillment: 'DINE_IN',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Adresse obligatoire pour livraison', () => {
    it('rejette une livraison sans adresse', () => {
      const result = orderSchema.safeParse({
        items: [{ productId: '1', name: 'Test', price: 1000, quantity: 1 }],
        total: 1000,
        customerName: 'Test',
        phone: '+22890000000',
        fulfillment: 'DELIVERY',
        deliveryAddress: '',
      });
      expect(result.success).toBe(false);
    });

    it('accepte une livraison avec adresse', () => {
      const result = orderSchema.safeParse({
        items: [{ productId: '1', name: 'Test', price: 1000, quantity: 1 }],
        total: 1000,
        customerName: 'Test',
        phone: '+22890000000',
        fulfillment: 'DELIVERY',
        deliveryAddress: '12 Rue de la Paix, Lomé',
      });
      expect(result.success).toBe(true);
    });

    it('accepte une commande sur place sans adresse', () => {
      const result = orderSchema.safeParse({
        items: [{ productId: '1', name: 'Test', price: 1000, quantity: 1 }],
        total: 1000,
        customerName: 'Test',
        phone: '+22890000000',
        fulfillment: 'DINE_IN',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Validation du nom', () => {
    it('rejette un nom d\'une seule lettre', () => {
      const result = orderSchema.safeParse({
        items: [{ productId: '1', name: 'Test', price: 1000, quantity: 1 }],
        total: 1000,
        customerName: 'A',
        phone: '+22890000000',
        fulfillment: 'DINE_IN',
      });
      expect(result.success).toBe(false);
    });

    it('accepte un nom de 2 lettres', () => {
      const result = orderSchema.safeParse({
        items: [{ productId: '1', name: 'Test', price: 1000, quantity: 1 }],
        total: 1000,
        customerName: 'AB',
        phone: '+22890000000',
        fulfillment: 'DINE_IN',
      });
      expect(result.success).toBe(true);
    });

    it('accepte un nom normal', () => {
      const result = orderSchema.safeParse({
        items: [{ productId: '1', name: 'Test', price: 1000, quantity: 1 }],
        total: 1000,
        customerName: 'Kofi Mensah',
        phone: '+22890000000',
        fulfillment: 'DINE_IN',
      });
      expect(result.success).toBe(true);
    });

    it('rejette un nom vide', () => {
      const result = orderSchema.safeParse({
        items: [{ productId: '1', name: 'Test', price: 1000, quantity: 1 }],
        total: 1000,
        customerName: '',
        phone: '+22890000000',
        fulfillment: 'DINE_IN',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Validation de la note client', () => {
    it('accepte une note de 200 caractères', () => {
      const note = 'A'.repeat(200);
      const result = orderSchema.safeParse({
        items: [{ productId: '1', name: 'Test', price: 1000, quantity: 1 }],
        total: 1000,
        customerName: 'Test',
        phone: '+22890000000',
        fulfillment: 'DINE_IN',
        customerNote: note,
      });
      expect(result.success).toBe(true);
    });

    it('rejette une note de plus de 200 caractères', () => {
      const note = 'A'.repeat(201);
      const result = orderSchema.safeParse({
        items: [{ productId: '1', name: 'Test', price: 1000, quantity: 1 }],
        total: 1000,
        customerName: 'Test',
        phone: '+22890000000',
        fulfillment: 'DINE_IN',
        customerNote: note,
      });
      expect(result.success).toBe(false);
    });
  });
});
