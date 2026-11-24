interface OdabirProps<T extends string | number> {
  oznaka: string
  vrijednost: T
  opcije: T[]
  onChange: (v: T) => void
  prikaz?: (v: T) => string
}

export function Odabir<T extends string | number>({ oznaka, vrijednost, opcije, onChange, prikaz }: OdabirProps<T>) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      {oznaka}
      <select
        className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-slate-800 focus:border-more-600 focus:outline-none"
        value={vrijednost}
        onChange={(e) => {
          const izabrana = opcije.find((o) => String(o) === e.target.value)
          if (izabrana !== undefined) onChange(izabrana)
        }}
      >
        {opcije.map((o) => (
          <option key={o} value={o}>
            {prikaz ? prikaz(o) : o}
          </option>
        ))}
      </select>
    </label>
  )
}

interface PrekidacProps<T extends string> {
  vrijednost: T
  opcije: { kljuc: T; naziv: string }[]
  onChange: (v: T) => void
}

export function Prekidac<T extends string>({ vrijednost, opcije, onChange }: PrekidacProps<T>) {
  return (
    <div className="inline-flex rounded-lg border border-slate-300 bg-slate-100 p-0.5" role="radiogroup">
      {opcije.map((o) => (
        <button
          key={o.kljuc}
          type="button"
          role="radio"
          aria-checked={vrijednost === o.kljuc}
          onClick={() => onChange(o.kljuc)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            vrijednost === o.kljuc ? 'bg-white text-more-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {o.naziv}
        </button>
      ))}
    </div>
  )
}
