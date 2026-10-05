import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env.js';
import { forbidden, unauthorized } from '../lib/errors.js';

export type AuthUser = { id: string; role: Role };

// Agrega req.user al tipo Request de Express
declare global {
  namespace Express {
    interface Request { user?: AuthUser }
  }
}

export const signToken = (user: AuthUser) => jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: '7d' });

// Exige un token válido: header "Authorization: Bearer <token>"
export function auth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw unauthorized();
  try {
    const payload = jwt.verify(header.slice(7), env.JWT_SECRET) as AuthUser;
    req.user = { id: payload.id, role: payload.role };
  } catch {
    throw unauthorized('Token inválido o vencido', 'INVALID_TOKEN');
  }
  next();
}

// Exige un rol puntual. Usar siempre después de `auth`.
export const requireRole = (role: Role) => (req: Request, _res: Response, next: NextFunction) => {
  if (req.user?.role !== role) throw forbidden(role === Role.PROFESSIONAL ? 'Solo profesionales' : 'Solo clientes', 'WRONG_ROLE');
  next();
};
