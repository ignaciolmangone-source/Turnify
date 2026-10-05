import { PrismaClient } from '@prisma/client';

// Una sola conexión a la base para toda la app.
export const prisma = new PrismaClient();
