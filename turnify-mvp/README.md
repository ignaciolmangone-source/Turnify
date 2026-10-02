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
5. Copiar `backend/.env.example` a `backend/.env`.
6. Ejecutar `npm run db:push`.
7. Ejecutar `npm run db:seed`.
8. Ejecutar `npm run dev`.
9. Abrir http://localhost:5173.

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
