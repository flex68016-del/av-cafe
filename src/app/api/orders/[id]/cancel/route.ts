import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, requireAuth } from '@/lib/auth';
import { z } from 'zod';

const cancelSchema = z.object({
  reason: z.string().min(1, 'Le motif d\'annulation est obligatoire').max(500),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateRequest(request);
    requireAuth(user);

    const body = await request.json();
    const validatedData = cancelSchema.parse(body);
    const { reason } = validatedData;
    const { id: orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    // Vérifier les droits d'annulation
    if (order.status === 'completed') {
      return NextResponse.json({ error: 'Une commande terminée ne peut pas être annulée' }, { status: 400 });
    }

    // Après le statut Prête, seul le gérant peut annuler
    if (order.status === 'ready' && user?.role !== 'manager') {
      return NextResponse.json({ error: 'Seul le gérant peut annuler une commande prête' }, { status: 403 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'cancelled',
        cancelReason: reason,
        cancelledAt: new Date(),
        events: {
          create: {
            type: 'CANCELLED',
            note: reason,
            userId: user?.id,
          },
        },
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
      const zodError = error as z.ZodError;
      return NextResponse.json({ error: zodError.issues?.[0]?.message || 'Données invalides' }, { status: 400 });
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    console.error('Error cancelling order:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
