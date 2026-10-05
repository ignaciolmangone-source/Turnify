import { Router } from 'express';
import { Role } from '@prisma/client';
import { auth, requireRole } from '../../middlewares/auth.js';
import * as servicesController from './services.controller.js';

export const servicesRouter = Router();
servicesRouter.use(auth, requireRole(Role.PROFESSIONAL));

servicesRouter.post('/', servicesController.create);
servicesRouter.put('/:id', servicesController.update);
servicesRouter.delete('/:id', servicesController.remove);
