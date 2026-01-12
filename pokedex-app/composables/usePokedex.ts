import pokemonData from '~/data/pokemon.json'
import typesData from '~/data/types.json'

export interface Pokemon {
  name: string
  baseStats: {
    hp: number
    attack: number
    defense: number
    special_attack: number
    special_defense: number
    speed: number
  }
  types: string[]
  abilities: {
    basic: string[]
    advanced: string[]
    high: string | null
  }
  evolution: {
    stage: number
    name: string
    requirement: string | null
  }[]
  size: {
    height: string
    weight: string
    sizeClass: string
    weightClass: string
  }
  breeding: {
    genderRatio?: string
    eggGroup?: string[]
    hatchRate?: string
    diet?: string
    habitat?: string[]
  }
  capabilities: string[]
  skills: Record<string, string>
  moves: {
    levelUp: { level: number; name: string; type: string }[]
    tmHm: string[]
    egg: string[]
    tutor: string[]
  }
}

export function usePokedex() {
  const pokemon = ref<Pokemon[]>(pokemonData as Pokemon[])
  const types = ref<Record<string, string>>(typesData as Record<string, string>)
  const searchQuery = ref('')
  const selectedTypes = ref<string[]>([])
  const selectedHabitat = ref<string | null>(null)
  const selectedSize = ref<string | null>(null)

  const allTypes = computed(() => Object.keys(types.value))

  const allHabitats = computed(() => {
    const habitats = new Set<string>()
    pokemon.value.forEach(p => {
      p.breeding.habitat?.forEach(h => habitats.add(h))
    })
    return Array.from(habitats).sort()
  })

  const allSizes = computed(() => {
    const sizes = new Set<string>()
    pokemon.value.forEach(p => {
      if (p.size.sizeClass) sizes.add(p.size.sizeClass)
    })
    return Array.from(sizes)
  })

  const filteredPokemon = computed(() => {
    return pokemon.value.filter(p => {
      // Search by name
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        const matchesName = p.name.toLowerCase().includes(query)
        const matchesType = p.types.some(t => t.toLowerCase().includes(query))
        const matchesAbility = [
          ...p.abilities.basic,
          ...p.abilities.advanced,
          p.abilities.high
        ].filter(Boolean).some(a => a?.toLowerCase().includes(query))
        const matchesMove = [
          ...p.moves.levelUp.map(m => m.name),
          ...p.moves.tmHm,
          ...p.moves.egg,
          ...p.moves.tutor
        ].some(m => m.toLowerCase().includes(query))

        if (!matchesName && !matchesType && !matchesAbility && !matchesMove) {
          return false
        }
      }

      // Filter by type
      if (selectedTypes.value.length > 0) {
        if (!selectedTypes.value.some(t => p.types.includes(t))) {
          return false
        }
      }

      // Filter by habitat
      if (selectedHabitat.value) {
        if (!p.breeding.habitat?.includes(selectedHabitat.value)) {
          return false
        }
      }

      // Filter by size
      if (selectedSize.value) {
        if (p.size.sizeClass !== selectedSize.value) {
          return false
        }
      }

      return true
    })
  })

  const getTypeColor = (type: string) => {
    return types.value[type] || '#888888'
  }

  const getPokemonByName = (name: string) => {
    return pokemon.value.find(p => p.name.toLowerCase() === name.toLowerCase())
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedTypes.value = []
    selectedHabitat.value = null
    selectedSize.value = null
  }

  return {
    pokemon,
    types,
    searchQuery,
    selectedTypes,
    selectedHabitat,
    selectedSize,
    allTypes,
    allHabitats,
    allSizes,
    filteredPokemon,
    getTypeColor,
    getPokemonByName,
    clearFilters
  }
}
