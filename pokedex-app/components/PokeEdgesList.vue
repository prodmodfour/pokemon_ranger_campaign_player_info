<script setup lang="ts">
const props = defineProps<{
  searchQuery: string
}>()

const { pokeEdges } = useGameData()

const selectedTheme = ref<string>('')

// Categorize edges by theme based on name and prerequisites
const getTheme = (edge: { name: string; prerequisites: string; effect: string }) => {
  const name = edge.name.toLowerCase()
  const prereq = edge.prerequisites.toLowerCase()
  const effect = edge.effect.toLowerCase()

  // Capability enhancements - edges that require specific capabilities
  if (prereq.includes('capability') ||
      name.includes('bait') ||
      name.includes('invisibility') ||
      name.includes('reading') ||
      name.includes('threading') ||
      name.includes('seismometer') ||
      name.includes('tk mastery') ||
      name.includes('trail sniffer')) {
    return 'Capability Enhancement'
  }

  // Ability related
  if (name.includes('ability') || prereq.includes('ability') || name.includes('connection')) {
    return 'Abilities'
  }

  // Move training
  if (name.includes('accuracy') || effect.includes('move')) {
    return 'Move Training'
  }

  // Mobility and movement
  if (name.includes('mobility') || effect.includes('movement') || effect.includes('jump')) {
    return 'Mobility'
  }

  // Stats and growth
  if (name.includes('skill') ||
      name.includes('stat') ||
      name.includes('conflict') ||
      name.includes('potential') ||
      name.includes('training') ||
      effect.includes('stat')) {
    return 'Stats & Growth'
  }

  return 'General'
}

const allThemes = computed(() => {
  const themeSet = new Set<string>()
  pokeEdges.value.forEach(e => {
    themeSet.add(getTheme(e))
  })
  return Array.from(themeSet).sort()
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

  if (selectedTheme.value) {
    result = result.filter(e => getTheme(e) === selectedTheme.value)
  }

  return result.sort((a, b) => a.name.localeCompare(b.name))
})

const groupedPokeEdges = computed(() => {
  const groups: Record<string, typeof pokeEdges.value> = {}
  filteredPokeEdges.value.forEach(edge => {
    const theme = getTheme(edge)
    if (!groups[theme]) groups[theme] = []
    groups[theme].push(edge)
  })
  // Sort themes in a logical order
  const themeOrder = ['Stats & Growth', 'Abilities', 'Move Training', 'Mobility', 'Capability Enhancement', 'General']
  return Object.entries(groups).sort(([a], [b]) => {
    const aIdx = themeOrder.indexOf(a)
    const bIdx = themeOrder.indexOf(b)
    if (aIdx === -1 && bIdx === -1) return a.localeCompare(b)
    if (aIdx === -1) return 1
    if (bIdx === -1) return -1
    return aIdx - bIdx
  })
})

const getThemeColor = (theme: string) => {
  switch (theme) {
    case 'Stats & Growth': return '#22c55e'
    case 'Abilities': return '#a855f7'
    case 'Move Training': return '#ef4444'
    case 'Mobility': return '#3b82f6'
    case 'Capability Enhancement': return '#f59e0b'
    case 'General': return '#6b7280'
    default: return '#6b7280'
  }
}

// Extract numeric cost from cost string like "1 Tutor Point"
const getCostNumber = (cost?: string) => {
  if (!cost) return 0
  const match = cost.match(/(\d+)/)
  return match ? parseInt(match[1]) : 0
}

const getCostClass = (cost: number) => {
  switch (cost) {
    case 1: return 'bg-green-900/50 text-green-300'
    case 2: return 'bg-blue-900/50 text-red-300'
    case 3: return 'bg-purple-900/50 text-purple-300'
    default: return 'bg-zinc-900 text-gray-300'
  }
}
</script>

<template>
  <div>
    <!-- Theme Filter -->
    <div class="mb-4 flex flex-wrap gap-2">
      <button
        @click="selectedTheme = ''"
        class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
        :class="!selectedTheme ? 'bg-red-600 text-white' : 'bg-zinc-900 text-gray-300 hover:bg-gray-800'"
      >
        All Themes
      </button>
      <button
        v-for="theme in allThemes"
        :key="theme"
        @click="selectedTheme = theme"
        class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors text-white"
        :style="{ backgroundColor: getThemeColor(theme) }"
        :class="selectedTheme === theme ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : 'opacity-70 hover:opacity-100'"
      >
        {{ theme }}
      </button>
    </div>

    <!-- Results count -->
    <div class="mb-4 text-sm text-gray-400">
      {{ filteredPokeEdges.length }} poke edges
    </div>

    <!-- Grouped Poke Edges -->
    <div class="space-y-6">
      <div v-for="[theme, themeEdges] in groupedPokeEdges" :key="theme">
        <div class="flex items-center gap-2 mb-3 sticky top-[41px] bg-black py-2 z-10">
          <span
            class="px-3 py-1 rounded text-sm font-semibold text-white"
            :style="{ backgroundColor: getThemeColor(theme) }"
          >{{ theme }}</span>
          <span class="text-sm text-gray-500">({{ themeEdges.length }})</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div
            v-for="edge in themeEdges"
            :key="edge.name"
            class="bg-zinc-900 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-800"
          >
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="font-semibold text-gray-100">{{ edge.name }}</h3>
              <span
                class="px-2 py-0.5 rounded text-xs font-medium flex-shrink-0"
                :class="getCostClass(getCostNumber(edge.cost))"
              >{{ edge.cost }}</span>
            </div>
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
