import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateRequest, requireAuth, requireManager } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateRequest(request);
    const authenticatedUser = requireAuth(user);
    requireManager(authenticatedUser);

    const { id: productId } = await params;
    const body = await request.json();
    const { name, description, price, category, image, available } = body;

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price && { price: parseInt(price) }),
        ...(category !== undefined && { category }),
        ...(image !== undefined && { image }),
        ...(available !== undefined && { available }),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateRequest(request);
    const authenticatedUser = requireAuth(user);
    requireManager(authenticatedUser);

    const { id: productId } = await params;

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
