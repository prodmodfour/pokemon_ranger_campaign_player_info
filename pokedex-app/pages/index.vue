<script setup lang="ts">
import itemsData from '~/data/items.json'

const { filteredPokemon } = usePokedex()
const { abilities, moves } = useDefinitions()
const { edges, features, pokeEdges } = useGameData()

const items = ref(itemsData)

const sections = computed(() => [
  {
    id: 'pokemon',
    title: 'Pokemon',
    description: 'Browse all Pokemon with stats, moves, and abilities',
    count: filteredPokemon.value.length,
    href: '/pokemon',
    color: 'from-red-600 to-red-800',
    icon: `<svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`
  },
  {
    id: 'moves',
    title: 'Moves',
    description: 'Complete move database with damage, type, and effects',
    count: moves.value.length,
    href: '/moves',
    color: 'from-blue-600 to-blue-800',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`
  },
  {
    id: 'abilities',
    title: 'Abilities',
    description: 'Pokemon abilities with triggers and effects',
    count: abilities.value.length,
    href: '/abilities',
    color: 'from-purple-600 to-purple-800',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`
  },
  {
    id: 'items',
    title: 'Items',
    description: 'Equipment, medicine, berries, and held items',
    count: items.value.length,
    href: '/items',
    color: 'from-emerald-600 to-emerald-800',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`
  },
  {
    id: 'features',
    title: 'Trainer Features',
    description: 'Class features and trainer abilities',
    count: features.value.length,
    href: '/features',
    color: 'from-yellow-600 to-yellow-800',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`
  },
  {
    id: 'edges',
    title: 'Trainer Edges',
    description: 'General edges for trainers',
    count: edges.value.length,
    href: '/edges',
    color: 'from-cyan-600 to-cyan-800',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>`
  },
  {
    id: 'poke-edges',
    title: 'Poke Edges',
    description: 'Special edges that can be taught to Pokemon',
    count: pokeEdges.value.length,
    href: '/poke-edges',
    color: 'from-pink-600 to-pink-800',
    icon: `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>`
  }
])
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header -->
    <header class="bg-gray-800 shadow-lg border-b border-gray-700">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-100 mb-2">PTU Pokedex</h1>
          <p class="text-lg text-gray-400">Pokemon Tabletop United Reference</p>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Navigation Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <NuxtLink
          v-for="section in sections"
          :key="section.id"
          :to="section.href"
          class="group block"
        >
          <div
            class="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <!-- Gradient Header -->
            <div
              class="p-6 bg-gradient-to-br text-white"
              :class="section.color"
            >
              <div class="flex items-center justify-between mb-4">
                <div v-html="section.icon" class="opacity-90"></div>
                <span class="text-2xl font-bold opacity-90">{{ section.count }}</span>
              </div>
              <h2 class="text-xl font-bold">{{ section.title }}</h2>
            </div>
            <!-- Description -->
            <div class="bg-gray-800 p-4 border-t border-gray-700">
              <p class="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                {{ section.description }}
              </p>
              <div class="mt-3 flex items-center text-sm font-medium text-blue-400 group-hover:text-blue-300">
                Browse
                <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 border-t border-gray-700 mt-12 py-6">
      <div class="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
        <p>Pokemon Tabletop United Pokedex</p>
        <p class="mt-1">Click any section to explore the database.</p>
      </div>
    </footer>
  </div>
</template>
