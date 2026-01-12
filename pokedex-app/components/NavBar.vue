<script setup lang="ts">
const route = useRoute()

const links = [
  { href: '/', label: 'Home' },
  { href: '/pokemon', label: 'Pokemon' },
  { href: '/moves', label: 'Moves' },
  { href: '/abilities', label: 'Abilities' },
  { href: '/items', label: 'Items' },
  { href: '/features', label: 'Features' },
  { href: '/edges', label: 'Edges' },
  { href: '/poke-edges', label: 'Poke Edges' },
]

const isActive = (href: string) => {
  if (href === '/') return route.path === '/' || route.path === ''
  return route.path.startsWith(href)
}
</script>

<template>
  <nav class="bg-black border-b border-gray-800 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
        <NuxtLink
          v-for="link in links"
          :key="link.href"
          :to="link.href"
          class="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
          :class="isActive(link.href)
            ? 'bg-red-600 text-white'
            : 'text-gray-400 hover:text-gray-200 hover:bg-zinc-900'"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
