import { createRouter, createWebHashHistory } from "vue-router";
import Inicio from "../views/inicio.vue";
import Categoria from "../views/categoria.vue";
import Juego from "../views/juego.vue";
import Puntaje from "../views/puntaje.vue";

const routes = [
  { path: "/", component: Inicio },
  { path: "/categoria", component: Categoria },
  { path: "/juego", component: Juego },
  { path: "/puntaje", component: Puntaje }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});
