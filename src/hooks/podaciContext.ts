import { createContext } from 'react'
import type { TurizamPodaci } from '../types'

export interface StanjePodataka {
  podaci: TurizamPodaci | null
  ucitava: boolean
  greska: string | null
}

export const PodaciContext = createContext<StanjePodataka | null>(null)
