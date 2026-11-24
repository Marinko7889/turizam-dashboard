import type { ReactNode } from 'react'
import { useTurizamPodaci } from '../hooks/useTurizamPodaci'
import type { TurizamPodaci } from '../types'
import { Greska, Ucitavanje } from './Stanja'

export function StranicaSPodacima({ children }: { children: (podaci: TurizamPodaci) => ReactNode }) {
  const { podaci, ucitava, greska } = useTurizamPodaci()
  if (ucitava) return <Ucitavanje />
  if (greska || !podaci) return <Greska poruka={greska ?? 'Nepoznata greška'} />
  return <>{children(podaci)}</>
}
