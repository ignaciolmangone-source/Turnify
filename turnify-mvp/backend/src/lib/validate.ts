import { z } from 'zod';
import { HttpError } from './errors.js';

// Valida datos (body, query o params) contra un esquema de zod.
// Si algo está mal, corta con un 400 y un mensaje en castellano.
export function parse<T extends z.ZodType>(schema: T, data: unknown): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const details = result.error.issues.map((i) => ({ campo: i.path.join('.'), error: i.message }));
    throw new HttpError(400, details[0]?.error ?? 'Datos inválidos', 'VALIDATION_ERROR', details);
  }
  return result.data;
}

// Piezas reutilizables
export const hhmm = z.string('La hora es obligatoria').regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'La hora tiene que tener formato HH:mm');
export const isoDate = z.string('La fecha es obligatoria').regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha tiene que tener formato AAAA-MM-DD');
export const idParam = z.object({ id: z.string().min(1) });
