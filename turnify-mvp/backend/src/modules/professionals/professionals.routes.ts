import { Router } from 'express';
import * as professionalsController from './professionals.controller.js';
import * as appointmentsController from '../appointments/appointments.controller.js';

export const professionalsRouter = Router();

professionalsRouter.get('/', professionalsController.list);
professionalsRouter.get('/:id', professionalsController.getById);

// Horarios libres (módulo de turnos). Ej: /api/professionals/abc/slots?date=2026-10-06&serviceId=xyz
professionalsRouter.get('/:id/slots', appointmentsController.getSlots);
