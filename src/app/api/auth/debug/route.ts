import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

// ⚠️ Endpoint de debug temporaire - À supprimer après utilisation
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: NextRequest) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

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
      }, { status: 404, headers });
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
    }, { headers });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Erreur serveur', details: String(error) }, { status: 500, headers });
  }
}
