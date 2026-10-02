@echo off
cd /d %~dp0
if not exist backend\.env copy backend\.env.example backend\.env
echo 1. Asegurate de tener Docker Desktop abierto.
echo 2. Ejecutando PostgreSQL...
docker compose up -d
echo 3. Instalando dependencias...
npm install
npm run install:all
echo 4. Preparando base de datos...
npm run db:push
npm run db:seed
echo 5. Iniciando Turnify...
npm run dev
pause
