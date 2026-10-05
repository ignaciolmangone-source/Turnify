import { z } from 'zod';

// TODO (Sebas): endurecer estas reglas (email válido con z.email(), password >= 6, nombre no vacío).
export const registerSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().min(1, 'El email es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
  phone: z.string().optional(),
  role: z.enum(['CLIENT', 'PROFESSIONAL']).default('CLIENT'),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});
export type LoginInput = z.infer<typeof loginSchema>;
