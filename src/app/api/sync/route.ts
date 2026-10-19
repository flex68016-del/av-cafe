import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { orderSchema } from '@/lib/validations';
import { createHash } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedData = orderSchema.parse(body);
    
    const { items, total } = validatedData;
    
    const calculatedTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (calculatedTotal !== total) {
      return NextResponse.json(
        { error: 'Le total ne correspond pas à la somme des articles' },
        { status: 400 }
      );
    }
    
    const signature = createHash('sha256')
      .update(JSON.stringify(items.sort((a, b) => (a.productId || '').localeCompare(b.productId || ''))))
      .digest('hex');
    
    const existingOrder = await prisma.order.findFirst({
      where: { signature },
    });
    
    if (existingOrder) {
      return NextResponse.json(
        { error: 'Cette commande a déjà été synchronisée' },
        { status: 409 }
      );
    }
    
    const order = await prisma.order.create({
      data: {
        total,
        status: 'pending',
        source: 'offline',
        signature,
        items: {
          create: items.map(item => ({
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
    
    return NextResponse.json(
      { success: true, orderId: order.id, order },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }
    
    console.error('Erreur de synchronisation:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
