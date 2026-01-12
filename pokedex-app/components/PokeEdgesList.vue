<script setup lang="ts">
const props = defineProps<{
  searchQuery: string
}>()

const { pokeEdges } = useGameData()

const filteredPokeEdges = computed(() => {
  const query = props.searchQuery.toLowerCase()
  if (!query) return pokeEdges.value
  return pokeEdges.value.filter(e =>
    e.name.toLowerCase().includes(query) ||
    e.prerequisites.toLowerCase().includes(query) ||
    e.effect.toLowerCase().includes(query)
  )
})
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="edge in filteredPokeEdges"
      :key="edge.name"
      class="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-700"
    >
      <div class="flex items-start justify-between gap-2 mb-2">
        <h3 class="font-semibold text-gray-100">{{ edge.name }}</h3>
        <span
          v-if="edge.cost"
          class="px-2 py-0.5 rounded text-xs font-medium bg-amber-900/50 text-amber-300 flex-shrink-0"
        >{{ edge.cost }}</span>
      </div>
      <div v-if="edge.prerequisites" class="mb-2">
        <span class="text-xs text-gray-500">Prerequisites: </span>
        <span class="text-sm text-gray-400">{{ edge.prerequisites }}</span>
      </div>
      <p class="text-sm text-gray-300">{{ edge.effect }}</p>
    </div>
    <div v-if="!filteredPokeEdges.length" class="text-center py-8 text-gray-400">
      No Poke Edges found matching "{{ searchQuery }}"
    </div>
  </div>
</template>
