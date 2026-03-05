Endpoints

AUTH: /api/auth

POST /registro - Público - Registrar nuevo usuario (rol: usuario)

POST /login - Público - Iniciar sesión y retorna JWT

GET /perfil - Auth - Ver perfil del usuario autenticado

POST /crear-admin - Admin - Crear un nuevo administrador






USUARIOS: /api/usuarios

GET / - Admin - Listar todos los usuarios

GET /:id - Admin / Propio - Obtener usuario por ID

PUT /:id - Admin / Propio - Actualizar datos del usuario

PATCH /:id/estado - Admin - Cambiar estado (activo/inactivo)

DELETE /:id - Admin - Eliminar usuario

PAGOS Y MEMBRESÍAS: /api/pagos

GET / - Admin - Listar todos los pagos

POST / - Admin / Propio - Registrar pago (activa membresía 30 días)

GET /:usuario_id - Admin / Propio - Ver pagos de un usuario

GET /estado/:usuario_id - Admin / Propio - Ver estado de membresía





LECTURAS: /api/lecturas

POST /principal/:usuario_id - Auth - Generar lectura principal (solo 1 vez)

POST /diaria/:usuario_id - Activo - Generar lectura diaria (requiere membresía)

GET /usuario/:usuario_id - Admin / Propio - Ver todas las lecturas de un usuario

GET /:id - Admin / Propio - Ver una lectura específica



usuarios de prueba:

email: brahiamjavierr@gmail.com
contraseña: Usuario1


admins de prueba:

email: brahiamjavierradmin@gmail.com
contraseña: Usuario1



Cálculo Numerológico

Número de Camino de Vida (Lectura Principal):
Suma de todos los dígitos de la fecha de nacimiento, reducida hasta 1-9 o número maestro (11, 22, 33).
Ejemplo: 15/06/1990
1+5+0+6+1+9+9+0 = 31 -> 3+1 = 4 (El Constructor)
