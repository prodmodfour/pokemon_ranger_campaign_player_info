<script setup lang="ts">
import itemsData from '~/data/items.json'

const props = defineProps<{
  searchQuery: string
}>()

interface Item {
  name: string
  category: string
  effect: string
  price: string
}

const items = ref(itemsData as Item[])
const selectedCategory = ref<string>('')

const allCategories = computed(() => {
  const catSet = new Set<string>()
  items.value.forEach(item => {
    if (item.category) catSet.add(item.category)
  })
  return Array.from(catSet).sort()
})

const filteredItems = computed(() => {
  let result = items.value

  const query = props.searchQuery.toLowerCase()
  if (query) {
    result = result.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.effect.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    result = result.filter(item => item.category === selectedCategory.value)
  }

  return result.sort((a, b) => a.name.localeCompare(b.name))
})

const groupedItems = computed(() => {
  const groups: Record<string, Item[]> = {}
  filteredItems.value.forEach(item => {
    const category = item.category || 'Other'
    if (!groups[category]) groups[category] = []
    groups[category].push(item)
  })
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
})

const getCategoryColor = (category: string) => {
  if (category.includes('Restorative') || category.includes('Medicine')) return '#ec4899'
  if (category.includes('X-Item')) return '#ef4444'
  if (category.includes('Berry')) return '#22c55e'
  if (category.includes('Held')) return '#3b82f6'
  if (category.includes('Equipment') || category.includes('Armor') || category.includes('Gear')) return '#6b7280'
  if (category.includes('Evolution')) return '#a855f7'
  if (category.includes('Snack') || category.includes('Food')) return '#eab308'
  if (category.includes('Ball')) return '#f97316'
  return '#6b7280'
}

const getCategoryClass = (category: string) => {
  if (category.includes('Restorative') || category.includes('Medicine')) return 'bg-pink-900/50 text-pink-300'
  if (category.includes('X-Item')) return 'bg-red-900/50 text-red-300'
  if (category.includes('Berry')) return 'bg-green-900/50 text-green-300'
  if (category.includes('Held')) return 'bg-blue-900/50 text-red-300'
  if (category.includes('Equipment') || category.includes('Armor') || category.includes('Gear')) return 'bg-gray-800 text-gray-200'
  if (category.includes('Evolution')) return 'bg-purple-900/50 text-purple-300'
  if (category.includes('Snack') || category.includes('Food')) return 'bg-yellow-900/50 text-yellow-300'
  if (category.includes('Ball')) return 'bg-orange-900/50 text-orange-300'
  return 'bg-zinc-900 text-gray-300'
}
</script>

<template>
  <div>
    <!-- Category Filter -->
    <div class="mb-4 flex flex-wrap gap-2">
      <button
        @click="selectedCategory = ''"
        class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
        :class="!selectedCategory ? 'bg-red-600 text-white' : 'bg-zinc-900 text-gray-300 hover:bg-gray-800'"
      >
        All Categories
      </button>
      <button
        v-for="category in allCategories"
        :key="category"
        @click="selectedCategory = category"
        class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors text-white"
        :style="{ backgroundColor: selectedCategory === category ? getCategoryColor(category) : undefined }"
        :class="selectedCategory !== category ? 'bg-zinc-900 hover:bg-gray-800' : ''"
      >
        {{ category }}
      </button>
    </div>

    <!-- Results count -->
    <div class="mb-4 text-sm text-gray-400">
      {{ filteredItems.length }} items
    </div>

    <!-- Grouped Items -->
    <div class="space-y-6">
      <div v-for="[category, categoryItems] in groupedItems" :key="category">
        <div class="flex items-center gap-2 mb-3 sticky top-[41px] bg-black py-2 z-10">
          <span
            class="px-3 py-1 rounded text-sm font-semibold text-white"
            :style="{ backgroundColor: getCategoryColor(category) }"
          >{{ category }}</span>
          <span class="text-sm text-gray-500">({{ categoryItems.length }})</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div
            v-for="item in categoryItems"
            :key="item.name"
            class="bg-zinc-900 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-800"
          >
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="font-semibold text-gray-100">{{ item.name }}</h3>
              <span
                v-if="item.price"
                class="px-2 py-0.5 rounded text-xs font-medium bg-emerald-900/50 text-emerald-300 flex-shrink-0"
              >{{ item.price }}</span>
            </div>
            <p class="text-sm text-gray-300">{{ item.effect }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!filteredItems.length" class="text-center py-8 text-gray-400">
      No items found
    </div>
  </div>
</template>
