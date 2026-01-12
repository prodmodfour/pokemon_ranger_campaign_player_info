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

const route = useRoute()
const { getTypeColor } = usePokedex()

const moveName = computed(() => {
  const name = route.params.name as string
  return decodeURIComponent(name).replace(/-/g, ' ')
})

const move = computed(() => {
  const moves = movesData as Move[]
  return moves.find(m => m.name.toLowerCase() === moveName.value.toLowerCase())
})

const categoryColor = computed(() => {
  if (!move.value) return ''
  switch (move.value.category) {
    case 'Physical': return 'from-red-600 to-red-800'
    case 'Special': return 'from-red-600 to-red-800'
    case 'Status': return 'from-gray-500 to-gray-700'
    default: return 'from-gray-600 to-gray-800'
  }
})

// Parse contest stats
const contestCategory = computed(() => {
  if (!move.value?.contestStats || move.value.contestStats === '--') return null
  const parts = move.value.contestStats.split(' - ')
  return parts[0] || null
})

const contestEffect = computed(() => {
  if (!move.value?.contestStats || move.value.contestStats === '--') return null
  const parts = move.value.contestStats.split(' - ')
  return parts[1] || null
})
</script>

<template>
  <div class="min-h-screen bg-black">
    <!-- Nav Bar -->
    <NavBar />

    <!-- Header -->
    <header class="bg-zinc-900 shadow-lg border-b border-gray-800">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors mb-4"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Pokedex
        </NuxtLink>
        <h1 class="text-2xl font-bold text-gray-100">Move Details</h1>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-4xl mx-auto px-4 py-8">
      <!-- Not Found -->
      <div v-if="!move" class="text-center py-12">
        <svg class="mx-auto h-16 w-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-xl font-semibold text-gray-200 mb-2">Move not found</h2>
        <p class="text-gray-400 mb-4">Could not find a move named "{{ moveName }}"</p>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Return to Pokedex
        </NuxtLink>
      </div>

      <!-- Move Details -->
      <div v-else class="space-y-6">
        <!-- Move Header Card -->
        <div
          class="rounded-2xl overflow-hidden shadow-xl"
          :class="`bg-gradient-to-br ${categoryColor}`"
        >
          <div class="p-6 text-white">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h2 class="text-3xl font-bold mb-2">{{ move.name }}</h2>
                <div class="flex items-center gap-3">
                  <span
                    class="px-3 py-1 rounded-full text-sm font-semibold"
                    :style="{ backgroundColor: getTypeColor(move.type) }"
                  >
                    {{ move.type }}
                  </span>
                  <span class="px-3 py-1 rounded-full text-sm font-semibold bg-white/20">
                    {{ move.category }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div class="bg-black/20 rounded-lg p-3 text-center">
                <div class="text-xs uppercase tracking-wide opacity-75 mb-1">Damage Base</div>
                <div class="text-2xl font-bold">{{ move.damageBase }}</div>
              </div>
              <div class="bg-black/20 rounded-lg p-3 text-center">
                <div class="text-xs uppercase tracking-wide opacity-75 mb-1">AC</div>
                <div class="text-2xl font-bold">{{ move.ac }}</div>
              </div>
              <div class="bg-black/20 rounded-lg p-3 text-center">
                <div class="text-xs uppercase tracking-wide opacity-75 mb-1">Frequency</div>
                <div class="text-lg font-bold">{{ move.frequency }}</div>
              </div>
              <div class="bg-black/20 rounded-lg p-3 text-center">
                <div class="text-xs uppercase tracking-wide opacity-75 mb-1">Range</div>
                <div class="text-sm font-medium">{{ move.range }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Effect Section -->
        <div class="bg-zinc-900 rounded-xl p-6 border border-gray-800">
          <h3 class="text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Effect
          </h3>
          <p class="text-gray-300 leading-relaxed">
            {{ move.effects || 'No additional effect.' }}
          </p>
        </div>

        <!-- Contest Stats -->
        <div v-if="contestCategory" class="bg-zinc-900 rounded-xl p-6 border border-gray-800">
          <h3 class="text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Contest
          </h3>
          <div class="flex items-center gap-4">
            <span class="px-3 py-1.5 bg-pink-900/50 text-pink-300 rounded-lg font-medium">
              {{ contestCategory }}
            </span>
            <span v-if="contestEffect" class="text-gray-400">
              {{ contestEffect }}
            </span>
          </div>
        </div>

        <!-- Ability Interactions -->
        <div v-if="move.abilityInteractions?.length" class="bg-zinc-900 rounded-xl p-6 border border-gray-800">
          <h3 class="text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Ability Interactions
          </h3>
          <p class="text-sm text-gray-400 mb-3">This move is boosted by the following abilities:</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="ability in move.abilityInteractions"
              :key="ability"
              class="px-3 py-1.5 bg-purple-900/50 text-purple-300 rounded-lg font-medium"
            >
              {{ ability }}
            </span>
          </div>
        </div>

        <!-- Technical Details -->
        <div class="bg-zinc-900 rounded-xl p-6 border border-gray-800">
          <h3 class="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Technical Details
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-500 mb-1">Type</div>
              <div class="text-gray-200">{{ move.type }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 mb-1">Category</div>
              <div class="text-gray-200">{{ move.category }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 mb-1">Damage Base</div>
              <div class="text-gray-200">{{ move.damageBase }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 mb-1">Accuracy Check</div>
              <div class="text-gray-200">{{ move.ac }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 mb-1">Frequency</div>
              <div class="text-gray-200">{{ move.frequency }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 mb-1">Range</div>
              <div class="text-gray-200">{{ move.range }}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
