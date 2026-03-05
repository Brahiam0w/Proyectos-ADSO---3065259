import { defineStore } from "pinia";
import { ref } from "vue";

export const useGeneralStore = defineStore("general", () => {
    // State: Las variables reactivas (ref o reactive)
    let contador = ref(23);

    // Getters: Serían propiedades computadas (computed)
    // Actions: Serían funciones normales

    function incrementar() {
        contador.value++;
    }

    function decrementar() {
        contador.value--;
    }



    return { 
        contador, incrementar, decrementar
    };


},
    {persist: true,}
);