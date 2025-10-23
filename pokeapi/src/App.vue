<template>
  <div class="bg-[url('/src/assets/fondo.webp')] bg-cover bg-center h-screen flex justify-baseline align-middle">
    <div class="flex flex-col bg-white justify-center align-middle m-10 rounded-3xl p-[3%] w-[25%]">
      <p class="font-bold uppercase text-4xl text-center">{{ pokemon.name }}</p>

      <img
        v-if="pokemon.sprites"
        :src="pokemon.sprites.front_default"
        :alt="pokemon.name"
        class="w-72 h-72 justify-center align-middle self-center"
      />

      <div class="flex justify-between m-4">
        <p class="font-bold uppercase text-center">altura: {{ pokemon.height / 10 }}m</p>
        <p class="font-bold uppercase text-center">Peso: {{ pokemon.weight / 10 }}Kg</p>
      </div>

      <div v-if="pokemon.types?.length" class="h-10 rounded-2xl" :style="gradientStyle"></div>
    </div>

    <div class="flex flex-col w-[35%] p-4 justify-center gap-5">
      <p
        class="text-7xl uppercase text-black mb-6 bg-blue-200 p-2 rounded-2xl text-center w-full font-bold mx-auto"
      >
        #{{ pokemon.id }}
      </p>

      <input
        v-model="BusquedaNombreID"
        @keydown.enter="cargarPokemon"
        class="rounded-[5px] h-14 bg-white uppercase p-4 w-full text-center font-bold mx-auto"
        type="text"
        placeholder="Buscar pokemon por nombre o ID"
      />

      <button
        @click="cargarPokemon"
        class="cursor-pointer bg-emerald-500 m-4 h-12 w-[50%] justify-center flex flex-col mx-auto self-center rounded-2xl uppercase text-white text-xl text-center font-bold hover:scale-110 transition-transform duration-300"
      >
        buscar
      </button>

      <div class="flex flex-col bg-amber-500 mb-6 rounded-2xl w-full items-center p-4 mx-auto">
        <p class="text-white uppercase text-2xl self-center m-2 font-bold">tipos del pokemon</p>

        <p class="flex gap-3 justify-center align-middle flex-wrap">
          <span
            v-for="t in pokemon.types || []"
            :key="t.slot"
            :class="tipo(t.type.name)"
            class="px-6 p-3 rounded-full font-bold text-sm uppercase shadow-sm hover:scale-110 transition-transform duration-300 cursor-pointer"
          >
            {{ t.type.name }}
          </span>
        </p>

        <p class="text-white uppercase self-center m-2 text-2xl font-bold">debilidades del pokemon</p>

        <div class="flex gap-3 flex-wrap justify-center m-4 self-center">
          <span
            v-for="w in weaknesses"
            :key="w"
            :class="tipo(w)"
            class="px-4 py-2 rounded-full font-bold text-sm uppercase hover:scale-110 transition-transform duration-300 cursor-pointer"
          >
            {{ w }}
          </span>
          <span v-if="weaknesses.length === 0" class="text-gray-500"></span>
        </div>
      </div>
    </div>

    <div class="flex flex-col justify-center align-middle m-10 rounded-3xl p-[3%] w-[25%]">
      <div class="flex flex-col gap-4 bg-white p-10 rounded-2xl">
        <div class="hover:scale-110 transition-transform duration-300 cursor-pointer">
          <p class="font-bold uppercase mb-1">
            HP: {{ pokemon.stats?.find(i => i.stat.name === 'hp')?.base_stat || 0 }}/255
          </p>
          <div class="w-full bg-gray-200 rounded-xl h-5">
            <div
              class="bg-green-500 h-5 rounded-xl transition-all duration-500"
              :style="{ width: ((pokemon.stats?.find(i => i.stat.name === 'hp')?.base_stat || 0) / 255 * 100) + '%' }"
            ></div>
          </div>
        </div>

        <div class="hover:scale-110 transition-transform duration-300 cursor-pointer">
          <p class="font-bold uppercase text-black mb-1">
            Attack: {{ pokemon.stats?.find(i => i.stat.name === 'attack')?.base_stat || 0 }}/255
          </p>
          <div class="w-full bg-gray-200 rounded-xl h-5">
            <div
              class="bg-orange-500 h-5 rounded-xl transition-all duration-500"
              :style="{ width: ((pokemon.stats?.find(i => i.stat.name === 'attack')?.base_stat || 0) / 255 * 100) + '%' }"
            ></div>
          </div>
        </div>

        <div class="hover:scale-110 transition-transform duration-300 cursor-pointer">
          <p class="font-bold uppercase text-black mb-1">
            Defense: {{ pokemon.stats?.find(i => i.stat.name === 'defense')?.base_stat || 0 }}/255
          </p>
          <div class="w-full bg-gray-200 rounded-xl h-5">
            <div
              class="bg-yellow-400 h-5 rounded-xl transition-all duration-500"
              :style="{ width: ((pokemon.stats?.find(i => i.stat.name === 'defense')?.base_stat || 0) / 255 * 100) + '%' }"
            ></div>
          </div>
        </div>

        <div class="hover:scale-110 transition-transform duration-300 cursor-pointer">
          <p class="font-bold uppercase text-black mb-1">
            Sp. Attack: {{ pokemon.stats?.find(i => i.stat.name === 'special-attack')?.base_stat || 0 }}/255
          </p>
          <div class="w-full bg-gray-200 rounded-xl h-5">
            <div
              class="bg-red-400 h-5 rounded-xl transition-all duration-500"
              :style="{ width: ((pokemon.stats?.find(i => i.stat.name === 'special-attack')?.base_stat || 0) / 255 * 100) + '%' }"
            ></div>
          </div>
        </div>

        <div class="hover:scale-110 transition-transform duration-300 cursor-pointer">
          <p class="font-bold uppercase text-black mb-1">
            Sp. Defense: {{ pokemon.stats?.find(i => i.stat.name === 'special-defense')?.base_stat || 0 }}/255
          </p>
          <div class="w-full bg-gray-200 rounded-xl h-5">
            <div
              class="bg-blue-400 h-5 rounded-xl transition-all duration-500"
              :style="{ width: ((pokemon.stats?.find(i => i.stat.name === 'special-defense')?.base_stat || 0) / 255 * 100) + '%' }"
            ></div>
          </div>
        </div>

        <div class="hover:scale-110 transition-transform duration-300 cursor-pointer">
          <p class="font-bold uppercase text-black mb-1">
            Speed: {{ pokemon.stats?.find(i => i.stat.name === 'speed')?.base_stat || 0 }}/255
          </p>
          <div class="w-full bg-gray-200 rounded-xl h-5">
            <div
              class="bg-purple-500 h-5 rounded-xl transition-all duration-500"
              :style="{ width: ((pokemon.stats?.find(i => i.stat.name === 'speed')?.base_stat || 0) / 255 * 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed } from 'vue';

const BusquedaNombreID = ref('');
const pokemon = ref({});
const weaknesses = ref([]);

async function cargarPokemon() {
  try {
    const query = (BusquedaNombreID.value || '').toLowerCase().trim();
    if (!query) return;
    const url = `https://pokeapi.co/api/v2/pokemon/${query}`;
    const respuesta = await axios.get(url);
    pokemon.value = respuesta.data;
    await debilidades(pokemon.value.types || []);
  } catch (error) {
    console.error('Error al obtener el Pokémon:', error);
    pokemon.value = {};
    weaknesses.value = [];
  }
}

async function debilidades(typesArray) {
  const nombres = new Set();
  try {
    await Promise.all(
      (typesArray || []).map(async (t) => {
        if (!t.type?.url) return;
        const r = await axios.get(t.type.url);
        const dobles = r.data.damage_relations?.double_damage_from || [];
        dobles.forEach(d => nombres.add(d.name));
      })
    );
    weaknesses.value = Array.from(nombres);
  } catch (err) {
    console.error('Error al obtener debilidades', err);
    weaknesses.value = [];
  }
}

const typeColors = {
  normal: 'bg-gray-300 text-gray-800',
  fire: 'bg-red-400 text-white',
  water: 'bg-blue-400 text-white',
  electric: 'bg-yellow-300 text-gray-800',
  grass: 'bg-green-400 text-white',
  ice: 'bg-sky-200 text-gray-800',
  fighting: 'bg-orange-500 text-white',
  poison: 'bg-violet-400 text-white',
  ground: 'bg-amber-900 text-white',
  flying: 'bg-indigo-200 text-gray-800',
  psychic: 'bg-pink-400 text-white',
  bug: 'bg-lime-400 text-gray-800',
  rock: 'bg-stone-400 text-gray-800',
  ghost: 'bg-purple-700 text-white',
  dragon: 'bg-indigo-700 text-white',
  dark: 'bg-gray-700 text-white',
  steel: 'bg-slate-300 text-gray-800',
  fairy: 'bg-rose-300 text-gray-800'
};

const typeHex = {
  normal: ['#D1D5DB', '#9CA3AF'],
  fire: ['#FCA5A5', '#FB923C'],
  water: ['#93C5FD', '#60A5FA'],
  electric: ['#FDE68A', '#FACC15'],
  grass: ['#86EFAC', '#4ADE80'],
  ice: ['#BAE6FD', '#7DD3FC'],
  fighting: ['#FDBA74', '#FB923C'],
  poison: ['#C7B2F0', '#A78BFA'],
  ground: ['#D6A44A', '#B45309'],
  flying: ['#C7D2FE', '#A5B4FC'],
  psychic: ['#FBCFE8', '#F472B6'],
  bug: ['#BBF7D0', '#86EFAC'],
  rock: ['#E9D5CA', '#A78B5A'],
  ghost: ['#C084FC', '#7C3AED'],
  dragon: ['#6366F1', '#4338CA'],
  dark: ['#9CA3AF', '#4B5563'],
  steel: ['#E6E7E8', '#94A3B8'],
  fairy: ['#FFD6E7', '#FB7185']
};

function tipo(typeName) {
  const base = 'inline-flex items-center justify-center';
  const color = typeColors[typeName?.toLowerCase()] || 'bg-gray-200 text-gray-800';
  return `${base} ${color}`;
}

const gradientStyle = computed(() => {
  const types = pokemon.value.types?.map(t => t.type.name.toLowerCase()) || [];
  if (!types.length) return {};
  const first = types[0];
  const second = types[1];
  const hex1 = (typeHex[first] && typeHex[first][0]) || '#E5E7EB';
  const hex2 = (typeHex[second] && typeHex[second][1]) || null;

  if (!second || second === first) {
    return { background: `${hex1}` };
  }

  const hexSecond = hex2 || (typeHex[second] && typeHex[second][0]) || '#9CA3AF';
  return { background: `linear-gradient(to right, ${hex1}, ${hexSecond})` };
});
</script>

<style></style>
