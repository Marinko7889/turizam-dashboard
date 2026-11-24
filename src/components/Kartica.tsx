import type { ReactNode } from 'react'

interface Props {
  naslov: string
  vrijednost: string
  opis?: ReactNode
  naglasak?: 'pozitivno' | 'negativno' | 'neutralno'
}

const boje = {
  pozitivno: 'text-emerald-600',
  negativno: 'text-rose-600',
  neutralno: 'text-slate-500',
}

export function Kartica({ naslov, vrijednost, opis, naglasak = 'neutralno' }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{naslov}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{vrijednost}</p>
      {opis && <p className={`mt-1 text-sm ${boje[naglasak]}`}>{opis}</p>}
    </div>
  )
}
