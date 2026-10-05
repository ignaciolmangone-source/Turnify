import type { Request, Response } from 'express';
import { parse } from '../../lib/validate.js';
import { loginSchema, registerSchema } from './auth.schemas.js';
import * as authService from './auth.service.js';

export async function register(req: Request, res: Response) {
  const input = parse(registerSchema, req.body);
  res.status(201).json(await authService.register(input));
}

export async function login(req: Request, res: Response) {
  const input = parse(loginSchema, req.body);
  res.json(await authService.login(input));
}
