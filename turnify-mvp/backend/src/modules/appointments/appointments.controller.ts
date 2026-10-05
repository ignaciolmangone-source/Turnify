import type { Request, Response } from 'express';
import { parse, idParam } from '../../lib/validate.js';
import { createAppointmentSchema, slotsQuerySchema, updateStatusSchema } from './appointments.schemas.js';
import * as appointmentsService from './appointments.service.js';

export async function listMine(req: Request, res: Response) {
  res.json(await appointmentsService.listMine(req.user!));
}

export async function create(req: Request, res: Response) {
  const input = parse(createAppointmentSchema, req.body);
  res.status(201).json(await appointmentsService.create(req.user!.id, input));
}

export async function updateStatus(req: Request, res: Response) {
  const { id } = parse(idParam, req.params);
  const { status } = parse(updateStatusSchema, req.body);
  res.json(await appointmentsService.updateStatus(req.user!, id, status));
}

// GET /api/professionals/:id/slots?date=&serviceId=
export async function getSlots(req: Request, res: Response) {
  const { id } = parse(idParam, req.params);
  const { date, serviceId } = parse(slotsQuerySchema, req.query);
  res.json(await appointmentsService.getAvailableSlots(id, date, serviceId));
}
