<script setup lang="ts">
const { currentDefinition, isModalOpen, closeModal, typeChart } = useDefinitions()
const { getTypeColor } = usePokedex()

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    closeModal()
  }
}

// Close on escape
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isModalOpen.value) {
      closeModal()
    }
  }
  window.addEventListener('keydown', handleEscape)
  onUnmounted(() => window.removeEventListener('keydown', handleEscape))
})

const typeInfo = computed(() => {
  if (currentDefinition.value?.type === 'type') {
    return typeChart[currentDefinition.value.name]
  }
  return null
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isModalOpen && currentDefinition"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click="handleBackdropClick"
      >
        <div class="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-auto">
          <!-- Header -->
          <div
            class="px-6 py-4 border-b border-gray-700 flex items-center justify-between"
            :style="currentDefinition.color ? { backgroundColor: currentDefinition.color + '20' } : {}"
          >
            <div>
              <span class="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {{ currentDefinition.type }}
              </span>
              <h3 class="text-xl font-bold text-gray-100">
                {{ currentDefinition.name }}
              </h3>
            </div>
            <button
              @click="closeModal"
              class="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="px-6 py-4">
            <!-- Type Definition -->
            <template v-if="currentDefinition.type === 'type'">
              <div
                class="inline-block px-3 py-1.5 rounded-lg text-white font-semibold mb-4"
                :style="{ backgroundColor: currentDefinition.color }"
              >
                {{ currentDefinition.name }} Type
              </div>

              <div v-if="typeInfo" class="space-y-3">
                <div v-if="typeInfo.strong.length">
                  <div class="text-sm font-medium text-gray-300 mb-1">Super Effective Against:</div>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="t in typeInfo.strong"
                      :key="t"
                      class="px-2 py-0.5 rounded text-xs font-semibold text-white"
                      :style="{ backgroundColor: getTypeColor(t) }"
                    >{{ t }}</span>
                  </div>
                </div>

                <div v-if="typeInfo.weak.length">
                  <div class="text-sm font-medium text-gray-300 mb-1">Not Very Effective Against:</div>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="t in typeInfo.weak"
                      :key="t"
                      class="px-2 py-0.5 rounded text-xs font-semibold text-white"
                      :style="{ backgroundColor: getTypeColor(t) }"
                    >{{ t }}</span>
                  </div>
                </div>

                <div v-if="typeInfo.immune.length">
                  <div class="text-sm font-medium text-gray-300 mb-1">No Effect On:</div>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="t in typeInfo.immune"
                      :key="t"
                      class="px-2 py-0.5 rounded text-xs font-semibold text-white"
                      :style="{ backgroundColor: getTypeColor(t) }"
                    >{{ t }}</span>
                  </div>
                </div>
              </div>
            </template>

            <!-- Move Definition -->
            <template v-else-if="currentDefinition.type === 'move'">
              <div class="space-y-4">
                <!-- Move Type Badge -->
                <div v-if="currentDefinition.moveType" class="flex items-center gap-3">
                  <span
                    class="px-4 py-2 rounded-lg text-sm font-bold text-white"
                    :style="{ backgroundColor: getTypeColor(currentDefinition.moveType) }"
                  >{{ currentDefinition.moveType }}</span>
                </div>

                <!-- Move Stats (if available) -->
                <div v-if="currentDefinition.moveClass || currentDefinition.frequency || currentDefinition.ac || currentDefinition.db" class="bg-gray-700/50 rounded-lg p-3 space-y-2">
                  <div v-if="currentDefinition.moveClass" class="flex justify-between">
                    <span class="text-gray-400 text-sm">Class:</span>
                    <span class="text-gray-200 text-sm font-medium">{{ currentDefinition.moveClass }}</span>
                  </div>
                  <div v-if="currentDefinition.frequency" class="flex justify-between">
                    <span class="text-gray-400 text-sm">Frequency:</span>
                    <span class="text-gray-200 text-sm font-medium">{{ currentDefinition.frequency }}</span>
                  </div>
                  <div v-if="currentDefinition.ac" class="flex justify-between">
                    <span class="text-gray-400 text-sm">AC:</span>
                    <span class="text-gray-200 text-sm font-medium">{{ currentDefinition.ac }}</span>
                  </div>
                  <div v-if="currentDefinition.db" class="flex justify-between">
                    <span class="text-gray-400 text-sm">Damage Base:</span>
                    <span class="text-gray-200 text-sm font-medium">{{ currentDefinition.db }}</span>
                  </div>
                  <div v-if="currentDefinition.range" class="flex justify-between">
                    <span class="text-gray-400 text-sm">Range:</span>
                    <span class="text-gray-200 text-sm font-medium">{{ currentDefinition.range }}</span>
                  </div>
                </div>

                <!-- Move Effect -->
                <div v-if="currentDefinition.effect" class="bg-gray-700/50 rounded-lg p-3">
                  <div class="text-xs text-gray-400 mb-1 font-medium">Effect</div>
                  <p class="text-gray-200 text-sm leading-relaxed">{{ currentDefinition.effect }}</p>
                </div>

                <!-- Fallback message when no detailed data -->
                <p v-else class="text-gray-500 text-sm italic">
                  Refer to the PTU Core Rulebook for full move details.
                </p>
              </div>
            </template>

            <!-- Ability Definition -->
            <template v-else-if="currentDefinition.type === 'ability'">
              <div class="space-y-3">
                <div class="flex flex-wrap gap-2">
                  <span
                    v-if="currentDefinition.abilityType"
                    class="inline-block px-2 py-1 rounded text-xs font-medium"
                    :class="{
                      'bg-green-900/50 text-green-300': currentDefinition.abilityType === 'basic',
                      'bg-blue-900/50 text-blue-300': currentDefinition.abilityType === 'advanced',
                      'bg-purple-900/50 text-purple-300': currentDefinition.abilityType === 'high'
                    }"
                  >
                    {{ currentDefinition.abilityType.charAt(0).toUpperCase() + currentDefinition.abilityType.slice(1) }} Ability
                  </span>
                  <span
                    v-if="currentDefinition.abilityTrigger"
                    class="inline-block px-2 py-1 rounded text-xs font-medium bg-yellow-900/50 text-yellow-300"
                  >
                    {{ currentDefinition.abilityTrigger }}
                  </span>
                </div>
                <div v-if="currentDefinition.abilityEffect" class="bg-gray-700/50 rounded-lg p-3">
                  <div class="text-xs text-gray-400 mb-1 font-medium">Effect</div>
                  <p class="text-gray-200 text-sm leading-relaxed">
                    {{ currentDefinition.abilityEffect }}
                  </p>
                </div>
                <p v-else class="text-gray-400 text-sm italic">
                  No definition available for this ability.
                </p>
              </div>
            </template>

            <!-- Capability Definition -->
            <template v-else-if="currentDefinition.type === 'capability'">
              <p class="text-gray-400">
                {{ currentDefinition.description || 'A Pokemon capability from the PTU system.' }}
              </p>
            </template>

            <!-- Generic Definition -->
            <template v-else>
              <p v-if="currentDefinition.description" class="text-gray-400 whitespace-pre-line">
                {{ currentDefinition.description }}
              </p>
            </template>
          </div>

          <!-- Footer -->
          <div class="px-6 py-3 bg-gray-900 border-t border-gray-700">
            <button
              @click="closeModal"
              class="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>
