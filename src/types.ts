export interface Mjesec {
  datum: string // "2024-07"
  godina: number
  mjesec: number // 1-12
  nocenja: number
  temp: number | null
  covid: 0 | 1
  uskrs: 0 | 1
  duhovi: 0 | 1
}

export type ModelKljuc = 'baseline' | 'sarima' | 'lightgbm'

export interface PrognozaMjesec {
  datum: string
  baseline: number
  sarima: number
  lightgbm: number
}

export interface RezultatModela {
  model: string
  mae: number
  mape: number
}

export interface TurizamPodaci {
  mjesecno: Mjesec[]
  prognoza: PrognozaMjesec[]
  modeli: RezultatModela[]
}
