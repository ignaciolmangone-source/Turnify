import type { Request, Response } from 'express';
import { parse } from '../../lib/validate.js';
import { availabilitySchema } from './availability.schemas.js';
import * as availabilityService from './availability.service.js';

export async function create(req: Request, res: Response) {
  const input = parse(availabilitySchema, req.body);
  res.status(201).json(await availabilityService.create(req.user!.id, input));
}
