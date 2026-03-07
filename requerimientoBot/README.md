# RequerimientoBot - Automatización de Certificados SENA

Este proyecto es un bot automatizado con panel de administración para la descarga mensual de certificados del SENA.

## 🛠️ Stack Tecnológico (Backend & Automatización)

- **[Express.js](https://expressjs.com/):** Framework para la API REST del panel de administración.
- **[MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/):** Base de datos NoSQL para gestión flexible de contratistas y logs históricos de ejecución.
- **[Playwright](https://playwright.dev/):** Motor de automatización para la navegación en el portal del SENA.
- **[node-cron](https://github.com/node-cron/node-cron):** Planificador de tareas para ejecución mensual automática.
- **[Winston](https://github.com/winstonjs/winston):** Logging estructurado para auditoría.

## 🖥️ Frontend (Panel de Administración)

El dashboard permite supervisar el bot en tiempo real:
- **Estado de Descargas:** Monitor de la cola actual de contratistas procesados.
- **Última Ejecución:** Resumen detallado del éxito/fallo de la tarea cron más reciente.
- **Historial de Errores:** Visualización de fallos específicos (captchas, timeouts, portal caído).
- **Gestión de Contratistas:** CRUD para activar/desactivar y editar datos de acceso.

---

## 🏗️ Estructura del Proyecto Actualizada

```text
requerimientoBot/
├── src/
│   ├── config/       # Configuración (DB, .env, Playwright)
│   ├── core/         # Scrapers y automatización (Playwright scripts)
│   ├── database/     # Esquemas de Mongoose (Contratista, Log, User)
│   ├── controllers/  # Lógica de la API (Endpoints del Dashboard)
│   ├── routes/       # Rutas de Express
│   ├── services/     # Lógica de negocio y procesamiento de archivos
│   ├── utils/        # Ayudantes (Cifrado AES, Fechas)
│   └── jobs/         # Definición de Cron Jobs
├── public/           # Frontend (HTML/JS/CSS del Dashboard)
├── logs/             # Archivos de log persistentes
├── certificados/     # Almacenamiento final por año/mes
└── GEMINI.md         # Mandatos de desarrollo y seguridad
```

## 🚀 Instalación Rápida

1. **Dependencias:**
   ```bash
   npm install express mongoose playwright node-cron winston dotenv helmet jsonwebtoken adm-zip
   ```
2. **Navegador:**
   ```bash
   npx playwright install chromium
   ```
3. **Configuración:**
   Crea un `.env` con `MONGO_URI`, `ENCRYPTION_KEY` (32 bytes) y `PORT`.

---

## 🧪 Notas sobre MongoDB
Se utiliza MongoDB para permitir un esquema de logs extensible, lo que facilita el almacenamiento de capturas de error o estructuras de datos variables provenientes del portal del SENA sin necesidad de migraciones complejas.
