import type { ReactNode } from 'react'

interface Props {
  naslov: string
  podnaslov?: string
  akcije?: ReactNode
  children: ReactNode
}

export function Panel({ naslov, podnaslov, akcije, children }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{naslov}</h2>
          {podnaslov && <p className="text-sm text-slate-500">{podnaslov}</p>}
        </div>
        {akcije}
      </div>
      {children}
    </section>
  )
}
