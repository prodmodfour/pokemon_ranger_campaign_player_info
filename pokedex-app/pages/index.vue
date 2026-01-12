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
  <div class="min-h-screen bg-gray-900">
    <!-- Header -->
    <header class="bg-gray-800 shadow-lg sticky top-0 z-30 border-b border-gray-700">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-100">PTU Pokedex</h1>
            <p class="text-sm text-gray-400">Pokemon Tabletop United</p>
          </div>
          <div class="text-sm text-gray-400">
            {{ filteredPokemon.length }} Pokemon
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
      <div
        v-else
        class="text-center py-12"
      >
        <svg class="mx-auto h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-200">No Pokemon found</h3>
        <p class="mt-1 text-sm text-gray-400">Try adjusting your search or filters.</p>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 border-t border-gray-700 mt-12 py-6">
      <div class="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
        <p>Pokemon Tabletop United Pokedex</p>
        <p class="mt-1">Click any Pokemon, move, ability, or type for details.</p>
      </div>
    </footer>

    <!-- Pokemon Detail Modal -->
    <Transition name="slide">
      <PokemonDetail
        v-if="selectedPokemon"
        :pokemon="selectedPokemon"
        @close="closePokemonDetail"
      />
    </Transition>

    <!-- Definition Modal (for moves, abilities, types, capabilities) -->
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
