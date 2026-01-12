<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const searchInput = ref<HTMLInputElement | null>(null)

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const clearSearch = () => {
  emit('update:modelValue', '')
  searchInput.value?.focus()
}

// Focus search on Ctrl+K or /
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement?.tagName !== 'INPUT')) {
      e.preventDefault()
      searchInput.value?.focus()
    }
    if (e.key === 'Escape') {
      searchInput.value?.blur()
    }
  }
  window.addEventListener('keydown', handleKeydown)
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
})
</script>

<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      ref="searchInput"
      type="text"
      :value="modelValue"
      @input="updateValue"
      placeholder="Search Pokemon, moves, abilities... (Ctrl+K)"
      class="block w-full pl-10 pr-10 py-3 border border-gray-700 rounded-lg bg-zinc-900 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-100 placeholder-gray-400"
    />
    <button
      v-if="modelValue"
      @click="clearSearch"
      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>
