import { AppointmentStatus, Role } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { badRequest, conflict, notFound } from '../../lib/errors.js';
import { dayOfWeek, dayToDb, isPast, toHHMM, toMinutes } from '../../lib/time.js';
import type { AuthUser } from '../../middlewares/auth.js';
import type { CreateAppointmentInput } from './appointments.schemas.js';

// Cada cuántos minutos se ofrece un horario de inicio (09:00, 09:30, 10:00...)
const SLOT_STEP_MINUTES = 30;

type Range = { start: number; end: number }; // minutos desde las 00:00
const overlaps = (a: Range, b: Range) => a.start < b.end && b.start < a.end;

// Lo necesario para calcular un día: el servicio, las franjas de atención de ese
// día de la semana y los turnos ya tomados (no cancelados).
async function loadDay(professionalId: string, date: string, serviceId: string) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || service.professionalId !== professionalId) throw notFound('Ese servicio no existe para este profesional', 'SERVICE_NOT_FOUND');

  const [windows, taken] = await Promise.all([
    prisma.availability.findMany({ where: { professionalId, dayOfWeek: dayOfWeek(date) } }),
    prisma.appointment.findMany({
      where: { professionalId, date: dayToDb(date), status: { not: AppointmentStatus.CANCELLED } },
      select: { startTime: true, endTime: true },
    }),
  ]);

  return {
    service,
    windows: windows.map((w) => ({ start: toMinutes(w.startTime), end: toMinutes(w.endTime) })),
    taken: taken.map((t) => ({ start: toMinutes(t.startTime), end: toMinutes(t.endTime) })),
  };
}

// Horarios de inicio en los que el servicio entra completo, dentro del horario
// de atención, sin pisarse con otro turno y que no hayan pasado.
export async function getAvailableSlots(professionalId: string, date: string, serviceId: string) {
  const { service, windows, taken } = await loadDay(professionalId, date, serviceId);
  const slots = new Set<string>();

  for (const w of windows) {
    for (let start = w.start; start + service.duration <= w.end; start += SLOT_STEP_MINUTES) {
      const candidate = { start, end: start + service.duration };
      if (taken.some((t) => overlaps(candidate, t))) continue;
      if (isPast(date, toHHMM(start))) continue;
      slots.add(toHHMM(start));
    }
  }
  return { date, serviceId, duration: service.duration, slots: [...slots].sort() };
}

export async function create(clientId: string, input: CreateAppointmentInput) {
  const { service, windows, taken } = await loadDay(input.professionalId, input.date, input.serviceId);
  const start = toMinutes(input.startTime);
  const requested = { start, end: start + service.duration };

  if (isPast(input.date, input.startTime)) throw badRequest('No se puede reservar un turno en el pasado', 'SLOT_IN_PAST');
  if (windows.length === 0) throw badRequest('El profesional no atiende ese día', 'DAY_NOT_AVAILABLE');
  if (!windows.some((w) => requested.start >= w.start && requested.end <= w.end)) {
    throw badRequest('El turno queda fuera del horario de atención', 'OUTSIDE_WORKING_HOURS');
  }
  if (taken.some((t) => overlaps(requested, t))) throw conflict('Ese horario se superpone con otro turno', 'SLOT_OVERLAP');

  // TODO (Pablo): si dos personas reservan el mismo horario al mismo tiempo, las dos
  // validaciones pasan. Resolverlo envolviendo todo en prisma.$transaction (isolationLevel Serializable).
  return prisma.appointment.create({
    data: {
      professionalId: input.professionalId,
      clientId,
      serviceId: input.serviceId,
      date: dayToDb(input.date),
      startTime: input.startTime,
      endTime: toHHMM(requested.end), // lo calcula el back
      notes: input.notes,
      reminder: input.reminder,
    },
  });
}

// El profesional ve los turnos que le reservaron; el cliente, los que reservó.
export function listMine(user: AuthUser) {
  const where = user.role === Role.PROFESSIONAL ? { professional: { userId: user.id } } : { clientId: user.id };
  return prisma.appointment.findMany({
    where,
    include: {
      service: true,
      client: { select: { name: true, email: true, phone: true } },
      professional: { include: { user: { select: { name: true } } } },
    },
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });
}

export async function updateStatus(_user: AuthUser, id: string, status: AppointmentStatus) {
  const appointment = await prisma.appointment.findUnique({ where: { id }, include: { professional: true } });
  if (!appointment) throw notFound('Turno no encontrado', 'APPOINTMENT_NOT_FOUND');

  // TODO (Pablo) — próximo paso, permisos y transiciones:
  //  - Cliente: solo puede pasar a CANCELLED y solo sus turnos (appointment.clientId === user.id).
  //  - Profesional: solo turnos propios (appointment.professional.userId === user.id);
  //    PENDING → CONFIRMED | CANCELLED, CONFIRMED → COMPLETED | CANCELLED.
  //  - Un turno CANCELLED o COMPLETED ya no cambia.
  //  Si no se cumple → throw forbidden() o badRequest(). Hoy cualquier usuario logueado cambia cualquier turno.

  return prisma.appointment.update({ where: { id }, data: { status } });
}
