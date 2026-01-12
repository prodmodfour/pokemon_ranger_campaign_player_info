<script setup lang="ts">
import type { Pokemon } from '~/composables/usePokedex'

const props = defineProps<{
  pokemon: Pokemon
}>()

const emit = defineEmits<{
  click: [pokemon: Pokemon]
}>()

const { getTypeColor } = usePokedex()

const primaryColor = computed(() => {
  return props.pokemon.types[0] ? getTypeColor(props.pokemon.types[0]) : '#888888'
})

const totalStats = computed(() => {
  const stats = props.pokemon.baseStats
  return (stats.hp || 0) + (stats.attack || 0) + (stats.defense || 0) +
         (stats.special_attack || 0) + (stats.special_defense || 0) + (stats.speed || 0)
})

// Generate sprite URL from Pokemon name (Black 2/White 2 animated sprites)
const spriteUrl = computed(() => {
  const name = props.pokemon.name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '') // Remove special chars
    .replace(/♀/g, '-f')
    .replace(/♂/g, '-m')
  return `https://img.pokemondb.net/sprites/black-white/anim/normal/${name}.gif`
})

const imgError = ref(false)
const handleImgError = () => {
  imgError.value = true
}
</script>

<template>
  <div
    @click="emit('click', pokemon)"
    class="bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden border border-gray-700 hover:border-gray-500 group"
  >
    <!-- Header with gradient background -->
    <div
      class="h-2"
      :style="{ background: `linear-gradient(90deg, ${primaryColor}, ${pokemon.types[1] ? getTypeColor(pokemon.types[1]) : primaryColor})` }"
    />

    <div class="p-4">
      <!-- Sprite Image -->
      <div class="flex justify-center mb-2">
        <div class="w-20 h-20 flex items-center justify-center">
          <img
            v-if="!imgError"
            :src="spriteUrl"
            :alt="pokemon.name"
            class="max-w-full max-h-full object-contain drop-shadow-lg"
            loading="lazy"
            @error="handleImgError"
          />
          <div
            v-else
            class="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
            :style="{ backgroundColor: primaryColor }"
          >
            {{ pokemon.name.charAt(0) }}
          </div>
        </div>
      </div>

      <!-- Name and Types -->
      <div class="flex items-start justify-between mb-2">
        <h3 class="font-bold text-gray-100 text-base group-hover:text-blue-400 transition-colors">
          {{ pokemon.name }}
        </h3>
      </div>

      <!-- Type Badges -->
      <div class="flex gap-1.5 mb-3">
        <TypeBadge
          v-for="type in pokemon.types"
          :key="type"
          :type="type"
        />
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-3 gap-2 text-xs">
        <div class="text-center p-1.5 bg-gray-700 rounded">
          <div class="text-gray-400">HP</div>
          <div class="font-semibold text-gray-200">{{ pokemon.baseStats.hp || '?' }}</div>
        </div>
        <div class="text-center p-1.5 bg-gray-700 rounded">
          <div class="text-gray-400">ATK</div>
          <div class="font-semibold text-gray-200">{{ pokemon.baseStats.attack || '?' }}</div>
        </div>
        <div class="text-center p-1.5 bg-gray-700 rounded">
          <div class="text-gray-400">DEF</div>
          <div class="font-semibold text-gray-200">{{ pokemon.baseStats.defense || '?' }}</div>
        </div>
        <div class="text-center p-1.5 bg-gray-700 rounded">
          <div class="text-gray-400">SpA</div>
          <div class="font-semibold text-gray-200">{{ pokemon.baseStats.special_attack || '?' }}</div>
        </div>
        <div class="text-center p-1.5 bg-gray-700 rounded">
          <div class="text-gray-400">SpD</div>
          <div class="font-semibold text-gray-200">{{ pokemon.baseStats.special_defense || '?' }}</div>
        </div>
        <div class="text-center p-1.5 bg-gray-700 rounded">
          <div class="text-gray-400">SPD</div>
          <div class="font-semibold text-gray-200">{{ pokemon.baseStats.speed || '?' }}</div>
        </div>
      </div>

      <!-- Size & Total -->
      <div class="mt-3 flex justify-between text-xs text-gray-400">
        <span>{{ pokemon.size.sizeClass || 'Unknown' }}</span>
        <span>BST: {{ totalStats }}</span>
      </div>
    </div>
  </div>
</template>
