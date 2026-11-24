import { useContext } from 'react'
import { PodaciContext, type StanjePodataka } from './podaciContext'

export function useTurizamPodaci(): StanjePodataka {
  const stanje = useContext(PodaciContext)
  if (!stanje) throw new Error('useTurizamPodaci se mora koristiti unutar <PodaciProvider>')
  return stanje
}
