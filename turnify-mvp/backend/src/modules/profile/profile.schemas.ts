import { z } from 'zod';

// TODO (Sebas): validar formato de teléfono.
export const updateProfileSchema = z.object({
  name: z.string().min(1, 'El nombre no puede estar vacío').optional(),
  phone: z.string().optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
