<script setup lang="ts">
import movesData from '~/data/moves.json'

interface Move {
  name: string
  type: string
  category: string
  damageBase: string
  frequency: string
  ac: string
  range: string
  effects: string
  contestStats: string
  abilityInteractions?: string[]
}

const props = defineProps<{
  searchQuery: string
}>()

const { getTypeColor } = usePokedex()

const moves = ref<Move[]>(movesData as Move[])
const selectedType = ref<string>('')
const selectedCategory = ref<string>('')

const allTypes = computed(() => {
  const typeSet = new Set<string>()
  moves.value.forEach(m => {
    if (m.type) typeSet.add(m.type)
  })
  return Array.from(typeSet).sort()
})

const filteredMoves = computed(() => {
  let result = moves.value

  const query = props.searchQuery.toLowerCase()
  if (query) {
    result = result.filter(m =>
      m.name?.toLowerCase().includes(query) ||
      m.type?.toLowerCase().includes(query) ||
      m.category?.toLowerCase().includes(query) ||
      m.effects?.toLowerCase().includes(query)
    )
  }

  if (selectedType.value) {
    result = result.filter(m => m.type === selectedType.value)
  }

  if (selectedCategory.value) {
    result = result.filter(m => m.category === selectedCategory.value)
  }

  return result.sort((a, b) => a.name.localeCompare(b.name))
})
</script>

<template>
  <div>
    <!-- Filters -->
    <div class="mb-6 space-y-3">
      <!-- Type Filter -->
      <div class="flex flex-wrap gap-2">
        <button
          @click="selectedType = ''"
          class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
          :class="!selectedType ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
        >
          All Types
        </button>
        <button
          v-for="type in allTypes"
          :key="type"
          @click="selectedType = type"
          class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors text-white"
          :style="{ backgroundColor: selectedType === type ? getTypeColor(type) : undefined }"
          :class="selectedType !== type ? 'bg-gray-700 hover:bg-gray-600' : ''"
        >
          {{ type }}
        </button>
      </div>

      <!-- Category Filter -->
      <div class="flex gap-2">
        <button
          @click="selectedCategory = ''"
          class="px-3 py-1.5 rounded text-sm font-medium transition-colors"
          :class="!selectedCategory ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
        >
          All
        </button>
        <button
          @click="selectedCategory = 'Physical'"
          class="px-3 py-1.5 rounded text-sm font-medium transition-colors"
          :class="selectedCategory === 'Physical' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
        >
          Physical
        </button>
        <button
          @click="selectedCategory = 'Special'"
          class="px-3 py-1.5 rounded text-sm font-medium transition-colors"
          :class="selectedCategory === 'Special' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
        >
          Special
        </button>
        <button
          @click="selectedCategory = 'Status'"
          class="px-3 py-1.5 rounded text-sm font-medium transition-colors"
          :class="selectedCategory === 'Status' ? 'bg-gray-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
        >
          Status
        </button>
      </div>
    </div>

    <!-- Results count -->
    <div class="mb-4 text-sm text-gray-400">
      {{ filteredMoves.length }} moves
    </div>

    <!-- Moves Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-800 text-gray-300 sticky top-0">
          <tr>
            <th class="text-left px-3 py-2 font-medium">Name</th>
            <th class="text-left px-3 py-2 font-medium">Type</th>
            <th class="text-left px-3 py-2 font-medium">Class</th>
            <th class="text-center px-3 py-2 font-medium">DB</th>
            <th class="text-center px-3 py-2 font-medium">AC</th>
            <th class="text-left px-3 py-2 font-medium">Freq</th>
            <th class="text-left px-3 py-2 font-medium">Range</th>
            <th class="text-left px-3 py-2 font-medium">Effect</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr
            v-for="move in filteredMoves"
            :key="move.name"
            class="hover:bg-gray-800/50 transition-colors"
          >
            <td class="px-3 py-2 font-medium whitespace-nowrap">
              <NuxtLink
                :to="`/moves/${encodeURIComponent(move.name.replace(/ /g, '-'))}`"
                class="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                {{ move.name }}
              </NuxtLink>
            </td>
            <td class="px-3 py-2">
              <span
                class="px-2 py-0.5 rounded text-xs font-semibold text-white"
                :style="{ backgroundColor: getTypeColor(move.type) }"
              >{{ move.type }}</span>
            </td>
            <td class="px-3 py-2">
              <span
                class="px-2 py-0.5 rounded text-xs font-medium"
                :class="{
                  'bg-red-900/50 text-red-300': move.category === 'Physical',
                  'bg-blue-900/50 text-blue-300': move.category === 'Special',
                  'bg-gray-600/50 text-gray-300': move.category === 'Status'
                }"
              >{{ move.category }}</span>
            </td>
            <td class="px-3 py-2 text-center text-gray-300 font-mono">{{ move.damageBase }}</td>
            <td class="px-3 py-2 text-center text-gray-300 font-mono">{{ move.ac }}</td>
            <td class="px-3 py-2 text-gray-300 whitespace-nowrap">{{ move.frequency }}</td>
            <td class="px-3 py-2 text-gray-400 text-xs max-w-[150px]">{{ move.range }}</td>
            <td class="px-3 py-2 text-gray-400 text-xs max-w-md">
              <div class="line-clamp-2">{{ move.effects }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!filteredMoves.length" class="text-center py-8 text-gray-400">
      No moves found
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
