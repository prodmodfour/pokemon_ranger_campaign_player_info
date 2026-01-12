<script setup lang="ts">
const props = defineProps<{
  searchQuery: string
}>()

const { edges } = useGameData()

const selectedLetter = ref<string>('')

const allLetters = computed(() => {
  const letterSet = new Set<string>()
  edges.value.forEach(e => {
    const first = e.name.charAt(0).toUpperCase()
    if (first.match(/[A-Z]/)) letterSet.add(first)
  })
  return Array.from(letterSet).sort()
})

const filteredEdges = computed(() => {
  let result = edges.value

  const query = props.searchQuery.toLowerCase()
  if (query) {
    result = result.filter(e =>
      e.name.toLowerCase().includes(query) ||
      e.prerequisites.toLowerCase().includes(query) ||
      e.effect.toLowerCase().includes(query)
    )
  }

  if (selectedLetter.value) {
    result = result.filter(e => e.name.charAt(0).toUpperCase() === selectedLetter.value)
  }

  return result.sort((a, b) => a.name.localeCompare(b.name))
})

const groupedEdges = computed(() => {
  const groups: Record<string, typeof edges.value> = {}
  filteredEdges.value.forEach(edge => {
    const letter = edge.name.charAt(0).toUpperCase()
    if (!groups[letter]) groups[letter] = []
    groups[letter].push(edge)
  })
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
})

const getPrerequisiteColor = (prereq: string) => {
  if (prereq.toLowerCase() === 'none') return 'bg-green-900/50 text-green-300'
  if (prereq.toLowerCase().includes('level')) return 'bg-yellow-900/50 text-yellow-300'
  if (prereq.toLowerCase().includes('master')) return 'bg-purple-900/50 text-purple-300'
  if (prereq.toLowerCase().includes('expert')) return 'bg-blue-900/50 text-blue-300'
  if (prereq.toLowerCase().includes('adept')) return 'bg-cyan-900/50 text-cyan-300'
  return 'bg-gray-700 text-gray-300'
}
</script>

<template>
  <div>
    <!-- Letter Filter -->
    <div class="mb-4 flex flex-wrap gap-1">
      <button
        @click="selectedLetter = ''"
        class="px-3 py-1.5 rounded text-sm font-medium transition-colors"
        :class="!selectedLetter ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
      >
        All
      </button>
      <button
        v-for="letter in allLetters"
        :key="letter"
        @click="selectedLetter = letter"
        class="w-8 h-8 rounded text-sm font-medium transition-colors flex items-center justify-center"
        :class="selectedLetter === letter ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
      >
        {{ letter }}
      </button>
    </div>

    <!-- Results count -->
    <div class="mb-4 text-sm text-gray-400">
      {{ filteredEdges.length }} edges
    </div>

    <!-- Grouped Edges -->
    <div class="space-y-6">
      <div v-for="[letter, letterEdges] in groupedEdges" :key="letter">
        <div class="flex items-center gap-2 mb-3 sticky top-32 bg-gray-900 py-2 z-10">
          <span class="w-8 h-8 rounded bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
            {{ letter }}
          </span>
          <span class="text-sm text-gray-500">({{ letterEdges.length }})</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div
            v-for="edge in letterEdges"
            :key="edge.name"
            class="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-700"
          >
            <h3 class="font-semibold text-gray-100 mb-2">{{ edge.name }}</h3>
            <div v-if="edge.prerequisites" class="mb-2">
              <span
                class="px-2 py-0.5 rounded text-xs font-medium"
                :class="getPrerequisiteColor(edge.prerequisites)"
              >{{ edge.prerequisites }}</span>
            </div>
            <p class="text-sm text-gray-300">{{ edge.effect }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!filteredEdges.length" class="text-center py-8 text-gray-400">
      No edges found
    </div>
  </div>
</template>
