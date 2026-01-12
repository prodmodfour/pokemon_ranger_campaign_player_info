<script setup lang="ts">
const props = defineProps<{
  searchQuery: string
}>()

const { features } = useGameData()

const filteredFeatures = computed(() => {
  const query = props.searchQuery.toLowerCase()
  if (!query) return features.value
  return features.value.filter(f =>
    f.name.toLowerCase().includes(query) ||
    f.prerequisites.toLowerCase().includes(query) ||
    f.effect.toLowerCase().includes(query) ||
    f.tags.some(t => t.toLowerCase().includes(query))
  )
})

const getTagColor = (tag: string) => {
  if (tag.toLowerCase() === 'class') return 'bg-purple-900/50 text-purple-300'
  if (tag.toLowerCase() === 'orders') return 'bg-blue-900/50 text-blue-300'
  if (tag.startsWith('+')) return 'bg-green-900/50 text-green-300'
  return 'bg-gray-700 text-gray-300'
}
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="feature in filteredFeatures"
      :key="feature.name"
      class="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-700"
    >
      <div class="flex items-start justify-between gap-2 mb-2">
        <h3 class="font-semibold text-gray-100">{{ feature.name }}</h3>
        <div class="flex flex-wrap gap-1 flex-shrink-0">
          <span
            v-for="tag in feature.tags"
            :key="tag"
            class="px-2 py-0.5 rounded text-xs font-medium"
            :class="getTagColor(tag)"
          >{{ tag }}</span>
        </div>
      </div>
      <div v-if="feature.prerequisites" class="mb-2">
        <span class="text-xs text-gray-500">Prerequisites: </span>
        <span class="text-sm text-gray-400">{{ feature.prerequisites }}</span>
      </div>
      <div v-if="feature.frequency" class="mb-2">
        <span class="px-2 py-0.5 rounded text-xs bg-yellow-900/50 text-yellow-300">{{ feature.frequency }}</span>
      </div>
      <div v-if="feature.trigger" class="mb-2 text-sm">
        <span class="text-gray-500">Trigger: </span>
        <span class="text-gray-400">{{ feature.trigger }}</span>
      </div>
      <div v-if="feature.target" class="mb-2 text-sm">
        <span class="text-gray-500">Target: </span>
        <span class="text-gray-400">{{ feature.target }}</span>
      </div>
      <p class="text-sm text-gray-300">{{ feature.effect }}</p>
    </div>
    <div v-if="!filteredFeatures.length" class="text-center py-8 text-gray-400">
      No features found matching "{{ searchQuery }}"
    </div>
  </div>
</template>
