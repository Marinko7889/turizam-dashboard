import { useEffect, useState, type ReactNode } from 'react'
import { PodaciContext, type StanjePodataka } from '../hooks/podaciContext'
import type { Mjesec, PrognozaMjesec, RezultatModela } from '../types'

async function dohvati<T>(putanja: string): Promise<T> {
  const odgovor = await fetch(putanja)
  if (!odgovor.ok) throw new Error(`${putanja}: ${odgovor.status}`)
  return odgovor.json() as Promise<T>
}

export function PodaciProvider({ children }: { children: ReactNode }) {
  const [stanje, setStanje] = useState<StanjePodataka>({ podaci: null, ucitava: true, greska: null })

  useEffect(() => {
    let otkazano = false
    const base = import.meta.env.BASE_URL

    Promise.all([
      dohvati<Mjesec[]>(`${base}data/mjesecno.json`),
      dohvati<PrognozaMjesec[]>(`${base}data/prognoza.json`),
      dohvati<RezultatModela[]>(`${base}data/modeli.json`),
    ])
      .then(([mjesecno, prognoza, modeli]) => {
        if (!otkazano) setStanje({ podaci: { mjesecno, prognoza, modeli }, ucitava: false, greska: null })
      })
      .catch((e: unknown) => {
        if (!otkazano) setStanje({ podaci: null, ucitava: false, greska: e instanceof Error ? e.message : String(e) })
      })

    return () => {
      otkazano = true
    }
  }, [])

  return <PodaciContext.Provider value={stanje}>{children}</PodaciContext.Provider>
}
