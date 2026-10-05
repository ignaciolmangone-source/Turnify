import 'dotenv/config';
import { z } from 'zod';

// Lee las variables de backend/.env y frena el arranque si falta alguna importante.
const schema = z.object({
  DATABASE_URL: z.string().min(1, 'Falta DATABASE_URL en backend/.env'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET tiene que tener al menos 16 caracteres'),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  APP_TIMEZONE: z.string().default('America/Argentina/Buenos_Aires'),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Configuración inválida en backend/.env:');
  for (const issue of parsed.error.issues) console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  console.error('Copiá backend/.env.example a backend/.env y completalo.');
  process.exit(1);
}

export const env = parsed.data;
