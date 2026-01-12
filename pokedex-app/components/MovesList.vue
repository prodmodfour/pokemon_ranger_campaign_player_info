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
          :class="!selectedType ? 'bg-white text-gray-900 ring-2 ring-white' : 'bg-zinc-900 text-gray-300 hover:bg-gray-800'"
        >
          All Types
        </button>
        <button
          v-for="type in allTypes"
          :key="type"
          @click="selectedType = type"
          class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors text-white"
          :style="{ backgroundColor: getTypeColor(type) }"
          :class="selectedType === type ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : 'opacity-70 hover:opacity-100'"
        >
          {{ type }}
        </button>
      </div>

      <!-- Category Filter -->
      <div class="flex gap-2">
        <button
          @click="selectedCategory = ''"
          class="px-3 py-1.5 rounded text-sm font-medium transition-colors"
          :class="!selectedCategory ? 'bg-red-600 text-white' : 'bg-zinc-900 text-gray-300 hover:bg-gray-800'"
        >
          All
        </button>
        <button
          @click="selectedCategory = 'Physical'"
          class="px-3 py-1.5 rounded text-sm font-medium transition-colors"
          :class="selectedCategory === 'Physical' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-gray-300 hover:bg-gray-800'"
        >
          Physical
        </button>
        <button
          @click="selectedCategory = 'Special'"
          class="px-3 py-1.5 rounded text-sm font-medium transition-colors"
          :class="selectedCategory === 'Special' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-gray-300 hover:bg-gray-800'"
        >
          Special
        </button>
        <button
          @click="selectedCategory = 'Status'"
          class="px-3 py-1.5 rounded text-sm font-medium transition-colors"
          :class="selectedCategory === 'Status' ? 'bg-gray-500 text-white' : 'bg-zinc-900 text-gray-300 hover:bg-gray-800'"
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
      <table class="w-full text-sm table-fixed">
        <thead class="bg-zinc-900 text-gray-300 sticky top-0">
          <tr>
            <th class="text-left px-2 py-2 font-medium w-28">Name</th>
            <th class="text-left px-2 py-2 font-medium w-20">Type</th>
            <th class="text-left px-2 py-2 font-medium w-16">Class</th>
            <th class="text-center px-2 py-2 font-medium w-10">DB</th>
            <th class="text-center px-2 py-2 font-medium w-10">AC</th>
            <th class="text-left px-2 py-2 font-medium w-16">Freq</th>
            <th class="text-left px-2 py-2 font-medium w-24">Range</th>
            <th class="text-left px-2 py-2 font-medium">Effect</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr
            v-for="move in filteredMoves"
            :key="move.name"
            class="hover:bg-zinc-900/50 transition-colors align-top"
          >
            <td class="px-2 py-2 font-medium">
              <NuxtLink
                :to="`/moves/${encodeURIComponent(move.name.replace(/ /g, '-'))}`"
                class="text-red-400 hover:text-red-300 hover:underline transition-colors"
              >
                {{ move.name }}
              </NuxtLink>
            </td>
            <td class="px-2 py-2">
              <span
                class="px-2 py-0.5 rounded text-xs font-semibold text-white"
                :style="{ backgroundColor: getTypeColor(move.type) }"
              >{{ move.type }}</span>
            </td>
            <td class="px-2 py-2">
              <span
                class="px-2 py-0.5 rounded text-xs font-medium"
                :class="{
                  'bg-red-900/50 text-red-300': move.category === 'Physical',
                  'bg-blue-900/50 text-red-300': move.category === 'Special',
                  'bg-gray-800/50 text-gray-300': move.category === 'Status'
                }"
              >{{ move.category }}</span>
            </td>
            <td class="px-2 py-2 text-center text-gray-300 font-mono text-xs">{{ move.damageBase }}</td>
            <td class="px-2 py-2 text-center text-gray-300 font-mono text-xs">{{ move.ac }}</td>
            <td class="px-2 py-2 text-gray-300 text-xs">{{ move.frequency }}</td>
            <td class="px-2 py-2 text-gray-400 text-xs">{{ move.range }}</td>
            <td class="px-2 py-2 text-gray-300 text-sm">{{ move.effects }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!filteredMoves.length" class="text-center py-8 text-gray-400">
      No moves found
    </div>
  </div>
</template>

