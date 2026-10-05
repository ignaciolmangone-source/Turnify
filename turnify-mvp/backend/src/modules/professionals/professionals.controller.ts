import type { Request, Response } from 'express';
import { parse, idParam } from '../../lib/validate.js';
import * as professionalsService from './professionals.service.js';

export async function list(_req: Request, res: Response) {
  res.json(await professionalsService.list());
}

export async function getById(req: Request, res: Response) {
  const { id } = parse(idParam, req.params);
  res.json(await professionalsService.getById(id));
}
