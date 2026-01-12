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

const filteredItems = computed(() => {
  const query = props.searchQuery.toLowerCase()
  if (!query) return items.value
  return items.value.filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query) ||
    item.effect.toLowerCase().includes(query)
  )
})

const getCategoryColor = (category: string) => {
  if (category.includes('Restorative') || category.includes('Medicine')) return 'bg-pink-900/50 text-pink-300'
  if (category.includes('X-Item')) return 'bg-red-900/50 text-red-300'
  if (category.includes('Berry')) return 'bg-green-900/50 text-green-300'
  if (category.includes('Held')) return 'bg-blue-900/50 text-blue-300'
  if (category.includes('Equipment') || category.includes('Armor') || category.includes('Gear')) return 'bg-gray-600 text-gray-200'
  if (category.includes('Evolution')) return 'bg-purple-900/50 text-purple-300'
  if (category.includes('Snack') || category.includes('Food')) return 'bg-yellow-900/50 text-yellow-300'
  if (category.includes('Ball')) return 'bg-orange-900/50 text-orange-300'
  return 'bg-gray-700 text-gray-300'
}
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="item in filteredItems"
      :key="item.name"
      class="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors border border-gray-700"
    >
      <div class="flex items-start justify-between gap-2 mb-2">
        <h3 class="font-semibold text-gray-100">{{ item.name }}</h3>
        <div class="flex gap-1 flex-shrink-0">
          <span
            class="px-2 py-0.5 rounded text-xs font-medium"
            :class="getCategoryColor(item.category)"
          >{{ item.category }}</span>
          <span
            v-if="item.price"
            class="px-2 py-0.5 rounded text-xs font-medium bg-emerald-900/50 text-emerald-300"
          >{{ item.price }}</span>
        </div>
      </div>
      <p class="text-sm text-gray-300">{{ item.effect }}</p>
    </div>
    <div v-if="!filteredItems.length" class="text-center py-8 text-gray-400">
      No items found matching "{{ searchQuery }}"
    </div>
  </div>
</template>
