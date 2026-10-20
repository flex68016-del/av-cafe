import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

// ⚠️ Endpoint de debug temporaire - À supprimer après utilisation
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ 
        error: 'Utilisateur non trouvé',
        email,
        users: await prisma.user.findMany({ select: { id: true, email: true, role: true } })
      }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      passwordMatch: isValid,
      providedPassword: password,
      passwordHashLength: user.password.length,
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Erreur serveur', details: String(error) }, { status: 500 });
  }
}
