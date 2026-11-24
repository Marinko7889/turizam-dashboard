import type { Mjesec } from '../types'

export interface Godina {
  godina: number
  nocenja: number
  covid: boolean
}

/** Zbroj noćenja po godini, samo za godine koje imaju svih 12 mjeseci. */
export function godisnje(podaci: Mjesec[]): Godina[] {
  const mapa = new Map<number, { zbroj: number; mjeseci: number; covid: boolean }>()
  for (const m of podaci) {
    const g = mapa.get(m.godina) ?? { zbroj: 0, mjeseci: 0, covid: false }
    g.zbroj += m.nocenja
    g.mjeseci += 1
    g.covid ||= m.covid === 1
    mapa.set(m.godina, g)
  }
  return [...mapa.entries()]
    .filter(([, g]) => g.mjeseci === 12)
    .map(([godina, g]) => ({ godina, nocenja: g.zbroj, covid: g.covid }))
    .sort((a, b) => a.godina - b.godina)
}

/** Noćenja po mjesecu za jednu godinu, kao niz od 12 brojeva (0 ako mjesec nedostaje). */
export function poMjesecima(podaci: Mjesec[], godina: number): number[] {
  const niz = new Array<number>(12).fill(0)
  for (const m of podaci) if (m.godina === godina) niz[m.mjesec - 1] = m.nocenja
  return niz
}

/** Koliki dio godine (u %) otpada na zadane mjesece. */
export function udio(podaci: Mjesec[], godina: number, mjeseci: number[]): number {
  const niz = poMjesecima(podaci, godina)
  const ukupno = niz.reduce((a, b) => a + b, 0)
  const dio = mjeseci.reduce((a, m) => a + niz[m - 1], 0)
  return ukupno ? (dio / ukupno) * 100 : 0
}

/** Prosjek po mjesecu kroz sve godine bez covida. */
export function prosjekPoMjesecu(podaci: Mjesec[]): number[] {
  const zbroj = new Array<number>(12).fill(0)
  const broj = new Array<number>(12).fill(0)
  for (const m of podaci) {
    if (m.covid) continue
    zbroj[m.mjesec - 1] += m.nocenja
    broj[m.mjesec - 1] += 1
  }
  return zbroj.map((z, i) => (broj[i] ? z / broj[i] : 0))
}

export const COVID_GODINE = [2020, 2021]
