import { z } from 'zod';
import { hhmm } from '../../lib/validate.js';

// TODO (Sebas): agregar .refine() para exigir startTime < endTime.
export const availabilitySchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(6, 'dayOfWeek va de 0 (domingo) a 6 (sábado)'),
  startTime: hhmm,
  endTime: hhmm,
});
export type AvailabilityInput = z.infer<typeof availabilitySchema>;
