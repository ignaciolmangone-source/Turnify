import { Router } from 'express';
import { Role } from '@prisma/client';
import { auth, requireRole } from '../../middlewares/auth.js';
import * as appointmentsController from './appointments.controller.js';

export const appointmentsRouter = Router();
appointmentsRouter.use(auth);

appointmentsRouter.get('/', appointmentsController.listMine);
appointmentsRouter.post('/', requireRole(Role.CLIENT), appointmentsController.create);
appointmentsRouter.patch('/:id/status', appointmentsController.updateStatus);
