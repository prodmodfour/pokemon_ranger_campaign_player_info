<script setup lang="ts">
const props = defineProps<{
  searchQuery: string
}>()

const { pokeEdges } = useGameData()

const selectedCost = ref<string>('')

// Extract numeric cost from cost string like "1 Tutor Point"
const getCostNumber = (cost?: string) => {
  if (!cost) return 0
  const match = cost.match(/(\d+)/)
  return match ? parseInt(match[1]) : 0
}

const allCosts = computed(() => {
  const costSet = new Set<number>()
  pokeEdges.value.forEach(e => {
    if (e.cost) costSet.add(getCostNumber(e.cost))
  })
  return Array.from(costSet).sort((a, b) => a - b)
})

const filteredPokeEdges = computed(() => {
  let result = pokeEdges.value

  const query = props.searchQuery.toLowerCase()
  if (query) {
    result = result.filter(e =>
      e.name.toLowerCase().includes(query) ||
      e.prerequisites.toLowerCase().includes(query) ||
      e.effect.toLowerCase().includes(query)
    )
  }

  if (selectedCost.value) {
    result = result.filter(e => getCostNumber(e.cost) === parseInt(selectedCost.value))
  }

  return result.sort((a, b) => a.name.localeCompare(b.name))
})

const groupedPokeEdges = computed(() => {
  const groups: Record<number, typeof pokeEdges.value> = {}
  filteredPokeEdges.value.forEach(edge => {
    const cost = getCostNumber(edge.cost)
    if (!groups[cost]) groups[cost] = []
    groups[cost].push(edge)
  })
  return Object.entries(groups)
    .map(([cost, edges]) => [parseInt(cost), edges] as [number, typeof pokeEdges.value])
    .sort(([a], [b]) => a - b)
})

const getCostColor = (cost: number) => {
  switch (cost) {
    case 1: return '#22c55e'
    case 2: return '#3b82f6'
    case 3: return '#a855f7'
    default: return '#6b7280'
  }
}

const getCostClass = (cost: number) => {
  switch (cost) {
    case 1: return 'bg-green-900/50 text-green-300'
    case 2: return 'bg-blue-900/50 text-blue-300'
    case 3: return 'bg-purple-900/50 text-purple-300'
    default: return 'bg-gray-700 text-gray-300'
  }
}
</script>

<template>
  <div>
    <!-- Cost Filter -->
    <div class="mb-4 flex flex-wrap gap-2">
      <button
        @click="selectedCost = ''"
        class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
        :class="!selectedCost ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
      >
        All Costs
      </button>
      <button
        v-for="cost in allCosts"
        :key="cost"
        @click="selectedCost = cost.toString()"
        class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors text-white"
        :style="{ backgroundColor: selectedCost === cost.toString() ? getCostColor(cost) : undefined }"
        :class="selectedCost !== cost.toString() ? 'bg-gray-700 hover:bg-gray-600' : ''"
      >
        {{ cost }} Tutor Point{{ cost !== 1 ? 's' : '' }}
      </button>
    </div>

    <!-- Results count -->
    <div class="mb-4 text-sm text-gray-400">
      {{ filteredPokeEdges.length }} poke edges
    </div>

    <!-- Grouped Poke Edges -->
    <div class="space-y-6">
      <div v-for="[cost, costEdges] in groupedPokeEdges" :key="cost">
        <div class="flex items-center gap-2 mb-3 sticky top-32 bg-gray-900 py-2 z-10">
          <span
            class="px-3 py-1 rounded text-sm font-semibold text-white"
            :style="{ backgroundColor: getCostColor(cost) }"
          >{{ cost }} Tutor Point{{ cost !== 1 ? 's' : '' }}</span>
          <span class="text-sm text-gray-500">({{ costEdges.length }})</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div
            v-for="edge in costEdges"
            :key="edge.name"
            class="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-700"
          >
            <h3 class="font-semibold text-gray-100 mb-2">{{ edge.name }}</h3>
            <div v-if="edge.prerequisites && edge.prerequisites !== 'None'" class="mb-2">
              <span class="text-xs text-gray-500">Prerequisites: </span>
              <span class="text-sm text-gray-400">{{ edge.prerequisites }}</span>
            </div>
            <p class="text-sm text-gray-300">{{ edge.effect }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!filteredPokeEdges.length" class="text-center py-8 text-gray-400">
      No Poke Edges found
    </div>
  </div>
</template>
