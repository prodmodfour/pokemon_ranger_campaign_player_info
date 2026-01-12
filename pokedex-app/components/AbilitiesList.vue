<script setup lang="ts">
const props = defineProps<{
  searchQuery: string
}>()

const { abilities } = useDefinitions()

const filteredAbilities = computed(() => {
  let result = abilities.value

  const query = props.searchQuery.toLowerCase()
  if (query) {
    result = result.filter(a =>
      a.name.toLowerCase().includes(query) ||
      a.effect?.toLowerCase().includes(query) ||
      a.trigger?.toLowerCase().includes(query)
    )
  }

  return result.sort((a, b) => a.name.localeCompare(b.name))
})
</script>

<template>
  <div>
    <!-- Results count -->
    <div class="mb-4 text-sm text-gray-400">
      {{ filteredAbilities.length }} abilities
    </div>

    <!-- Abilities List -->
    <div class="space-y-2">
      <div
        v-for="ability in filteredAbilities"
        :key="ability.name"
        class="bg-zinc-900 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-800"
      >
        <div class="flex items-start justify-between gap-2 mb-2">
          <NuxtLink
            :to="`/abilities/${encodeURIComponent(ability.name.replace(/ /g, '-'))}`"
            class="font-semibold text-red-400 hover:text-red-300 hover:underline transition-colors"
          >
            {{ ability.name }}
          </NuxtLink>
          <span
            v-if="ability.trigger"
            class="px-2 py-0.5 rounded text-xs font-medium bg-yellow-900/50 text-yellow-300 flex-shrink-0"
          >{{ ability.trigger }}</span>
        </div>
        <p v-if="ability.effect" class="text-sm text-gray-300">{{ ability.effect }}</p>
        <p v-else class="text-sm text-gray-500 italic">No effect description available</p>
      </div>
    </div>

    <div v-if="!filteredAbilities.length" class="text-center py-8 text-gray-400">
      No abilities found
    </div>
  </div>
</template>
