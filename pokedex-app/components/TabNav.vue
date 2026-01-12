<script setup lang="ts">
const props = defineProps<{
  tabs: { id: string; label: string; count?: number }[]
  activeTab: string
}>()

const emit = defineEmits<{
  'update:activeTab': [tab: string]
}>()
</script>

<template>
  <div class="flex overflow-x-auto border-b border-gray-700 bg-gray-800/50 sticky top-[88px] z-20">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="emit('update:activeTab', tab.id)"
      class="flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap"
      :class="activeTab === tab.id
        ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800'
        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'"
    >
      {{ tab.label }}
      <span v-if="tab.count !== undefined" class="ml-1.5 text-xs opacity-60">({{ tab.count }})</span>
    </button>
  </div>
</template>
