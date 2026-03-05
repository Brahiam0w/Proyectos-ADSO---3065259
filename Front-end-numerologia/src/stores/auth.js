import { defineStore } from "pinia";
import { ref, watch } from "vue";
import api from "../api/axios";

export const useAuthStore = defineStore("auth", () => {
    const user = ref(JSON.parse(localStorage.getItem("user")) || null);
    const token = ref(localStorage.getItem("token") || null);
    const loading = ref(false);
    const error = ref(null);

    // Sincronizar con localStorage manualmente para mayor seguridad
    watch(user, (newUser) => {
        if (newUser) localStorage.setItem("user", JSON.stringify(newUser));
        else localStorage.removeItem("user");
    }, { deep: true });

    const login = async (email, password) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.post("/auth/login", { email, password });
            if (response.data.success) {
                user.value = response.data.usuario;
                token.value = response.data.token;
                localStorage.setItem("token", token.value);
                return { success: true };
            }
            return { success: false, mensaje: response.data.mensaje };
        } catch (err) {
            error.value = err.response?.data?.mensaje || "Error de conexión";
            return { success: false, mensaje: error.value };
        } finally {
            loading.value = false;
        }
    };

    const register = async (userData) => {
        loading.value = true;
        try {
            const response = await api.post("/auth/registro", userData);
            if (response.data.success) {
                user.value = response.data.usuario;
                token.value = response.data.token;
                localStorage.setItem("token", token.value);
                return { success: true };
            }
            return { success: false, mensaje: response.data.mensaje };
        } catch (err) {
            return { success: false, mensaje: err.response?.data?.mensaje || "Error" };
        } finally {
            loading.value = false;
        }
    };

    const logout = () => {
        user.value = null;
        token.value = null;
        localStorage.clear();
    };

    return { user, token, loading, error, login, register, logout };
}, {
    persist: true,
});
