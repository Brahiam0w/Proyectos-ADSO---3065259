import Compras from "../views/compras.vue"
import Ventas from "../views/ventas.vue"
import Registro from "../views/registro.vue"
import Login from "../views/Login.vue"
import Perfil from "../views/perfil.vue"
import Historial from "../views/historial_lecturas.vue"
import Planes from "../views/planes.vue"
import Lecturas from "../views/lecturas.vue"
import GestionUsuarios from "../views/gestio_usuario.vue"
import Gestion_planes from "../views/gestion_planes.vue"
import RecuperarContraseña from "../views/recuperar_contraseña.vue"
import RestablecerPassword from "../views/restablecer-password.vue"
import ConfiguracionPerfil from "../views/configuracion-perfil.vue"
import AdminPerfil from "../views/admin-perfil.vue"
import { createRouter, createWebHashHistory } from "vue-router"


const routes = [
    {path:"/", component:Login},
    {path:"/compras", component:Compras},
    {path:"/ventas", component:Ventas},
    {path:"/registro", component:Registro},
    {path:"/perfil", component:Perfil},
    {path:"/historial", component:Historial},
    {path:"/planes", component:Planes},
    {path:"/Lecturas", component:Lecturas},
    {path:"/GestionUsuarios", component:GestionUsuarios},
    {path:"/GestionPlanes", component:Gestion_planes},
    {path:"/RecuperarContrasena", component:RecuperarContraseña},
    {path:"/recuperar-password/:token", component:RestablecerPassword},
    {path:"/configuracion", component:ConfiguracionPerfil},
    {path:"/AdminPerfil", component:AdminPerfil}
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})
