import { Router } from 'express';
import { auth } from '../../middlewares/auth.js';
import * as profileController from './profile.controller.js';

export const profileRouter = Router();
profileRouter.use(auth);

profileRouter.get('/', profileController.getMine);
profileRouter.put('/', profileController.updateMine);
