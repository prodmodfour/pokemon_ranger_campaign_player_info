<script setup lang="ts">
import type { Pokemon } from '~/composables/usePokedex'

const props = defineProps<{
  pokemon: Pokemon
}>()

const emit = defineEmits<{
  close: []
}>()

const { getTypeColor, getPokemonByName } = usePokedex()
const { showDefinition } = useDefinitions()

const primaryColor = computed(() => {
  return props.pokemon.types[0] ? getTypeColor(props.pokemon.types[0]) : '#888888'
})

const totalStats = computed(() => {
  const stats = props.pokemon.baseStats
  return (stats.hp || 0) + (stats.attack || 0) + (stats.defense || 0) +
         (stats.special_attack || 0) + (stats.special_defense || 0) + (stats.speed || 0)
})

const maxStat = computed(() => {
  const stats = props.pokemon.baseStats
  return Math.max(stats.hp || 0, stats.attack || 0, stats.defense || 0,
                  stats.special_attack || 0, stats.special_defense || 0, stats.speed || 0, 15)
})

const statBarWidth = (value: number) => {
  return `${(value / maxStat.value) * 100}%`
}

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}

// Tab management
const activeTab = ref<'stats' | 'moves' | 'info'>('stats')

// Generate sprite URL from Pokemon name
const pokemonName = computed(() => {
  let name = props.pokemon.name
    .toLowerCase()
    .replace(/♀/g, '-f')
    .replace(/♂/g, '-m')
    .replace(/[^a-z0-9-]/g, '') // Remove special chars after gender symbols

  // Handle Nidoran gender based on evolution data
  if (name === 'nidoran' && props.pokemon.evolution?.length) {
    const firstEvo = props.pokemon.evolution[0]
    if (firstEvo?.requirement === 'F') name = 'nidoran-f'
    else if (firstEvo?.requirement === 'M') name = 'nidoran-m'
  }

  return name
})

// B2W2 animated sprite (Gen 1-5)
const b2w2Sprite = computed(() => {
  return `https://img.pokemondb.net/sprites/black-white/anim/normal/${pokemonName.value}.gif`
})

// Pokemon Home sprite fallback (Gen 6+)
const homeSprite = computed(() => {
  return `https://img.pokemondb.net/sprites/home/normal/${pokemonName.value}.png`
})

const spriteState = ref<'b2w2' | 'home' | 'fallback'>('b2w2')

const spriteUrl = computed(() => {
  if (spriteState.value === 'b2w2') return b2w2Sprite.value
  if (spriteState.value === 'home') return homeSprite.value
  return ''
})

const handleImgError = () => {
  if (spriteState.value === 'b2w2') {
    spriteState.value = 'home' // Try Home sprite
  } else {
    spriteState.value = 'fallback' // Show letter fallback
  }
}
</script>

<template>
  <div
    class="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50"
    @click="handleBackdropClick"
  >
    <div class="bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div
        class="px-6 py-4 text-white relative"
        :style="{ background: `linear-gradient(135deg, ${primaryColor}, ${pokemon.types[1] ? getTypeColor(pokemon.types[1]) : primaryColor}dd)` }"
      >
        <button
          @click="emit('close')"
          class="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="flex items-center gap-4">
          <!-- Sprite -->
          <div class="w-24 h-24 flex items-center justify-center flex-shrink-0">
            <img
              v-if="spriteState !== 'fallback'"
              :src="spriteUrl"
              :alt="pokemon.name"
              class="max-w-full max-h-full object-contain drop-shadow-lg"
              @error="handleImgError"
            />
            <div
              v-else
              class="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold bg-white/20"
            >
              {{ pokemon.name.charAt(0) }}
            </div>
          </div>

          <div>
            <h2 class="text-2xl font-bold mb-2">{{ pokemon.name }}</h2>

            <!-- Types -->
            <div class="flex gap-2 mb-2">
              <button
                v-for="type in pokemon.types"
                :key="type"
                @click="showDefinition(type, 'type')"
                class="px-3 py-1 rounded-full text-sm font-semibold bg-white/20 hover:bg-white/30 transition-colors"
              >
                {{ type }}
              </button>
            </div>

            <!-- Size & Weight -->
            <div class="text-sm opacity-90">
              {{ pokemon.size.height }} | {{ pokemon.size.weight }} | {{ pokemon.size.sizeClass }}
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-gray-700">
        <button
          v-for="tab in ['stats', 'moves', 'info'] as const"
          :key="tab"
          @click="activeTab = tab"
          class="flex-1 px-4 py-3 text-sm font-medium transition-colors"
          :class="activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'"
        >
          {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 text-gray-100">
        <!-- Stats Tab -->
        <div v-if="activeTab === 'stats'" class="space-y-6">
          <!-- Base Stats -->
          <div>
            <h3 class="font-semibold text-gray-200 mb-3">Base Stats</h3>
            <div class="space-y-2">
              <div v-for="(value, key) in pokemon.baseStats" :key="key" class="flex items-center gap-3">
                <span class="w-20 text-sm text-gray-400 capitalize">{{ key.replace('_', ' ') }}</span>
                <div class="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all"
                    :style="{ width: statBarWidth(value), backgroundColor: primaryColor }"
                  />
                </div>
                <span class="w-8 text-sm font-semibold text-gray-200 text-right">{{ value }}</span>
              </div>
              <div class="flex items-center gap-3 pt-2 border-t border-gray-700">
                <span class="w-20 text-sm font-semibold text-gray-200">Total</span>
                <div class="flex-1"></div>
                <span class="w-8 text-sm font-bold text-gray-100 text-right">{{ totalStats }}</span>
              </div>
            </div>
          </div>

          <!-- Abilities -->
          <div>
            <h3 class="font-semibold text-gray-200 mb-3">Abilities</h3>
            <div class="space-y-2">
              <div v-if="pokemon.abilities.basic.length">
                <span class="text-xs text-gray-500">Basic:</span>
                <div class="flex flex-wrap gap-1 mt-1">
                  <button
                    v-for="ability in pokemon.abilities.basic"
                    :key="ability"
                    @click="showDefinition(ability, 'ability')"
                    class="px-2 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200 transition-colors"
                  >
                    {{ ability }}
                  </button>
                </div>
              </div>
              <div v-if="pokemon.abilities.advanced.length">
                <span class="text-xs text-gray-500">Advanced:</span>
                <div class="flex flex-wrap gap-1 mt-1">
                  <button
                    v-for="ability in pokemon.abilities.advanced"
                    :key="ability"
                    @click="showDefinition(ability, 'ability')"
                    class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    {{ ability }}
                  </button>
                </div>
              </div>
              <div v-if="pokemon.abilities.high">
                <span class="text-xs text-gray-500">High:</span>
                <div class="mt-1">
                  <button
                    @click="showDefinition(pokemon.abilities.high!, 'ability')"
                    class="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm hover:bg-purple-200 transition-colors"
                  >
                    {{ pokemon.abilities.high }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Skills -->
          <div v-if="Object.keys(pokemon.skills).length">
            <h3 class="font-semibold text-gray-200 mb-3">Skills</h3>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="(value, skill) in pokemon.skills"
                :key="skill"
                class="flex justify-between px-3 py-2 bg-gray-700 rounded"
              >
                <span class="text-sm text-gray-400 capitalize">{{ skill }}</span>
                <span class="text-sm font-mono font-semibold text-gray-200">{{ value }}</span>
              </div>
            </div>
          </div>

          <!-- Capabilities -->
          <div v-if="pokemon.capabilities.length">
            <h3 class="font-semibold text-gray-200 mb-3">Capabilities</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="cap in pokemon.capabilities"
                :key="cap"
                @click="showDefinition(cap.split(/[\s(]/)[0], 'capability')"
                class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 transition-colors"
              >
                {{ cap }}
              </button>
            </div>
          </div>
        </div>

        <!-- Moves Tab -->
        <div v-if="activeTab === 'moves'" class="space-y-6">
          <!-- Level Up Moves -->
          <div v-if="pokemon.moves.levelUp.length">
            <h3 class="font-semibold text-gray-200 mb-3">Level Up Moves</h3>
            <div class="space-y-1">
              <button
                v-for="move in pokemon.moves.levelUp"
                :key="`${move.level}-${move.name}`"
                @click="showDefinition(move.name, 'move')"
                class="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-700 transition-colors text-left"
              >
                <span class="w-8 text-sm text-gray-400">Lv{{ move.level }}</span>
                <span class="flex-1 text-sm font-medium text-gray-200">{{ move.name }}</span>
                <span
                  class="px-2 py-0.5 rounded text-xs font-semibold text-white"
                  :style="{ backgroundColor: getTypeColor(move.type) }"
                >{{ move.type }}</span>
              </button>
            </div>
          </div>

          <!-- TM/HM Moves -->
          <div v-if="pokemon.moves.tmHm.length">
            <h3 class="font-semibold text-gray-200 mb-3">TM/HM Moves</h3>
            <div class="flex flex-wrap gap-1">
              <button
                v-for="move in pokemon.moves.tmHm"
                :key="move"
                @click="showDefinition(move, 'move')"
                class="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-sm hover:bg-blue-800/50 transition-colors"
              >
                {{ move }}
              </button>
            </div>
          </div>

          <!-- Egg Moves -->
          <div v-if="pokemon.moves.egg.length">
            <h3 class="font-semibold text-gray-200 mb-3">Egg Moves</h3>
            <div class="flex flex-wrap gap-1">
              <button
                v-for="move in pokemon.moves.egg"
                :key="move"
                @click="showDefinition(move, 'move')"
                class="px-2 py-1 bg-pink-900/50 text-pink-300 rounded text-sm hover:bg-pink-800/50 transition-colors"
              >
                {{ move }}
              </button>
            </div>
          </div>

          <!-- Tutor Moves -->
          <div v-if="pokemon.moves.tutor.length">
            <h3 class="font-semibold text-gray-200 mb-3">Tutor Moves</h3>
            <div class="flex flex-wrap gap-1">
              <button
                v-for="move in pokemon.moves.tutor"
                :key="move"
                @click="showDefinition(move, 'move')"
                class="px-2 py-1 bg-yellow-900/50 text-yellow-300 rounded text-sm hover:bg-yellow-800/50 transition-colors"
              >
                {{ move }}
              </button>
            </div>
          </div>
        </div>

        <!-- Info Tab -->
        <div v-if="activeTab === 'info'" class="space-y-6">
          <!-- Evolution -->
          <div v-if="pokemon.evolution.length">
            <h3 class="font-semibold text-gray-200 mb-3">Evolution</h3>
            <div class="flex items-center gap-2 flex-wrap">
              <template v-for="(evo, index) in pokemon.evolution" :key="evo.stage">
                <div
                  class="flex flex-col items-center p-3 rounded-lg"
                  :class="evo.name.toLowerCase() === pokemon.name.toLowerCase() ? 'bg-blue-900/50 ring-2 ring-blue-400' : 'bg-gray-700'"
                >
                  <span class="text-xs text-gray-400">Stage {{ evo.stage }}</span>
                  <span class="font-medium text-gray-200">{{ evo.name }}</span>
                  <span v-if="evo.requirement" class="text-xs text-gray-400 mt-1">{{ evo.requirement }}</span>
                </div>
                <svg v-if="index < pokemon.evolution.length - 1" class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </template>
            </div>
          </div>

          <!-- Breeding -->
          <div>
            <h3 class="font-semibold text-gray-200 mb-3">Breeding Information</h3>
            <div class="grid grid-cols-2 gap-3">
              <div v-if="pokemon.breeding.genderRatio" class="bg-gray-700 rounded-lg p-3">
                <div class="text-xs text-gray-400">Gender Ratio</div>
                <div class="text-sm font-medium text-gray-200">{{ pokemon.breeding.genderRatio }}</div>
              </div>
              <div v-if="pokemon.breeding.eggGroup?.length" class="bg-gray-700 rounded-lg p-3">
                <div class="text-xs text-gray-400">Egg Groups</div>
                <div class="text-sm font-medium text-gray-200">{{ pokemon.breeding.eggGroup.join(', ') }}</div>
              </div>
              <div v-if="pokemon.breeding.hatchRate" class="bg-gray-700 rounded-lg p-3">
                <div class="text-xs text-gray-400">Hatch Rate</div>
                <div class="text-sm font-medium text-gray-200">{{ pokemon.breeding.hatchRate }}</div>
              </div>
              <div v-if="pokemon.breeding.diet" class="bg-gray-700 rounded-lg p-3">
                <div class="text-xs text-gray-400">Diet</div>
                <div class="text-sm font-medium text-gray-200">{{ pokemon.breeding.diet }}</div>
              </div>
            </div>
          </div>

          <!-- Habitat -->
          <div v-if="pokemon.breeding.habitat?.length">
            <h3 class="font-semibold text-gray-200 mb-3">Habitat</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="habitat in pokemon.breeding.habitat"
                :key="habitat"
                class="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-sm"
              >
                {{ habitat }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
