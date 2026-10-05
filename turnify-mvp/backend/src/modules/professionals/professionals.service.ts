import { prisma } from '../../lib/prisma.js';
import { notFound } from '../../lib/errors.js';

// TODO (Sebas):
//  - updateMyProfile(userId, input) para PUT /api/professionals/me (businessName, category, description).
//  - list({ category, q }) con filtro por rubro y búsqueda por nombre.
//  - Sacar el teléfono del listado público.

export const list = () =>
  prisma.professionalProfile.findMany({ include: { user: { select: { name: true, phone: true } }, services: true } });

export async function getById(id: string) {
  const p = await prisma.professionalProfile.findUnique({
    where: { id },
    include: { user: { select: { name: true } }, services: true, availability: true },
  });
  if (!p) throw notFound('Profesional no encontrado');
  return p;
}

// Perfil profesional del usuario logueado. Lo usan services y availability.
export async function getMyProfileOrFail(userId: string) {
  const p = await prisma.professionalProfile.findUnique({ where: { userId } });
  if (!p) throw notFound('Perfil profesional inexistente');
  return p;
}
