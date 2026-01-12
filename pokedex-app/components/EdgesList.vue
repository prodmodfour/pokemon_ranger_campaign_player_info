<script setup lang="ts">
const props = defineProps<{
  searchQuery: string
}>()

const { edges } = useGameData()

const filteredEdges = computed(() => {
  const query = props.searchQuery.toLowerCase()
  if (!query) return edges.value
  return edges.value.filter(e =>
    e.name.toLowerCase().includes(query) ||
    e.prerequisites.toLowerCase().includes(query) ||
    e.effect.toLowerCase().includes(query)
  )
})
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="edge in filteredEdges"
      :key="edge.name"
      class="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-700"
    >
      <h3 class="font-semibold text-gray-100 mb-2">{{ edge.name }}</h3>
      <div v-if="edge.prerequisites" class="mb-2">
        <span class="text-xs text-gray-500">Prerequisites: </span>
        <span class="text-sm text-gray-400">{{ edge.prerequisites }}</span>
      </div>
      <p class="text-sm text-gray-300">{{ edge.effect }}</p>
    </div>
    <div v-if="!filteredEdges.length" class="text-center py-8 text-gray-400">
      No edges found matching "{{ searchQuery }}"
    </div>
  </div>
</template>
