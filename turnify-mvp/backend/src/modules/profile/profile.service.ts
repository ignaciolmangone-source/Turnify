import { prisma } from '../../lib/prisma.js';
import { notFound } from '../../lib/errors.js';
import type { UpdateProfileInput } from './profile.schemas.js';

// Campos visibles del usuario. Antes se devolvía también passwordHash.
const userSelect = { id: true, name: true, email: true, phone: true, role: true, createdAt: true, professional: true } as const;

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: userSelect });
  if (!user) throw notFound('Usuario no encontrado');
  return user;
}

export const updateProfile = (userId: string, input: UpdateProfileInput) =>
  prisma.user.update({ where: { id: userId }, data: input, select: userSelect });
