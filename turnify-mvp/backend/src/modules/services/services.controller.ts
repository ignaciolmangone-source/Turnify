import type { Request, Response } from 'express';
import { parse, idParam } from '../../lib/validate.js';
import { serviceSchema } from './services.schemas.js';
import * as servicesService from './services.service.js';

export async function create(req: Request, res: Response) {
  const input = parse(serviceSchema, req.body);
  res.status(201).json(await servicesService.create(req.user!.id, input));
}

export async function update(req: Request, res: Response) {
  const { id } = parse(idParam, req.params);
  const input = parse(serviceSchema, req.body);
  res.json(await servicesService.update(req.user!.id, id, input));
}

export async function remove(req: Request, res: Response) {
  const { id } = parse(idParam, req.params);
  await servicesService.remove(req.user!.id, id);
  res.status(204).send();
}
