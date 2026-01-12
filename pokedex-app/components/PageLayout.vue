<script setup lang="ts">
const props = defineProps<{
  title: string
  subtitle?: string
}>()

const searchQuery = ref('')
</script>

<template>
  <div class="min-h-screen bg-black">
    <!-- Header -->
    <header class="bg-zinc-900 shadow-lg sticky top-0 z-30 border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/"
              class="p-2 text-gray-400 hover:text-gray-200 hover:bg-zinc-900 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </NuxtLink>
            <div>
              <h1 class="text-2xl font-bold text-gray-100">{{ title }}</h1>
              <p v-if="subtitle" class="text-sm text-gray-400">{{ subtitle }}</p>
            </div>
          </div>
        </div>

        <!-- Search -->
        <SearchBar v-model="searchQuery" />
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 py-6">
      <slot :searchQuery="searchQuery" />
    </main>

    <!-- Definition Modal -->
    <DefinitionModal />
  </div>
</template>
