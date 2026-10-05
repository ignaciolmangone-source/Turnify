import { prisma } from '../../lib/prisma.js';
import { getMyProfileOrFail } from '../professionals/professionals.service.js';
import type { ServiceInput } from './services.schemas.js';

// TODO (Sebas):
//  - En update y remove, verificar que el servicio sea del profesional logueado (hoy no se chequea:
//    cualquier profesional puede editar o borrar servicios de otro). Si no es suyo → throw forbidden().
//  - Decidir qué pasa al borrar un servicio que tiene turnos (hoy responde 409).

export async function create(userId: string, input: ServiceInput) {
  const profile = await getMyProfileOrFail(userId);
  return prisma.service.create({ data: { ...input, professionalId: profile.id } });
}

export const update = (_userId: string, id: string, input: ServiceInput) =>
  prisma.service.update({ where: { id }, data: input });

export async function remove(_userId: string, id: string) {
  await prisma.service.delete({ where: { id } });
}
