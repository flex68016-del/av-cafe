import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, requireAuth, requireManager } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    const authenticatedUser = requireAuth(user);
    requireManager(authenticatedUser);

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    
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
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const total = orders.reduce((sum, order) => sum + order.total, 0);
    const completed = orders.filter((o) => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);
    const inProgress = orders.filter((o) => o.status !== 'completed').reduce((sum, o) => sum + o.total, 0);
    
    const avgOrderValue = orders.length > 0 ? total / orders.length : 0;
    
    const onlineOrders = orders.filter((o) => o.source === 'online');
    const boutiqueOrders = orders.filter((o) => o.source === 'offline' || o.source === 'boutique');
    
    const onlineTotal = onlineOrders.reduce((sum, o) => sum + o.total, 0);
    const boutiqueTotal = boutiqueOrders.reduce((sum, o) => sum + o.total, 0);

    return NextResponse.json({
      date,
      total,
      completed,
      inProgress,
      avgOrderValue: Math.round(avgOrderValue),
      orderCount: orders.length,
      sourceBreakdown: {
        online: {
          count: onlineOrders.length,
          total: onlineTotal,
        },
        boutique: {
          count: boutiqueOrders.length,
          total: boutiqueTotal,
        },
      },
      orders,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }
    console.error('Error fetching daily sales:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
