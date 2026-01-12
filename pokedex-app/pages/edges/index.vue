<script setup lang="ts">
const searchQuery = ref('')
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Header -->
    <header class="bg-gray-800 shadow-lg sticky top-0 z-30 border-b border-gray-700">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center gap-4 mb-4">
          <NuxtLink
            to="/"
            class="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
          <div>
            <h1 class="text-2xl font-bold text-gray-100">Trainer Edges</h1>
            <p class="text-sm text-gray-400">Trainer Edges Database</p>
          </div>
        </div>

        <!-- Search -->
        <SearchBar v-model="searchQuery" />
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-6">
      <EdgesList :searchQuery="searchQuery" />
    </main>

    <!-- Definition Modal -->
    <DefinitionModal />
  </div>
</template>
