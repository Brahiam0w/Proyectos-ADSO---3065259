# GEMINI.md - Numerología API & Frontend

Este documento establece las directrices, estándares y arquitectura del proyecto para asegurar la consistencia y calidad en el desarrollo.

## 🌟 Descripción del Proyecto
Sistema integral de numerología que utiliza Inteligencia Artificial (Google Generative AI y Anthropic) para generar lecturas personalizadas. Incluye gestión de usuarios, membresías, pagos y un panel administrativo.

## 🛠️ Tech Stack

### Backend (Root / src)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Base de Datos:** MongoDB con Mongoose
- **Autenticación:** JWT (JSON Web Tokens) y bcryptjs
- **IA:** @google/generative-ai, @anthropic-ai/sdk
- **Tareas Programadas:** node-cron

### Frontend (/Front-end-numerologia)
- **Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite
- **UI Framework:** Quasar Framework v2
- **Estado:** Pinia (con persistencia)
- **Routing:** Vue Router
- **Comunicación:** Axios

## 📂 Estructura del Proyecto

### Backend (`/src`)
- `config/`: Configuraciones de base de datos y servicios externos.
- `controllers/`: Lógica de negocio de los endpoints.
- `middlewares/`: Filtros de seguridad, autenticación y validación de roles.
- `models/`: Esquemas de Mongoose.
- `routes/`: Definición de rutas Express agrupadas por recurso.
- `utils/`: Funciones de apoyo, lógica de numerología y CRON jobs.

### Frontend (`/Front-end-numerologia/src`)
- `api/`: Configuraciones de Axios y archivos de datos estáticos.
- `components/`: Componentes Vue reutilizables.
- `stores/`: Almacenes de Pinia para gestión de estado global.
- `views/`: Páginas principales de la aplicación.
- `routes/`: Configuración de rutas de la aplicación.

## 📏 Convenciones de Código

### Generales
- **Idioma:** Nombres de variables, funciones, comentarios y mensajes en **español** (según el código existente).
- **Estilo:** CamelCase para variables y funciones. PascalCase para modelos y componentes.

### Backend (CommonJS)
- Usar `require` y `module.exports`.
- Controlar errores con bloques `try/catch` en controladores.
- Respuestas API estandarizadas: `{ success: boolean, mensaje: string, data?: any }`.

### Frontend (ESM)
- Usar `import` y `export`.
- Preferir Composition API (`<script setup>`).
- Utilizar componentes de Quasar (`q-card`, `q-btn`, etc.) para mantener la estética.

## 🚀 Instrucciones para IA y Desarrolladores

1. **Seguridad:** Nunca exponer el archivo `.env` o claves de API en el código.
2. **Modelos:** Al modificar esquemas en `src/models/`, asegurar que las validaciones de Mongoose sean coherentes con la lógica de negocio.
3. **Rutas:** Registrar siempre las nuevas rutas en `index.js` bajo el prefijo `/api`.
4. **Validación:** Implementar validación de roles (`roleMiddleware.js`) para rutas administrativas.
5. **IA:** La lógica de generación de lecturas debe centralizarse en `src/utils/numerologia.js` o controladores específicos para evitar duplicidad.

## 🧪 Flujo de Trabajo
- **Backend:** `npm run dev` (usa nodemon).
- **Frontend:** `cd Front-end-numerologia && npm run dev`.
- **Base de Datos:** Requiere `MONGO_URI` configurado en el `.env` raíz.

## 📜 Historial de Sesiones y Cambios

### [2026-03-04] - Corrección de Diseño y mantenimiento
- **Actividad:** Se corrige el diseño de la pantalla `lecturas.vue`.
- **Cambios:**
  - Se estableció `height: 100vh` y `overflow: hidden` en el layout y contenedor principal para evitar scroll global.
  - Se ajustó el contenedor de resultados (`result-card`) para que use `flex` y su área de texto sea la única con scroll interno.
  - Se optimizó el padding para que todo el contenido sea visible sin necesidad de scroll de página.
- **Estado Actual:** Pantalla de lecturas con scroll interno en la sección de contenido, ajustada al viewport.


## reglas de codigo (Estilo ES6)
1. **Importaciones:**Usar siempre "`import x from 'y'`. No uesar 'require'.
2. **Asincronia:** Preferir `async/await` sobre `.them()`.
3. **Manejo de Errores:** En los controladores, envolver la logica en bloques `try/catch` y pasar el erroe al middleware global mediante `next(error)`.
4. **Variables:** Usar `Const` por defecto, `let` solo si es necesario. Nunca usar `var`.
5. **Funciones:** Preferor Arrow Functions para middleware y utilidades.
6. Para el nombrado de variables y constantes utiliza camelCase.
