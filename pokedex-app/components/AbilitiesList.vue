<script setup lang="ts">
const props = defineProps<{
  searchQuery: string
}>()

const { abilities } = useDefinitions()

const filteredAbilities = computed(() => {
  const query = props.searchQuery.toLowerCase()
  if (!query) return abilities.value
  return abilities.value.filter(a =>
    a.name.toLowerCase().includes(query) ||
    a.effect?.toLowerCase().includes(query) ||
    a.trigger?.toLowerCase().includes(query)
  )
})

const getAbilityTypeColor = (type?: string) => {
  switch (type) {
    case 'basic': return 'bg-green-900/50 text-green-300'
    case 'advanced': return 'bg-blue-900/50 text-blue-300'
    case 'high': return 'bg-purple-900/50 text-purple-300'
    default: return 'bg-gray-700 text-gray-300'
  }
}
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="ability in filteredAbilities"
      :key="ability.name"
      class="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-700"
    >
      <div class="flex items-start justify-between gap-2 mb-2">
        <h3 class="font-semibold text-gray-100">{{ ability.name }}</h3>
        <div class="flex gap-1 flex-shrink-0">
          <span
            v-if="ability.type"
            class="px-2 py-0.5 rounded text-xs font-medium"
            :class="getAbilityTypeColor(ability.type)"
          >{{ ability.type }}</span>
          <span
            v-if="ability.trigger"
            class="px-2 py-0.5 rounded text-xs font-medium bg-yellow-900/50 text-yellow-300"
          >{{ ability.trigger }}</span>
        </div>
      </div>
      <p v-if="ability.effect" class="text-sm text-gray-300">{{ ability.effect }}</p>
      <p v-else class="text-sm text-gray-500 italic">No effect description available</p>
    </div>
    <div v-if="!filteredAbilities.length" class="text-center py-8 text-gray-400">
      No abilities found matching "{{ searchQuery }}"
    </div>
  </div>
</template>
