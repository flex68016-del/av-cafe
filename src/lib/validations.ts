import { z } from 'zod';

export const cartItemSchema = z.object({
  productId: z.string().optional(),
  name: z.string().min(1).max(200),
  price: z.number().int().nonnegative().max(1000000),
  quantity: z.number().int().positive().max(100),
});

// Normalise un numéro de téléphone togolais au format +228XXXXXXXX
function normalizeTogoPhone(phone: string): string {
  // Nettoyer : espaces, tirets
  const cleaned = phone.replace(/[\s-]/g, '');

  // Si commence par +228 ou 00228, extraire les 8 chiffres
  if (cleaned.startsWith('+228')) {
    const digits = cleaned.slice(4);
    if (digits.length === 8) return `+228${digits}`;
  }
  if (cleaned.startsWith('00228')) {
    const digits = cleaned.slice(5);
    if (digits.length === 8) return `+228${digits}`;
  }

  // Si 8 chiffres purs, ajouter +228
  if (/^\d{8}$/.test(cleaned)) {
    return `+228${cleaned}`;
  }

  // Sinon retourner tel quel (sera rejeté par la validation)
  return phone;
}

export const orderSchema = z.object({
  items: z.array(cartItemSchema).min(1).max(50),
  total: z.number().int().nonnegative().max(10000000),
  customerName: z.string().min(2, 'Le nom doit contenir au moins 2 lettres').max(100),
  phone: z.string()
    .min(1, 'Le téléphone est obligatoire')
    .transform(normalizeTogoPhone)
    .refine(phone => /^\+228\d{8}$/.test(phone), 'Numéro de téléphone togolais invalide (format attendu: +228XXXXXXXX)'),
  fulfillment: z.enum(['DELIVERY', 'DINE_IN']),
  deliveryAddress: z.string().optional(),
  deliveryLandmark: z.string().max(200).optional(),
  tableNumber: z.string().max(20).optional(),
  customerNote: z.string().max(200).optional(),
  deliveryFee: z.number().int().nonnegative().max(10000).optional(),
  cashRegisterId: z.string().max(50).optional(),
}).refine(
  (data) => {
    // Si livraison, l'adresse est obligatoire
    if (data.fulfillment === 'DELIVERY') {
      return !!data.deliveryAddress && data.deliveryAddress.trim().length > 0;
    }
    return true;
  },
  {
    message: 'L\'adresse de livraison est obligatoire pour une livraison',
    path: ['deliveryAddress'],
  }
);

export const closeDaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(6).max(200),
});

export const statusUpdateSchema = z.object({
  status: z.enum(['pending', 'preparing', 'ready', 'completed']),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type CloseDayInput = z.infer<typeof closeDaySchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type StatusUpdateInput = z.infer<typeof statusUpdateSchema>;
