<script setup lang="ts">
const props = defineProps<{
  searchQuery: string
}>()

const { moves, types } = useDefinitions()
const { getTypeColor } = usePokedex()

const filteredMoves = computed(() => {
  const query = props.searchQuery.toLowerCase()
  if (!query) return moves.value
  return moves.value.filter(m =>
    m.name.toLowerCase().includes(query) ||
    m.type?.toLowerCase().includes(query)
  )
})
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="move in filteredMoves"
      :key="move.name"
      class="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-700"
    >
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-semibold text-gray-100">{{ move.name }}</h3>
        <span
          v-if="move.type"
          class="px-2 py-0.5 rounded text-xs font-semibold text-white"
          :style="{ backgroundColor: getTypeColor(move.type) }"
        >{{ move.type }}</span>
      </div>
      <p v-if="move.effect" class="text-sm text-gray-400">{{ move.effect }}</p>
      <div v-if="move.frequency || move.damage || move.ac" class="mt-2 flex flex-wrap gap-2 text-xs">
        <span v-if="move.frequency" class="px-2 py-1 bg-gray-700 rounded text-gray-300">{{ move.frequency }}</span>
        <span v-if="move.ac" class="px-2 py-1 bg-gray-700 rounded text-gray-300">AC: {{ move.ac }}</span>
        <span v-if="move.damage" class="px-2 py-1 bg-gray-700 rounded text-gray-300">{{ move.damage }}</span>
      </div>
    </div>
    <div v-if="!filteredMoves.length" class="text-center py-8 text-gray-400">
      No moves found matching "{{ searchQuery }}"
    </div>
  </div>
</template>
