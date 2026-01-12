<script setup lang="ts">
const props = defineProps<{
  searchQuery: string
}>()

const { features } = useGameData()

const selectedTag = ref<string>('')

const allTags = computed(() => {
  const tagSet = new Set<string>()
  features.value.forEach(f => {
    f.tags.forEach(t => tagSet.add(t))
  })
  return Array.from(tagSet).sort()
})

const filteredFeatures = computed(() => {
  let result = features.value

  const query = props.searchQuery.toLowerCase()
  if (query) {
    result = result.filter(f =>
      f.name.toLowerCase().includes(query) ||
      f.prerequisites.toLowerCase().includes(query) ||
      f.effect.toLowerCase().includes(query) ||
      f.tags.some(t => t.toLowerCase().includes(query))
    )
  }

  if (selectedTag.value) {
    result = result.filter(f => f.tags.includes(selectedTag.value))
  }

  return result.sort((a, b) => a.name.localeCompare(b.name))
})

const groupedFeatures = computed(() => {
  const groups: Record<string, typeof features.value> = {}
  filteredFeatures.value.forEach(feature => {
    // Use first tag as primary group, or 'General' if no tags
    const primaryTag = feature.tags[0] || 'General'
    if (!groups[primaryTag]) groups[primaryTag] = []
    groups[primaryTag].push(feature)
  })
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
})

const getTagColor = (tag: string) => {
  if (tag.toLowerCase() === 'class') return '#a855f7'
  if (tag.toLowerCase() === 'orders') return '#3b82f6'
  if (tag.startsWith('+')) return '#22c55e'
  if (tag.toLowerCase().includes('stat')) return '#eab308'
  if (tag.toLowerCase().includes('skill')) return '#14b8a6'
  return '#6b7280'
}

const getTagClass = (tag: string) => {
  if (tag.toLowerCase() === 'class') return 'bg-purple-900/50 text-purple-300'
  if (tag.toLowerCase() === 'orders') return 'bg-blue-900/50 text-blue-300'
  if (tag.startsWith('+')) return 'bg-green-900/50 text-green-300'
  if (tag.toLowerCase().includes('stat')) return 'bg-yellow-900/50 text-yellow-300'
  if (tag.toLowerCase().includes('skill')) return 'bg-teal-900/50 text-teal-300'
  return 'bg-gray-700 text-gray-300'
}
</script>

<template>
  <div>
    <!-- Tag Filter -->
    <div class="mb-4 flex flex-wrap gap-2">
      <button
        @click="selectedTag = ''"
        class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
        :class="!selectedTag ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
      >
        All Tags
      </button>
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="selectedTag = tag"
        class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors text-white"
        :style="{ backgroundColor: selectedTag === tag ? getTagColor(tag) : undefined }"
        :class="selectedTag !== tag ? 'bg-gray-700 hover:bg-gray-600' : ''"
      >
        {{ tag }}
      </button>
    </div>

    <!-- Results count -->
    <div class="mb-4 text-sm text-gray-400">
      {{ filteredFeatures.length }} features
    </div>

    <!-- Grouped Features -->
    <div class="space-y-6">
      <div v-for="[tag, tagFeatures] in groupedFeatures" :key="tag">
        <div class="flex items-center gap-2 mb-3 sticky top-32 bg-gray-900 py-2 z-10">
          <span
            class="px-3 py-1 rounded text-sm font-semibold text-white"
            :style="{ backgroundColor: getTagColor(tag) }"
          >{{ tag }}</span>
          <span class="text-sm text-gray-500">({{ tagFeatures.length }})</span>
        </div>
        <div class="space-y-2">
          <div
            v-for="feature in tagFeatures"
            :key="feature.name"
            class="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-700"
          >
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="font-semibold text-gray-100">{{ feature.name }}</h3>
              <div class="flex flex-wrap gap-1 flex-shrink-0">
                <span
                  v-for="t in feature.tags.slice(1)"
                  :key="t"
                  class="px-2 py-0.5 rounded text-xs font-medium"
                  :class="getTagClass(t)"
                >{{ t }}</span>
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
        </div>
      </div>
    </div>

    <div v-if="!filteredFeatures.length" class="text-center py-8 text-gray-400">
      No features found
    </div>
  </div>
</template>
