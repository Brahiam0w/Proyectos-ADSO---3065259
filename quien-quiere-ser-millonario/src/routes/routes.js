import { createRouter, createWebHashHistory } from "vue-router";
import Inicio from "../views/inicio.vue";
import Juego from "../views/juego.vue";

const routes = [
  { path: "/", component: Inicio },
  { path: "/juego", component: Juego }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
});
