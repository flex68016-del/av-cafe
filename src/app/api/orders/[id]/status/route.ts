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

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
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
