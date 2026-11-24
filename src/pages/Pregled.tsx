import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ReferenceArea,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { Kartica } from '../components/Kartica'
import { Odabir } from '../components/Odabir'
import { Panel } from '../components/Panel'
import { StranicaSPodacima } from '../components/StranicaSPodacima'
import { BOJE, MARGINE, OS } from '../lib/grafovi'
import { formatDatum, formatMil, formatPosto, MJESECI_PUNO } from '../lib/format'
import { godisnje, prosjekPoMjesecu, udio } from '../lib/statistika'
import type { TurizamPodaci } from '../types'

export default function Pregled() {
  return <StranicaSPodacima>{(p) => <PregledSadrzaj podaci={p} />}</StranicaSPodacima>
}

function PregledSadrzaj({ podaci }: { podaci: TurizamPodaci }) {
  const { mjesecno } = podaci
  const godine = useMemo(() => godisnje(mjesecno), [mjesecno])
  const sveGodine = useMemo(() => [...new Set(mjesecno.map((m) => m.godina))], [mjesecno])

  // razdoblje u URL-u: ?od=2015&do=2024
  const [params, setParams] = useSearchParams()
  const prva = sveGodine[0]
  const zadnja = sveGodine[sveGodine.length - 1]
  const od = Math.max(prva, Number(params.get('od')) || prva)
  const doG = Math.min(zadnja, Number(params.get('do')) || zadnja)
  const postavi = (novoOd: number, novoDo: number) =>
    setParams({ od: String(novoOd), do: String(Math.max(novoOd, novoDo)) }, { replace: true })

  const mjesecniGraf = useMemo(
    () => mjesecno.filter((m) => m.godina >= od && m.godina <= doG).map((m) => ({ datum: m.datum, mil: m.nocenja / 1e6 })),
    [mjesecno, od, doG],
  )
  const godisnjiGraf = godine.filter((g) => g.godina >= od && g.godina <= doG)

  const zadnjaPuna = godine[godine.length - 1]
  const g2019 = godine.find((g) => g.godina === 2019)
  const prosjek = prosjekPoMjesecu(mjesecno)
  const najjaci = prosjek.indexOf(Math.max(...prosjek))
  const udioSpice = udio(mjesecno, zadnjaPuna.godina, [7, 8])
  const promjena2019 = g2019 ? (zadnjaPuna.nocenja / g2019.nocenja - 1) * 100 : 0

  // prosječni godišnji rast (CAGR)
  const rast = (a: number, b: number) => {
    const ga = godine.find((g) => g.godina === a)
    const gb = godine.find((g) => g.godina === b)
    return ga && gb ? ((gb.nocenja / ga.nocenja) ** (1 / (b - a)) - 1) * 100 : null
  }
  const rastPrije = rast(2012, 2019)
  const rastPoslije = rast(2022, zadnjaPuna.godina)

  const tickoviGodina = mjesecniGraf.filter((m) => m.datum.endsWith('-01')).map((m) => m.datum)
  const covidVidljiv = od <= 2021 && doG >= 2020

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kartica naslov={`Noćenja ${zadnjaPuna.godina}.`} vrijednost={formatMil(zadnjaPuna.nocenja)} opis="zadnja puna godina" />
        <Kartica
          naslov="U odnosu na 2019."
          vrijednost={formatPosto(promjena2019, true)}
          opis={promjena2019 >= 0 ? 'iznad razine prije covida' : 'ispod razine prije covida'}
          naglasak={promjena2019 >= 0 ? 'pozitivno' : 'negativno'}
        />
        <Kartica naslov="Najjači mjesec" vrijednost={MJESECI_PUNO[najjaci]} opis={`prosječno ${formatMil(prosjek[najjaci])}`} />
        <Kartica naslov="Udio srpnja i kolovoza" vrijednost={formatPosto(udioSpice)} opis={`godišnjih noćenja u ${zadnjaPuna.godina}.`} />
      </div>

      <Panel
        naslov="Noćenja po mjesecima"
        podnaslov="u milijunima; ružičasto je covid razdoblje"
        akcije={
          <div className="flex gap-3">
            <Odabir oznaka="Od" vrijednost={od} opcije={sveGodine} onChange={(v) => postavi(v, doG)} />
            <Odabir oznaka="Do" vrijednost={doG} opcije={sveGodine.filter((g) => g >= od)} onChange={(v) => postavi(od, v)} />
          </div>
        }
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mjesecniGraf} margin={MARGINE}>
              <CartesianGrid stroke={BOJE.mreza} vertical={false} />
              {covidVidljiv && (
                <ReferenceArea x1="2020-03" x2="2021-06" fill={BOJE.covid} fillOpacity={0.3} ifOverflow="hidden" />
              )}
              <XAxis dataKey="datum" ticks={tickoviGodina} tickFormatter={(d: string) => d.slice(0, 4)} tick={OS} />
              <YAxis tick={OS} width={40} />
              <Tooltip
                labelFormatter={(d) => formatDatum(String(d))}
                formatter={(v) => [`${Number(v).toFixed(2)} mil.`, 'Noćenja']}
              />
              <Line type="monotone" dataKey="mil" stroke={BOJE.glavna} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Panel naslov="Noćenja po godinama" podnaslov="samo pune godine, u milijunima">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={godisnjiGraf.map((g) => ({ ...g, mil: g.nocenja / 1e6 }))} margin={MARGINE}>
                  <CartesianGrid stroke={BOJE.mreza} vertical={false} />
                  <XAxis dataKey="godina" tick={OS} />
                  <YAxis tick={OS} width={40} />
                  <Tooltip formatter={(v) => [`${Number(v).toFixed(1)} mil.`, 'Noćenja']} />
                  <Bar dataKey="mil" radius={[4, 4, 0, 0]}>
                    {godisnjiGraf.map((g) => (
                      <Cell key={g.godina} fill={g.covid ? BOJE.covid : BOJE.glavna} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-2">
          <Panel naslov="Što podaci pokazuju">
            <ul className="space-y-3 text-sm leading-relaxed text-slate-700">
              {rastPrije !== null && (
                <li>
                  Od 2012. do 2019. noćenja su rasla prosječno <b>{formatPosto(rastPrije)}</b> godišnje.
                </li>
              )}
              <li>
                Covid je 2020. srušio noćenja na <b>{formatMil(godine.find((g) => g.godina === 2020)?.nocenja ?? 0)}</b>,
                a već 2022. turizam se vratio blizu razine iz 2019.
              </li>
              {rastPoslije !== null && (
                <li>
                  Od 2022. rast je puno sporiji, oko <b>{formatPosto(rastPoslije)}</b> godišnje.
                </li>
              )}
              <li>
                Srpanj i kolovoz i dalje nose oko <b>{formatPosto(udioSpice)}</b> noćenja, ali taj udio pada iz godine u godinu
                (vidi stranicu Sezona).
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  )
}
