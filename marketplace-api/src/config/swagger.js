const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🛒 Marketplace Inteligente API',
      version: '1.0.0',
      description: `
## API completa para marketplace con integración de IA (Gemini)

### Cómo autenticarse:
1. Regístrate en \`POST /api/auth/registro\`
2. Haz login en \`POST /api/auth/login\` y copia el token
3. Haz click en el botón **Authorize 🔒** y pega el token

### Roles disponibles:
- **comprador**: puede ver productos y crear órdenes
- **vendedor**: puede publicar y gestionar sus productos
- **admin**: acceso total al sistema
      `.trim(),
      contact: {
        name: 'Soporte API',
        email: 'dev@marketplace.com'
      }
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Pega aquí el token obtenido en /api/auth/login'
        }
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '65a1b2c3d4e5f6789012345' },
            nombre: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'juan@ejemplo.com' },
            rol: { type: 'string', enum: ['comprador', 'vendedor', 'admin'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Producto: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            nombre: { type: 'string', example: 'iPhone 15 Pro' },
            descripcion: { type: 'string' },
            precio: { type: 'number', example: 999.99 },
            stock: { type: 'integer', example: 50 },
            imagen_url: { type: 'string' },
            vendedor: { $ref: '#/components/schemas/Usuario' },
            categoria: { $ref: '#/components/schemas/Categoria' }
          }
        },
        Categoria: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            nombre: { type: 'string', example: 'Electrónicos' },
            descripcion: { type: 'string' },
            imagen_icono: { type: 'string' }
          }
        },
        Orden: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            comprador: { $ref: '#/components/schemas/Usuario' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  producto: { type: 'string' },
                  nombre_producto: { type: 'string' },
                  cantidad: { type: 'integer' },
                  precio_unitario: { type: 'number' },
                  subtotal: { type: 'number' }
                }
              }
            },
            total: { type: 'number' },
            estado: { type: 'string', enum: ['pendiente', 'confirmada', 'enviada', 'entregada', 'cancelada'] }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'boolean', example: true },
            mensaje: { type: 'string', example: 'Descripción del error' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // Lee las anotaciones @swagger de los archivos de rutas
};

const specs = swaggerJsdoc(options);

const swaggerOptions = {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { background: #1a1a2e; }
    .swagger-ui .topbar .download-url-wrapper { display: none; }
  `,
  customSiteTitle: 'Marketplace API Docs'
};

module.exports = { specs, swaggerUi, swaggerOptions };
