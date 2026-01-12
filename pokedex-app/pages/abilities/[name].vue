<script setup lang="ts">
import abilitiesData from '~/data/abilities.json'

interface Ability {
  name: string
  type?: string
  trigger?: string
  effect?: string
}

const route = useRoute()

const abilityName = computed(() => {
  const name = route.params.name as string
  return decodeURIComponent(name).replace(/-/g, ' ')
})

const ability = computed(() => {
  const abilities = abilitiesData as Ability[]
  return abilities.find(a => a.name.toLowerCase() === abilityName.value.toLowerCase())
})
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header -->
    <header class="bg-gray-800 shadow-lg border-b border-gray-700">
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
        <h1 class="text-2xl font-bold text-gray-100">Ability Details</h1>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-4xl mx-auto px-4 py-8">
      <!-- Not Found -->
      <div v-if="!ability" class="text-center py-12">
        <svg class="mx-auto h-16 w-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-xl font-semibold text-gray-200 mb-2">Ability not found</h2>
        <p class="text-gray-400 mb-4">Could not find an ability named "{{ abilityName }}"</p>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Return to Pokedex
        </NuxtLink>
      </div>

      <!-- Ability Details -->
      <div v-else class="space-y-6">
        <!-- Ability Header Card -->
        <div class="rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-800">
          <div class="p-6 text-white">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h2 class="text-3xl font-bold mb-3">{{ ability.name }}</h2>
                <div v-if="ability.trigger" class="flex items-center gap-3">
                  <span class="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-500/30 text-yellow-100">
                    {{ ability.trigger }}
                  </span>
                </div>
              </div>
              <!-- Ability Icon -->
              <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Effect Section -->
        <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 class="text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Effect
          </h3>
          <p v-if="ability.effect" class="text-gray-300 leading-relaxed text-lg">
            {{ ability.effect }}
          </p>
          <p v-else class="text-gray-500 italic">
            No effect description available.
          </p>
        </div>

        <!-- Trigger Details -->
        <div v-if="ability.trigger" class="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 class="text-lg font-semibold text-gray-100 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Trigger
          </h3>
          <p class="text-gray-300">{{ ability.trigger }}</p>
        </div>
      </div>
    </main>
  </div>
</template>
