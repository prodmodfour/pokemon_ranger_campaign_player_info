<script setup lang="ts">
import type { Pokemon } from '~/composables/usePokedex'

const { searchQuery, filteredPokemon } = usePokedex()

const selectedPokemon = ref<Pokemon | null>(null)

const showPokemonDetail = (pokemon: Pokemon) => {
  selectedPokemon.value = pokemon
}

const closePokemonDetail = () => {
  selectedPokemon.value = null
}

// Close detail on escape
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && selectedPokemon.value) {
      closePokemonDetail()
    }
  }
  window.addEventListener('keydown', handleEscape)
  onUnmounted(() => window.removeEventListener('keydown', handleEscape))
})
</script>

<template>
  <div class="min-h-screen bg-black">
    <!-- Nav Bar -->
    <NavBar />

    <!-- Header -->
    <header class="bg-zinc-900 shadow-lg border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center gap-4 mb-4">
          <NuxtLink
            to="/"
            class="p-2 text-gray-400 hover:text-gray-200 hover:bg-zinc-900 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
          <div>
            <h1 class="text-2xl font-bold text-gray-100">Pokemon</h1>
            <p class="text-sm text-gray-400">{{ filteredPokemon.length }} Pokemon</p>
          </div>
        </div>

        <!-- Search -->
        <SearchBar v-model="searchQuery" />
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-6">
      <!-- Filters -->
      <div class="mb-6">
        <FilterPanel />
      </div>

      <!-- Pokemon Grid -->
      <div
        v-if="filteredPokemon.length"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        <PokemonCard
          v-for="pokemon in filteredPokemon"
          :key="pokemon.name"
          :pokemon="pokemon"
          @click="showPokemonDetail"
        />
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-200">No Pokemon found</h3>
        <p class="mt-1 text-sm text-gray-400">Try adjusting your search or filters.</p>
      </div>
    </main>

    <!-- Pokemon Detail Modal -->
    <Transition name="slide">
      <PokemonDetail
        v-if="selectedPokemon"
        :pokemon="selectedPokemon"
        @close="closePokemonDetail"
      />
    </Transition>

    <!-- Definition Modal -->
    <DefinitionModal />
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>
