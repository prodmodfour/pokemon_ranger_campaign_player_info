<script setup lang="ts">
const props = defineProps<{
  type: string
  clickable?: boolean
}>()

const emit = defineEmits<{
  click: [type: string]
}>()

const { getTypeColor } = usePokedex()

const bgColor = computed(() => getTypeColor(props.type))

const handleClick = () => {
  if (props.clickable) {
    emit('click', props.type)
  }
}
</script>

<template>
  <span
    class="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white shadow-sm"
    :class="{ 'cursor-pointer hover:opacity-80': clickable }"
    :style="{ backgroundColor: bgColor }"
    @click="handleClick"
  >
    {{ type }}
  </span>
</template>
