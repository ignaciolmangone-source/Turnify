import { z } from 'zod';
import { AppointmentStatus, ReminderType } from '@prisma/client';
import { hhmm, isoDate } from '../../lib/validate.js';

export const createAppointmentSchema = z.object({
  professionalId: z.string().min(1, 'Falta el profesional'),
  serviceId: z.string().min(1, 'Falta el servicio'),
  date: isoDate,
  startTime: hhmm,
  notes: z.string().max(500, 'Las aclaraciones pueden tener hasta 500 caracteres').optional(),
  reminder: z.enum(ReminderType).default(ReminderType.NONE),
  // El front todavía manda endTime: se ignora, lo calcula el back.
});
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

export const updateStatusSchema = z.object({
  status: z.enum(AppointmentStatus, 'Estado inválido'),
});

export const slotsQuerySchema = z.object({
  date: isoDate,
  serviceId: z.string().min(1, 'Falta serviceId'),
});
