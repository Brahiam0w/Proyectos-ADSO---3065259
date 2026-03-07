# Proyecto: RequerimientoBot - Automatización SENA

Este archivo define las reglas y estándares obligatorios para el desarrollo de la automatización.

## Mandatos de Seguridad y Datos (RNF-01, RNF-04)
- **Cifrado Obligatorio:** Las credenciales de los contratistas (documento y contraseña) NUNCA deben almacenarse en texto plano. Se debe usar el módulo nativo `crypto` de Node.js con AES-256-GCM y una clave maestra en `.env`.
- **Persistencia (MongoDB):** Usar Mongoose para definir esquemas. Los logs de errores deben almacenarse en una colección dedicada para alimentar el Dashboard.
- **Seguridad API:** El panel de administración (Express) debe implementar JWT para autenticación y `helmet` para seguridad básica de headers.

## Convenciones de Archivos (RF-04, RF-05)
- **Estructura de Carpetas:** `/certificados/[AÑO]/[MM-NombreMes]/`.
- **Lógica de Fecha:** El bot se ejecuta el último día del mes $N$ para descargar el mes $N-1$.
- **Formato de Nombre:** `NombreCompleto_YYYY_MM.pdf`. Limpiar caracteres especiales y manejar colisiones con sufijos numéricos.

## Automatización y Frontend (RF-02, RF-06)
- **Framework:** Usar Playwright (preferido sobre Puppeteer por su mejor manejo de contextos).
- **Dashboard:** Debe reflejar en tiempo real el estado de la cola de descargas y el historial de errores recuperado de MongoDB.
- **Comunicación:** El backend debe exponer endpoints REST para que el frontend consulte el estado de las descargas y la última ejecución.

## Logging (RF-07)
- **Logs Duales:** Registrar errores críticos en archivos locales (`winston`) y el estado de las tareas en la colección `Logs` de MongoDB para visualización en el panel.

