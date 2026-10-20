import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, requireAuth, requireManager } from '@/lib/auth';
import { closeDaySchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    const authenticatedUser = requireAuth(user);
    requireManager(authenticatedUser);

    const body = await request.json();
    const validatedData = closeDaySchema.parse(body);
    const { date } = validatedData;
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const serverTotal = orders.reduce((sum, order) => sum + order.total, 0);
    const discrepancy = 0; // À implémenter avec la caisse physique

    return NextResponse.json({
      serverTotal,
      discrepancy,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }
    console.error('Error closing day:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
