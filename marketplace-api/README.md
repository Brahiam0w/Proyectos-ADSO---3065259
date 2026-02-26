Endpoints principales

Autenticación

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/api/auth/registro` | Público | Crear cuenta |
| POST | `/api/auth/login` | Público | Iniciar sesión |
| GET | `/api/auth/perfil` | Token | Ver mi perfil |
| PUT | `/api/auth/cambiar-password` | Token | Cambiar contraseña |

Productos

| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/productos` | Público | Listar con filtros |
| GET | `/api/productos/:id` | Público | Ver producto |
| POST | `/api/productos` | Vendedor/Admin | Crear producto |
| PUT | `/api/productos/:id` | Dueño/Admin | Actualizar |
| DELETE | `/api/productos/:id` | Dueño/Admin | Eliminar |
| POST | `/api/productos/:id/generar-descripcion-ia` | Vendedor | IA genera descripción |
| POST | `/api/productos/:id/preguntar` | Público | Pregunta a la IA |

Órdenes
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/api/ordenes` | Comprador | Crear orden |
| GET | `/api/ordenes` | Token | Mis órdenes |
| GET | `/api/ordenes/mis-estadisticas` |  Token | Estadísticas + IA |
| PATCH | `/api/ordenes/:id/estado` |  Admin | Cambiar estado |

Inteligencia Artificial
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/ia/generar-descripcion` | Genera descripción de producto |
| POST | `/api/ia/sugerir-categorias` | Sugiere categorías para un producto |
| POST | `/api/ia/analizar-precio` | Evalúa si el precio es competitivo |
