<script setup lang="ts">
const { allTypes, allHabitats, allSizes, selectedTypes, selectedHabitat, selectedSize, clearFilters, getTypeColor } = usePokedex()

const isExpanded = ref(false)

const hasActiveFilters = computed(() => {
  return selectedTypes.value.length > 0 || selectedHabitat.value || selectedSize.value
})

const toggleType = (type: string) => {
  const index = selectedTypes.value.indexOf(type)
  if (index === -1) {
    selectedTypes.value.push(type)
  } else {
    selectedTypes.value.splice(index, 1)
  }
}
</script>

<template>
  <div class="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4">
    <div class="flex items-center justify-between mb-3">
      <button
        @click="isExpanded = !isExpanded"
        class="flex items-center gap-2 text-gray-200 font-medium"
      >
        <svg
          class="w-5 h-5 transition-transform"
          :class="{ 'rotate-180': isExpanded }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
        Filters
        <span
          v-if="hasActiveFilters"
          class="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full"
        >
          Active
        </span>
      </button>
      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="text-sm text-red-500 hover:text-red-700"
      >
        Clear all
      </button>
    </div>

    <div v-show="isExpanded" class="space-y-4">
      <!-- Type Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Types</label>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="type in allTypes"
            :key="type"
            @click="toggleType(type)"
            class="px-2 py-1 rounded text-xs font-semibold transition-all"
            :class="selectedTypes.includes(type)
              ? 'ring-2 ring-offset-1 ring-gray-900 text-white'
              : 'opacity-60 hover:opacity-100 text-white'"
            :style="{ backgroundColor: getTypeColor(type) }"
          >
            {{ type }}
          </button>
        </div>
      </div>

      <!-- Habitat Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Habitat</label>
        <select
          v-model="selectedHabitat"
          class="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-700 text-gray-100"
        >
          <option :value="null">All Habitats</option>
          <option v-for="habitat in allHabitats" :key="habitat" :value="habitat">
            {{ habitat }}
          </option>
        </select>
      </div>

      <!-- Size Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Size</label>
        <select
          v-model="selectedSize"
          class="block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-700 text-gray-100"
        >
          <option :value="null">All Sizes</option>
          <option v-for="size in allSizes" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
