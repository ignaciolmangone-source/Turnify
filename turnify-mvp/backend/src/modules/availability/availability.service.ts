import { prisma } from '../../lib/prisma.js';
import { getMyProfileOrFail } from '../professionals/professionals.service.js';
import type { AvailabilityInput } from './availability.schemas.js';

// TODO (Sebas):
//  - listMine(userId), update(userId, id, input) y remove(userId, id), verificando que la franja sea suya.
//  - No permitir franjas superpuestas el mismo día (lib/time.ts → toMinutes ayuda).

export async function create(userId: string, input: AvailabilityInput) {
  const profile = await getMyProfileOrFail(userId);
  return prisma.availability.create({ data: { ...input, professionalId: profile.id } });
}
