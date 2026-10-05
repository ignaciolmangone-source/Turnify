import { Router } from 'express';
import { Role } from '@prisma/client';
import { auth, requireRole } from '../../middlewares/auth.js';
import * as availabilityController from './availability.controller.js';

export const availabilityRouter = Router();
availabilityRouter.use(auth, requireRole(Role.PROFESSIONAL));

availabilityRouter.post('/', availabilityController.create);
