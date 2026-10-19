import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { orderSchema } from '@/lib/validations';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = orderSchema.parse(body);
    const { items, total, customerName, customerPhone } = validatedData;

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
        customerName,
        customerPhone,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
