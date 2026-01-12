<script setup lang="ts">
const { allTypes, allHabitats, allSizes, allCapabilities, selectedTypes, selectedHabitat, selectedSize, selectedCapabilities, startersOnly, clearFilters, getTypeColor } = usePokedex()

const isExpanded = ref(false)

const hasActiveFilters = computed(() => {
  return selectedTypes.value.length > 0 || selectedHabitat.value || selectedSize.value || selectedCapabilities.value.length > 0 || startersOnly.value
})

const toggleCapability = (cap: string) => {
  const index = selectedCapabilities.value.indexOf(cap)
  if (index === -1) {
    selectedCapabilities.value.push(cap)
  } else {
    selectedCapabilities.value.splice(index, 1)
  }
}

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
  <div class="bg-zinc-900 rounded-lg shadow-sm border border-gray-800 p-4">
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
          class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
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
      <!-- Quick Filters -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Quick Filters</label>
        <button
          @click="startersOnly = !startersOnly"
          class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          :class="startersOnly
            ? 'bg-red-600 text-white ring-2 ring-offset-1 ring-offset-zinc-900 ring-red-400'
            : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'"
        >
          Starters Only
        </button>
        <p class="text-xs text-gray-500 mt-1">Underdog Pokemon that are unevolved and non-legendary</p>
      </div>

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
          class="block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm bg-zinc-900 text-gray-100"
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
          class="block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm bg-zinc-900 text-gray-100"
        >
          <option :value="null">All Sizes</option>
          <option v-for="size in allSizes" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>

      <!-- Capabilities Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Capabilities
          <span v-if="selectedCapabilities.length" class="text-red-400 ml-1">({{ selectedCapabilities.length }} selected)</span>
        </label>
        <div class="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
          <button
            v-for="cap in allCapabilities"
            :key="cap"
            @click="toggleCapability(cap)"
            class="px-2 py-1 rounded text-xs font-medium transition-all"
            :class="selectedCapabilities.includes(cap)
              ? 'bg-red-600 text-white ring-2 ring-offset-1 ring-offset-zinc-900 ring-red-400'
              : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'"
          >
            {{ cap }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
