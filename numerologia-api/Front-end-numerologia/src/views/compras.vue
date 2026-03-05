<template>
    <div class="q-pa-md">
        <q-table title="Usuarios" :rows="rows" :columns="columns" row-key="id">
            <template v-slot:body-cell-avatar="props">
                <q-td :props="props">
                    <q-avatar>
                        <img :src="props.row.avatar">
                    </q-avatar>
                </q-td>
            </template>
        </q-table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const rows = ref([])

const columns = ref([
    { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
    { name: 'nombre', align: 'left', label: 'Nombre', field: 'nombre', sortable: true },
    { name: 'edad', align: 'center', label: 'Edad', field: 'edad', sortable: true },
    { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
    { name: 'pais', align: 'left', label: 'País', field: 'pais', sortable: true },
    { name: 'profesion', align: 'left', label: 'Profesión', field: 'profesion', sortable: true },
    { name: 'avatar', align: 'center', label: 'Avatar', field: 'avatar' }
])

async function traerdatos() {
    try {
        // En Vite, para acceder a archivos locales con axios durante el desarrollo,
        // podemos usar la ruta relativa desde la raíz o importar el archivo.
        // Aquí usamos la ruta relativa al archivo JSON.
        const res = await axios.get('/src/api/usuarios.json')
        rows.value = res.data
        console.log("Datos cargados:", res.data)
    } catch (error) {
        console.error("Error al cargar los datos:", error)
    }
}

onMounted(() => {
    traerdatos()
})

</script>
