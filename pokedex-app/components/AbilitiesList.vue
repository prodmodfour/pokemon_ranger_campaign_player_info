<script setup lang="ts">
const props = defineProps<{
  searchQuery: string
}>()

const { abilities } = useDefinitions()

const selectedType = ref<string>('')

const abilityTypes = ['basic', 'advanced', 'high']

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

  if (selectedType.value) {
    result = result.filter(a => a.type === selectedType.value)
  }

  return result.sort((a, b) => a.name.localeCompare(b.name))
})

const groupedAbilities = computed(() => {
  const groups: Record<string, typeof abilities.value> = {}
  filteredAbilities.value.forEach(ability => {
    const type = ability.type || 'Other'
    if (!groups[type]) groups[type] = []
    groups[type].push(ability)
  })
  // Sort by type order: basic, advanced, high, then others
  const typeOrder = ['basic', 'advanced', 'high']
  return Object.entries(groups).sort(([a], [b]) => {
    const aIdx = typeOrder.indexOf(a)
    const bIdx = typeOrder.indexOf(b)
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
    if (aIdx !== -1) return -1
    if (bIdx !== -1) return 1
    return a.localeCompare(b)
  })
})

const getAbilityTypeColor = (type?: string) => {
  switch (type) {
    case 'basic': return '#22c55e'
    case 'advanced': return '#3b82f6'
    case 'high': return '#a855f7'
    default: return '#6b7280'
  }
}

const getAbilityTypeClass = (type?: string) => {
  switch (type) {
    case 'basic': return 'bg-green-900/50 text-green-300'
    case 'advanced': return 'bg-blue-900/50 text-blue-300'
    case 'high': return 'bg-purple-900/50 text-purple-300'
    default: return 'bg-gray-700 text-gray-300'
  }
}
</script>

<template>
  <div>
    <!-- Type Filter -->
    <div class="mb-4 flex flex-wrap gap-2">
      <button
        @click="selectedType = ''"
        class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
        :class="!selectedType ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'"
      >
        All Types
      </button>
      <button
        v-for="type in abilityTypes"
        :key="type"
        @click="selectedType = type"
        class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors text-white capitalize"
        :style="{ backgroundColor: selectedType === type ? getAbilityTypeColor(type) : undefined }"
        :class="selectedType !== type ? 'bg-gray-700 hover:bg-gray-600' : ''"
      >
        {{ type }}
      </button>
    </div>

    <!-- Results count -->
    <div class="mb-4 text-sm text-gray-400">
      {{ filteredAbilities.length }} abilities
    </div>

    <!-- Grouped Abilities -->
    <div class="space-y-6">
      <div v-for="[type, typeAbilities] in groupedAbilities" :key="type">
        <div class="flex items-center gap-2 mb-3 sticky top-32 bg-gray-900 py-2 z-10">
          <span
            class="px-3 py-1 rounded text-sm font-semibold text-white capitalize"
            :style="{ backgroundColor: getAbilityTypeColor(type) }"
          >{{ type }}</span>
          <span class="text-sm text-gray-500">({{ typeAbilities.length }})</span>
        </div>
        <div class="space-y-2">
          <div
            v-for="ability in typeAbilities"
            :key="ability.name"
            class="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-700"
          >
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="font-semibold text-gray-100">{{ ability.name }}</h3>
              <span
                v-if="ability.trigger"
                class="px-2 py-0.5 rounded text-xs font-medium bg-yellow-900/50 text-yellow-300 flex-shrink-0"
              >{{ ability.trigger }}</span>
            </div>
            <p v-if="ability.effect" class="text-sm text-gray-300">{{ ability.effect }}</p>
            <p v-else class="text-sm text-gray-500 italic">No effect description available</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!filteredAbilities.length" class="text-center py-8 text-gray-400">
      No abilities found
    </div>
  </div>
</template>
