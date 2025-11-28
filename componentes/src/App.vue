<template>
  <div>
    <CustomButton @accion="imprimir" colorFondo="salmon" textoColor="violet" nombreBoton="Guardar" ></CustomButton>
    <!-- <CustomButton colorFondo="yellow" textoColor="blue" nombreBoton="Editar"></CustomButton>
    <CustomButton colorFondo="purple" textoColor="blue" nombreBoton="Cancelar"></CustomButton>
    <CustomButton colorFondo="green" textoColor="blue" nombreBoton="Eliminar"></CustomButton>
    <CustomButton colorFondo="brown" textoColor="blue" nombreBoton="Enviar"></CustomButton> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import CustomButton from "./components/CustomButton.vue"

let colorbtn = ref("black")

function imprimir(){
  console.log("estoy imprimiendo...");
  
}

//Props = "Papá, ¿cómo quieres que me vea?" ( el componente hijo tiene una configuración)
// 1. Props: Padre → Hijo 📥El padre ENVÍA información al hijo
// Emit = "Papá, me clickearon, ¿qué hago?" (El hijo crea el emit y el padre establece la funcion que hace)
//2. Emit: Hijo → Padre 📤El hijo AVISA al padre que algo pasó

// Uso de emit
/* En el hijo: defineEmits(['onAction']) → Define el nombre del evento
En el hijo: emit('onAction') → Dispara ese evento
En el padre: @onAction="tuFuncion" → Escucha ese evento específico */

/* ventajas de componetizar
1. Reutilización ♻️
No escribir el mismo código una y otra vez
2. Mantenibilidad 🔧
Si necesitas cambiar algo, lo haces en UN solo lugar.
3. Consistencia 🎯
Todo se ve y funciona igual en toda la aplicación */

</script>