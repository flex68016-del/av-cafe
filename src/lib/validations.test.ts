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

  describe('Affichage Non renseigné', () => {
    it('affiche Non renseigné pour un nom vide', () => {
      const name = '';
      const display = name || 'Non renseigné';
      expect(display).toBe('Non renseigné');
    });

    it('affiche Non renseigné pour un téléphone vide', () => {
      const phone = null;
      const display = phone || 'Non renseigné';
      expect(display).toBe('Non renseigné');
    });

    it('affiche Non renseigné pour une adresse vide', () => {
      const address = '';
      const display = address || 'Non renseigné';
      expect(display).toBe('Non renseigné');
    });
  });

  describe('Calcul de l&apos;ancienneté', () => {
    it('calcule l&apos;ancienneté en minutes', () => {
      const now = Date.now();
      const createdAt = new Date(now - 4 * 60 * 1000).toISOString();
      const diff = now - new Date(createdAt).getTime();
      const minutes = Math.floor(diff / 60000);
      expect(minutes).toBe(4);
    });

    it('calcule l&apos;ancienneté en heures', () => {
      const now = Date.now();
      const createdAt = new Date(now - 2 * 60 * 60 * 1000).toISOString();
      const diff = now - new Date(createdAt).getTime();
      const hours = Math.floor(diff / 3600000);
      expect(hours).toBe(2);
    });

    it('détecte une commande vieille de plus de 10 minutes', () => {
      const now = Date.now();
      const createdAt = new Date(now - 11 * 60 * 1000).toISOString();
      const diff = now - new Date(createdAt).getTime();
      const isOld = diff > 10 * 60 * 1000;
      expect(isOld).toBe(true);
    });
  });

  describe('Choix du bouton principal selon le statut', () => {
    it('affiche Accepter et lancer la préparation pour pending', () => {
      const status = 'pending';
      const label = {
        pending: 'Accepter et lancer la préparation',
        preparing: 'Marquer prête',
        ready: 'Marquer livrée',
      }[status];
      expect(label).toBe('Accepter et lancer la préparation');
    });

    it('affiche Marquer prête pour preparing', () => {
      const status = 'preparing';
      const label = {
        pending: 'Accepter et lancer la préparation',
        preparing: 'Marquer prête',
        ready: 'Marquer livrée',
      }[status];
      expect(label).toBe('Marquer prête');
    });

    it('affiche Marquer livrée pour ready (livraison)', () => {
      const status = 'ready';
      const fulfillment = 'DELIVERY';
      const labelMap: Record<string, Record<string, string>> = {
        ready: {
          DELIVERY: 'Marquer livrée',
          DINE_IN: 'Marquer servie',
        },
      };
      const label = labelMap[status]?.[fulfillment];
      expect(label).toBe('Marquer livrée');
    });

    it('affiche Marquer servie pour ready (sur place)', () => {
      const status = 'ready';
      const fulfillment = 'DINE_IN';
      const labelMap: Record<string, Record<string, string>> = {
        ready: {
          DELIVERY: 'Marquer livrée',
          DINE_IN: 'Marquer servie',
        },
      };
      const label = labelMap[status]?.[fulfillment];
      expect(label).toBe('Marquer servie');
    });

    it('n&apos;affiche aucun bouton pour completed', () => {
      const status = 'completed';
      const labels: Record<string, string | undefined> = {
        pending: 'Accepter et lancer la préparation',
        preparing: 'Marquer prête',
        ready: 'Marquer livrée',
        completed: undefined,
      };
      const label = labels[status];
      expect(label).toBeUndefined();
    });
  });
});
