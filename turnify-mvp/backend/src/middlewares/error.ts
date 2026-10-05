import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { HttpError } from '../lib/errors.js';

// Ruta inexistente
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ code: 'ROUTE_NOT_FOUND', message: `No existe la ruta ${req.method} ${req.path}` });
}

// Todos los errores terminan acá (Express 5 también captura los de funciones async).
// Siempre responde JSON con { code, message } (ver lib/errors.ts).
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ code: err.code, message: err.message, details: err.details });
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') return res.status(404).json({ code: 'NOT_FOUND', message: 'Registro no encontrado' });
    if (err.code === 'P2002') return res.status(409).json({ code: 'ALREADY_EXISTS', message: 'Ya existe un registro con esos datos' });
    if (err.code === 'P2003') return res.status(409).json({ code: 'HAS_RELATED_DATA', message: 'El registro está relacionado con otros datos' });
  }
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ code: 'INVALID_JSON', message: 'El cuerpo de la petición no es un JSON válido' });
  }
  console.error(err);
  res.status(500).json({ code: 'INTERNAL_ERROR', message: 'Error interno del servidor' });
}
