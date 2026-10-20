import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, requireAuth, requireManager } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    const authenticatedUser = requireAuth(user);
    requireManager(authenticatedUser);

    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    const authenticatedUser = requireAuth(user);
    requireManager(authenticatedUser);

    const body = await request.json();
    const { name, description, price, category, available } = body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseInt(price),
        category,
        available: available !== undefined ? available : true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
