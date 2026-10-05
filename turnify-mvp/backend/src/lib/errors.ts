// Error con código HTTP y un `code` estable en inglés (ej: "SLOT_OVERLAP").
// El `message` es para mostrar al usuario; el `code` es para que la app (web o móvil)
// decida qué hacer sin depender del texto, que puede cambiar o traducirse.
// Se lanza desde cualquier lado con `throw conflict('...', 'SLOT_OVERLAP')`
// y el middleware de errores responde { code, message, details }.

const DEFAULT_CODES: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
};

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public code: string = DEFAULT_CODES[status] ?? 'ERROR',
    public details?: unknown,
  ) {
    super(message);
  }
}

export const badRequest = (msg: string, code?: string) => new HttpError(400, msg, code);
export const unauthorized = (msg = 'No autenticado', code?: string) => new HttpError(401, msg, code);
export const forbidden = (msg = 'No tenés permiso para hacer esto', code?: string) => new HttpError(403, msg, code);
export const notFound = (msg = 'No encontrado', code?: string) => new HttpError(404, msg, code);
export const conflict = (msg: string, code?: string) => new HttpError(409, msg, code);
