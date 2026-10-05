import { z } from 'zod';

// TODO (Sebas): duración múltiplo de 5 y con un máximo razonable; descripción con largo máximo.
export const serviceSchema = z.object({
  name: z.string().min(1, 'El nombre del servicio es obligatorio'),
  description: z.string().optional(),
  duration: z.coerce.number().int().positive('La duración tiene que ser mayor a 0'),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
});
export type ServiceInput = z.infer<typeof serviceSchema>;
