# Turnify MVP

Aplicación web responsive de gestión de turnos para profesionales de distintos rubros.

## Stack
- React + TypeScript + Vite
- Node.js + Express + TypeScript
- PostgreSQL + Prisma
- JWT + bcrypt
- CSS responsive sin dependencia de UI externa

## Funcionalidades del MVP
- Registro e inicio de sesión.
- Roles CLIENT y PROFESSIONAL.
- Perfil de usuario.
- Perfil profesional y rubro.
- Servicios con duración y precio.
- Horarios de atención.
- Reserva de turnos.
- Aclaraciones del cliente.
- Cancelación de turnos.
- Dashboard del profesional.
- Gestión básica de servicios y horarios.

## Requisitos
Node.js 20+ y Docker Desktop.

## Instalación
1. Abrir la carpeta en Visual Studio Code.
2. Ejecutar `docker compose up -d`.
3. Ejecutar `npm install`.
4. Ejecutar `npm run install:all`.
5. Copiar `backend/.env.example` a `backend/.env` y `frontend/.env.example` a `frontend/.env`.
6. Ejecutar `npm run db:push`.
7. Ejecutar `npm run db:seed`.
8. Ejecutar `npm run dev`.
9. Abrir http://localhost:5173.

## Estructura del backend
```
backend/src/
├── server.ts            arranca el servidor
├── app.ts               arma Express y monta cada módulo
├── config/env.ts        valida las variables de backend/.env
├── lib/                 prisma, errores HTTP, validación (zod), utilidades de fecha/hora
├── middlewares/         auth (token y rol) y manejo global de errores
└── modules/             un módulo por tema: auth, profile, professionals,
                         services, availability, appointments
```
Los errores se lanzan con `throw notFound('...')`, `throw conflict('...')`, etc.
y la API siempre responde `{ message }` con el código HTTP que corresponde.

## Convenciones de la API (pensadas para web y app móvil)
- Todas las rutas viven en `/api/v1/...` (`/api/...` queda como alias temporal).
  Si un cambio rompe a apps ya instaladas, se crea `/api/v2` y la v1 sigue andando.
- Los errores siempre responden `{ code, message, details? }`. `code` es estable
  (ej: `SLOT_OVERLAP`, `VALIDATION_ERROR`) y es lo que el cliente usa para decidir;
  `message` es el texto para mostrar.
- `GET /api/v1/health` devuelve la versión de la API.
- El front lee la URL de la API de `frontend/.env` (`VITE_API_URL`).

## Endpoints de turnos
- `GET /api/v1/professionals/:id/slots?date=AAAA-MM-DD&serviceId=...` → horarios libres.
- `POST /api/v1/appointments` (cliente) → valida fecha pasada, día de atención,
  horario de atención y superposición. El `endTime` lo calcula el back.
- `GET /api/v1/appointments` → mis turnos (cliente o profesional).
- `PATCH /api/v1/appointments/:id/status` → cambiar estado.

## Usuario demo
Profesional: `profesional@turnify.local` / `123456`
Cliente: `cliente@turnify.local` / `123456`

## Próximas fases
- Recordatorios email.
- WhatsApp Business API.
- Medios de cobro y Mercado Pago.
- Reprogramación.
- Bloqueos/feriados.
- Notificaciones.
- Estadísticas.
- Deploy y dominio.
