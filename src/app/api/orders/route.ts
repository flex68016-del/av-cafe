import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { orderSchema } from '@/lib/validations';
import { authenticateRequest, requireAuth } from '@/lib/auth';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    requireAuth(user);

    const orders = await prisma.order.findMany({
      include: {
        items: true,
        events: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = orderSchema.parse(body);
    const {
      items,
      total,
      customerName,
      phone,
      fulfillment,
      deliveryAddress,
      deliveryLandmark,
      customerNote,
      deliveryFee,
    } = validatedData;

    const calculatedTotal = items.reduce((sum: number, item) => sum + (item.price * item.quantity), 0);

    if (calculatedTotal !== total) {
      return NextResponse.json(
        { error: 'Le total ne correspond pas à la somme des articles' },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        total,
        status: 'pending',
        source: 'online',
        customerName: customerName.trim(),
        phone,
        fulfillment,
        deliveryAddress: deliveryAddress?.trim(),
        deliveryLandmark: deliveryLandmark?.trim(),
        customerNote: customerNote?.trim(),
        deliveryFee,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
        events: {
          create: {
            type: 'CREATED',
            note: 'Commande reçue (en ligne)',
          },
        },
      },
      include: {
        items: true,
        events: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues?.[0]?.message || 'Données invalides' },
        { status: 400 }
      );
    }
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
