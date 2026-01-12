import edgesData from '~/data/edges.json'
import featuresData from '~/data/features.json'
import pokeEdgesData from '~/data/poke-edges.json'

export interface Edge {
  name: string
  prerequisites: string
  effect: string
}

export interface Feature {
  name: string
  tags: string[]
  prerequisites: string
  frequency: string
  trigger?: string
  target?: string
  effect: string
}

export interface PokeEdge {
  name: string
  prerequisites: string
  cost: string
  effect: string
  tags?: string[]
}

export function useGameData() {
  const edges = ref(edgesData as Edge[])
  const features = ref(featuresData as Feature[])
  const pokeEdges = ref(pokeEdgesData as PokeEdge[])

  return {
    edges,
    features,
    pokeEdges
  }
}
