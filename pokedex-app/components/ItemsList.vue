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

// Generate item sprite URL from item name
const getItemSprite = (name: string) => {
  const itemName = name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  return `https://play.pokemonshowdown.com/sprites/itemicons/${itemName}.png`
}

// Track failed images
const failedImages = ref<Set<string>>(new Set())

const handleImgError = (itemName: string) => {
  failedImages.value.add(itemName)
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

    <!-- Items Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm table-fixed">
        <thead class="bg-zinc-900 text-gray-300 sticky top-[41px]">
          <tr>
            <th class="text-center px-2 py-2 font-medium w-12"></th>
            <th class="text-left px-2 py-2 font-medium w-40">Name</th>
            <th class="text-left px-2 py-2 font-medium w-32">Category</th>
            <th class="text-left px-2 py-2 font-medium w-24">Price</th>
            <th class="text-left px-2 py-2 font-medium">Effect</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-700">
          <tr
            v-for="item in filteredItems"
            :key="item.name"
            class="hover:bg-zinc-900/50 transition-colors align-top"
          >
            <td class="px-2 py-2 text-center">
              <div class="w-8 h-8 flex items-center justify-center mx-auto">
                <img
                  v-if="!failedImages.has(item.name)"
                  :src="getItemSprite(item.name)"
                  :alt="item.name"
                  class="max-w-full max-h-full object-contain"
                  loading="lazy"
                  @error="handleImgError(item.name)"
                />
                <div
                  v-else
                  class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  :style="{ backgroundColor: getCategoryColor(item.category) }"
                >
                  {{ item.name.charAt(0) }}
                </div>
              </div>
            </td>
            <td class="px-2 py-2 font-medium text-gray-100">
              {{ item.name }}
            </td>
            <td class="px-2 py-2">
              <span
                class="px-2 py-0.5 rounded text-xs font-semibold text-white"
                :style="{ backgroundColor: getCategoryColor(item.category) }"
              >{{ item.category }}</span>
            </td>
            <td class="px-2 py-2 text-emerald-400 font-medium text-xs">
              {{ item.price || '-' }}
            </td>
            <td class="px-2 py-2 text-gray-300 text-sm">{{ item.effect }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!filteredItems.length" class="text-center py-8 text-gray-400">
      No items found
    </div>
  </div>
</template>
