import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../api/axios";

export const useLecturaStore = defineStore("lectura", () => {
    const lecturas = ref([]);
    const lecturaActual = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const generarLecturaPrincipal = async (usuarioId) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.post(`/lecturas/principal/${usuarioId}`);
            if (response.data.success) {
                lecturaActual.value = response.data.lectura;
                return { success: true, lectura: response.data.lectura, mensaje: response.data.mensaje };
            } else {
                error.value = response.data.mensaje;
                return { success: false, mensaje: error.value };
            }
        } catch (err) {
            error.value = err.response?.data?.mensaje || "Error al generar la lectura";
            return { success: false, mensaje: error.value };
        } finally {
            loading.value = false;
        }
    };

    const generarLecturaDiaria = async (usuarioId) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.post(`/lecturas/diaria/${usuarioId}`);
            if (response.data.success) {
                lecturaActual.value = response.data.lectura;
                return { success: true, lectura: response.data.lectura, mensaje: response.data.mensaje };
            } else {
                error.value = response.data.mensaje;
                return { success: false, mensaje: error.value };
            }
        } catch (err) {
            error.value = err.response?.data?.mensaje || "Error al generar la lectura diaria";
            return { success: false, mensaje: error.value, estado: err.response?.data?.estado };
        } finally {
            loading.value = false;
        }
    };

    const obtenerLecturasUsuario = async (usuarioId) => {
        loading.value = true;
        try {
            const response = await api.get(`/lecturas/usuario/${usuarioId}`);
            if (response.data.success) {
                lecturas.value = response.data.lecturas;
            }
        } catch (err) {
            console.error("Error al obtener lecturas:", err);
        } finally {
            loading.value = false;
        }
    };

    return {
        lecturas,
        lecturaActual,
        loading,
        error,
        generarLecturaPrincipal,
        generarLecturaDiaria,
        obtenerLecturasUsuario
    };
});
