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
  const pokemon = useState<Pokemon[]>('pokemon', () => pokemonData as Pokemon[])
  const types = useState<Record<string, string>>('types', () => typesData as Record<string, string>)
  const searchQuery = useState('searchQuery', () => '')
  const selectedTypes = useState<string[]>('selectedTypes', () => [])
  const selectedHabitat = useState<string | null>('selectedHabitat', () => null)
  const selectedSize = useState<string | null>('selectedSize', () => null)
  const selectedCapabilities = useState<string[]>('selectedCapabilities', () => [])
  const startersOnly = useState('startersOnly', () => false)

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

  const allCapabilities = computed(() => {
    const caps = new Set<string>()
    pokemon.value.forEach(p => {
      p.capabilities?.forEach(cap => {
        // Extract capability name without numbers (e.g., "Overland 5" -> "Overland")
        const capName = cap.replace(/\s*\d+\s*$/, '').trim()
        if (capName) caps.add(capName)
      })
    })
    return Array.from(caps).sort()
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

      // Filter by capabilities
      if (selectedCapabilities.value.length > 0) {
        const pokemonCaps = p.capabilities?.map(cap => cap.replace(/\s*\d+\s*$/, '').trim()) || []
        if (!selectedCapabilities.value.every(cap => pokemonCaps.includes(cap))) {
          return false
        }
      }

      // Filter for starters only
      if (startersOnly.value) {
        const pokemonCaps = p.capabilities?.map(cap => cap.replace(/\s*\d+\s*$/, '').trim()) || []
        const hasUnderdog = pokemonCaps.includes('Underdog')
        const isUnevolved = !p.evolution?.length || p.evolution[0]?.stage === 1 && p.evolution[0]?.name === p.name
        const isLegendary = pokemonCaps.includes('Legendary')

        // Blacklist of legendaries and ultra beasts that have Underdog
        const legendaryBlacklist = [
          'Cosmog', 'Cosmoem', 'Type: Null', 'Meltan', 'Kubfu',
          // Ultra Beasts
          'Poipole', 'Naganadel', 'Nihilego', 'Buzzwole', 'Pheromosa',
          'Xurkitree', 'Celesteela', 'Kartana', 'Guzzlord', 'Stakataka', 'Blacephalon'
        ]
        const isBlacklisted = legendaryBlacklist.includes(p.name)

        if (!hasUnderdog || !isUnevolved || isLegendary || isBlacklisted) {
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
    selectedCapabilities.value = []
    startersOnly.value = false
  }

  return {
    pokemon,
    types,
    searchQuery,
    selectedTypes,
    selectedHabitat,
    selectedSize,
    selectedCapabilities,
    startersOnly,
    allTypes,
    allHabitats,
    allSizes,
    allCapabilities,
    filteredPokemon,
    getTypeColor,
    getPokemonByName,
    clearFilters
  }
}
