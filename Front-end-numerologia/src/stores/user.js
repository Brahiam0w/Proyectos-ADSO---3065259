import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../api/axios";
import { useAuthStore } from "./auth";

export const useUserStore = defineStore("user", () => {
    const loading = ref(false);
    const error = ref(null);
    const authStore = useAuthStore();

    const actualizarPerfil = async (userData) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.put("/usuarios/perfil", userData);
            if (response.data.success) {
                // Actualizar el usuario en el authStore
                authStore.user = response.data.usuario;
                return { success: true, mensaje: response.data.mensaje };
            }
        } catch (err) {
            error.value = err.response?.data?.mensaje || "Error al actualizar perfil";
            return { success: false, mensaje: error.value };
        } finally {
            loading.value = false;
        }
    };

    const cambiarPassword = async (passwordData) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.put("/usuarios/perfil/password", passwordData);
            if (response.data.success) {
                return { success: true, mensaje: response.data.mensaje };
            }
        } catch (err) {
            error.value = err.response?.data?.mensaje || "Error al cambiar contraseña";
            return { success: false, mensaje: error.value };
        } finally {
            loading.value = false;
        }
    };

    const eliminarCuenta = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.delete("/usuarios/perfil/desactivar");
            if (response.data.success) {
                authStore.logout();
                return { success: true };
            }
        } catch (err) {
            error.value = err.response?.data?.mensaje || "Error al desactivar la cuenta";
            return { success: false, mensaje: error.value };
        } finally {
            loading.value = false;
        }
    };

    const activarPlan = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.post("/usuarios/perfil/activar-plan");
            if (response.data.success) {
                authStore.user = response.data.usuario;
                return { success: true, mensaje: response.data.mensaje };
            }
        } catch (err) {
            error.value = err.response?.data?.mensaje || "Error al activar el plan";
            return { success: false, mensaje: error.value };
        } finally {
            loading.value = false;
        }
    };

    const suspenderPlan = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.post("/usuarios/perfil/suspender-plan");
            if (response.data.success) {
                authStore.user = response.data.usuario;
                return { success: true, mensaje: response.data.mensaje };
            }
        } catch (err) {
            error.value = err.response?.data?.mensaje || "Error al suspender el plan";
            return { success: false, mensaje: error.value };
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        error,
        actualizarPerfil,
        cambiarPassword,
        eliminarCuenta,
        activarPlan,
        suspenderPlan
    };
});
