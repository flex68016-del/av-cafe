import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, requireAuth } from '@/lib/auth';
import { statusUpdateSchema } from '@/lib/validations';

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['preparing'],
  preparing: ['ready'],
  ready: ['completed'],
  completed: [],
};

const STATUS_TO_EVENT_TYPE: Record<string, 'ACCEPTED' | 'READY' | 'COMPLETED'> = {
  preparing: 'ACCEPTED',
  ready: 'READY',
  completed: 'COMPLETED',
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateRequest(request);
    requireAuth(user);

    const body = await request.json();
    const validatedData = statusUpdateSchema.parse(body);
    const { status } = validatedData;
    const { id: orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    const validTransitions = VALID_TRANSITIONS[order.status] || [];
    if (!validTransitions.includes(status)) {
      return NextResponse.json({ error: 'Transition de statut invalide' }, { status: 400 });
    }

    // Préparer les données de mise à jour selon le nouveau statut
    const updateData: Record<string, unknown> = { status };
    const eventType = STATUS_TO_EVENT_TYPE[status];

    if (status === 'preparing') {
      updateData.acceptedAt = new Date();
    } else if (status === 'ready') {
      updateData.readyAt = new Date();
    } else if (status === 'completed') {
      updateData.doneAt = new Date();
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...updateData,
        events: eventType ? {
          create: {
            type: eventType as any,
            note: order.fulfillment === 'DELIVERY' && status === 'completed' 
              ? 'Commande livrée' 
              : status === 'completed' 
                ? 'Commande servie' 
                : undefined,
            userId: user?.id,
          },
        } : undefined,
      },
      include: {
        items: true,
        events: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
