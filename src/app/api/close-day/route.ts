import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { date } = await request.json();
    
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
    console.error('Error closing day:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
