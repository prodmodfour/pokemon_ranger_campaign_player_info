<script setup lang="ts">
useHead({
  title: 'PTU Pokedex - Pokemon Tabletop United',
  meta: [
    { name: 'description', content: 'Interactive Pokedex for Pokemon Tabletop United with clickable moves, abilities, and type definitions.' }
  ]
})
</script>

<template>
  <NuxtPage />
  <DefinitionModal />
</template>

<style>
body {
  @apply bg-gray-900 text-gray-100;
}
</style>
