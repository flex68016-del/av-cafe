import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export async function authenticateRequest(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    // Pour l'instant, on utilise un token simple basé sur l'email
    // En production, utiliser JWT ou session cookie sécurisé
    const user = await prisma.user.findUnique({
      where: { email: token },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    return user as AuthUser | null;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export function requireAuth(user: AuthUser | null): AuthUser {
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export function requireManager(user: AuthUser): AuthUser {
  if (user.role !== 'manager') {
    throw new Error('Forbidden');
  }
  return user;
}
