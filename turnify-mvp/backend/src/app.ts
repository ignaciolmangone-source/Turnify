import express, { Router } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/error.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { profileRouter } from './modules/profile/profile.routes.js';
import { professionalsRouter } from './modules/professionals/professionals.routes.js';
import { servicesRouter } from './modules/services/services.routes.js';
import { availabilityRouter } from './modules/availability/availability.routes.js';
import { appointmentsRouter } from './modules/appointments/appointments.routes.js';

// Versión de la API. Si algún día hay cambios que rompen a las apps ya instaladas
// en los celulares, se crea una v2 y la v1 sigue andando para los que no actualizaron.
export const API_VERSION = '1.0.0';

export const app = express();

// CORS solo afecta a navegadores. La app móvil no lo necesita.
app.use(cors({ origin: env.CORS_ORIGIN.split(',') }));
app.use(express.json());

// Todas las rutas de la versión 1
const v1 = Router();
v1.get('/health', (_req, res) => res.json({ ok: true, version: API_VERSION }));
v1.use('/auth', authRouter);                   // Sebas
v1.use('/profile', profileRouter);             // Sebas
v1.use('/professionals', professionalsRouter); // Sebas (+ /:id/slots de Pablo)
v1.use('/services', servicesRouter);           // Sebas
v1.use('/availability', availabilityRouter);   // Sebas
v1.use('/appointments', appointmentsRouter);   // Pablo

app.use('/api/v1', v1);
// Alias para que el front actual siga funcionando. Cuando el front use /api/v1, se puede borrar.
app.use('/api', v1);

app.use(notFoundHandler);
app.use(errorHandler);
