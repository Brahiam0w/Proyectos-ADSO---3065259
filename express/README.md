# Sistema de Numerología - Backend (Node.js + MySQL)

Entrega para el proyecto: API REST que maneja usuarios, membresías y lecturas (principal y diaria).

## Tecnologías
- Node.js (ES Modules)
- Express
- MySQL (mysql2/promise)
- node-cron (para validar vencimientos)
- express-validator (validaciones)

## Estructura
- src/config: configuración DB
- src/models: consultas SQL
- src/controllers: lógica de negocio
- src/routes: endpoints
- src/utils: helpers (IA simulada)
- src/cron: tarea para actualizar estado de membresía
- sql/script.sql: script de creación de tablas
- postman/collection.json: colección para pruebas

## Variables de entorno
Copia `.env.example` a `.env` y completa los valores.

## Endpoints principales (resumen)
Usuarios:
- GET /api/usuarios 
- GET /api/usuarios/:id
- POST /api/usuarios
- PUT /api/usuarios/:id
- PATCH /api/usuarios/:id/estado
- DELETE /api/usuarios/:id

Pagos (membresía):
- GET /api/pagos
- GET /api/pagos/:usuario_id
- POST /api/pagos
- GET /api/pagos/estado/:usuario_id

Lecturas:
- POST /api/lecturas/principal/:usuario_id
- POST /api/lecturas/diaria/:usuario_id 
- GET /api/lecturas/usuario/:usuario_id
- GET /api/lecturas/:id

## Cómo levantar
1. `npm install`
2. Crear la base de datos y ejecutar `sql/script.sql`
3. Completar `.env`
4. `npm run start`

ruta: https://localhost:3000/