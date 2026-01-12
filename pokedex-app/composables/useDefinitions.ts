import abilitiesData from '~/data/abilities.json'
import movesData from '~/data/moves.json'
import capabilitiesData from '~/data/capabilities.json'
import typesData from '~/data/types.json'

export interface Definition {
  type: 'ability' | 'move' | 'capability' | 'type' | 'pokemon'
  name: string
  description?: string
  moveType?: string
  abilityType?: string
  abilityTrigger?: string
  abilityEffect?: string
  color?: string
}

// Type effectiveness chart for PTU
const typeChart: Record<string, { strong: string[]; weak: string[]; immune: string[] }> = {
  Normal: { strong: [], weak: ['Rock', 'Steel'], immune: ['Ghost'] },
  Fire: { strong: ['Grass', 'Ice', 'Bug', 'Steel'], weak: ['Fire', 'Water', 'Rock', 'Dragon'], immune: [] },
  Water: { strong: ['Fire', 'Ground', 'Rock'], weak: ['Water', 'Grass', 'Dragon'], immune: [] },
  Electric: { strong: ['Water', 'Flying'], weak: ['Electric', 'Grass', 'Dragon'], immune: ['Ground'] },
  Grass: { strong: ['Water', 'Ground', 'Rock'], weak: ['Fire', 'Grass', 'Poison', 'Flying', 'Bug', 'Dragon', 'Steel'], immune: [] },
  Ice: { strong: ['Grass', 'Ground', 'Flying', 'Dragon'], weak: ['Fire', 'Water', 'Ice', 'Steel'], immune: [] },
  Fighting: { strong: ['Normal', 'Ice', 'Rock', 'Dark', 'Steel'], weak: ['Poison', 'Flying', 'Psychic', 'Bug', 'Fairy'], immune: ['Ghost'] },
  Poison: { strong: ['Grass', 'Fairy'], weak: ['Poison', 'Ground', 'Rock', 'Ghost'], immune: ['Steel'] },
  Ground: { strong: ['Fire', 'Electric', 'Poison', 'Rock', 'Steel'], weak: ['Grass', 'Bug'], immune: ['Flying'] },
  Flying: { strong: ['Grass', 'Fighting', 'Bug'], weak: ['Electric', 'Rock', 'Steel'], immune: [] },
  Psychic: { strong: ['Fighting', 'Poison'], weak: ['Psychic', 'Steel'], immune: ['Dark'] },
  Bug: { strong: ['Grass', 'Psychic', 'Dark'], weak: ['Fire', 'Fighting', 'Poison', 'Flying', 'Ghost', 'Steel', 'Fairy'], immune: [] },
  Rock: { strong: ['Fire', 'Ice', 'Flying', 'Bug'], weak: ['Fighting', 'Ground', 'Steel'], immune: [] },
  Ghost: { strong: ['Psychic', 'Ghost'], weak: ['Dark'], immune: ['Normal'] },
  Dragon: { strong: ['Dragon'], weak: ['Steel'], immune: ['Fairy'] },
  Dark: { strong: ['Psychic', 'Ghost'], weak: ['Fighting', 'Dark', 'Fairy'], immune: [] },
  Steel: { strong: ['Ice', 'Rock', 'Fairy'], weak: ['Fire', 'Water', 'Electric', 'Steel'], immune: [] },
  Fairy: { strong: ['Fighting', 'Dragon', 'Dark'], weak: ['Fire', 'Poison', 'Steel'], immune: [] }
}

export function useDefinitions() {
  const abilities = ref(abilitiesData as { name: string; type?: string; trigger?: string; effect?: string }[])
  const moves = ref(movesData as { name: string; type?: string }[])
  const capabilities = ref(capabilitiesData as { name: string; description?: string }[])
  const types = ref(typesData as Record<string, string>)

  const currentDefinition = ref<Definition | null>(null)
  const isModalOpen = ref(false)

  const lookupAbility = (name: string): Definition | null => {
    const ability = abilities.value.find(a => a.name.toLowerCase() === name.toLowerCase())
    if (ability) {
      return {
        type: 'ability',
        name: ability.name,
        abilityType: ability.type,
        abilityTrigger: ability.trigger,
        abilityEffect: ability.effect,
        description: ability.effect || `${ability.type ? ability.type.charAt(0).toUpperCase() + ability.type.slice(1) : 'Unknown'} Ability`
      }
    }
    return null
  }

  const lookupMove = (name: string): Definition | null => {
    const move = moves.value.find(m => m.name.toLowerCase() === name.toLowerCase())
    if (move) {
      return {
        type: 'move',
        name: move.name,
        moveType: move.type,
        color: move.type ? types.value[move.type] : undefined
      }
    }
    return null
  }

  const lookupCapability = (name: string): Definition | null => {
    const capability = capabilities.value.find(c =>
      c.name.toLowerCase() === name.toLowerCase() ||
      name.toLowerCase().startsWith(c.name.toLowerCase())
    )
    if (capability) {
      return {
        type: 'capability',
        name: capability.name,
        description: capability.description
      }
    }
    return null
  }

  const lookupType = (name: string): Definition | null => {
    const typeColor = types.value[name]
    if (typeColor) {
      const chart = typeChart[name]
      return {
        type: 'type',
        name: name,
        color: typeColor,
        description: chart ?
          `Strong vs: ${chart.strong.join(', ') || 'None'}\nWeak vs: ${chart.weak.join(', ') || 'None'}\nNo effect: ${chart.immune.join(', ') || 'None'}` :
          undefined
      }
    }
    return null
  }

  const lookup = (term: string, category?: string): Definition | null => {
    if (category === 'ability' || !category) {
      const ability = lookupAbility(term)
      if (ability) return ability
    }
    if (category === 'move' || !category) {
      const move = lookupMove(term)
      if (move) return move
    }
    if (category === 'capability' || !category) {
      const capability = lookupCapability(term)
      if (capability) return capability
    }
    if (category === 'type' || !category) {
      const type = lookupType(term)
      if (type) return type
    }
    return null
  }

  const showDefinition = (term: string, category?: string) => {
    const def = lookup(term, category)
    if (def) {
      currentDefinition.value = def
      isModalOpen.value = true
    }
  }

  const closeModal = () => {
    isModalOpen.value = false
    currentDefinition.value = null
  }

  const isKnownTerm = (term: string): boolean => {
    return lookup(term) !== null
  }

  return {
    abilities,
    moves,
    capabilities,
    types,
    typeChart,
    currentDefinition,
    isModalOpen,
    lookup,
    lookupAbility,
    lookupMove,
    lookupCapability,
    lookupType,
    showDefinition,
    closeModal,
    isKnownTerm
  }
}
