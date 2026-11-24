import { useMemo, useState } from 'react'
import {
  Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ReferenceArea,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { Kartica } from '../components/Kartica'
import { Odabir } from '../components/Odabir'
import { Panel } from '../components/Panel'
import { StranicaSPodacima } from '../components/StranicaSPodacima'
import { BOJE, MARGINE, OS } from '../lib/grafovi'
import { formatBodovi, formatPosto, MJESECI } from '../lib/format'
import { godisnje, poMjesecima, udio } from '../lib/statistika'
import type { TurizamPodaci } from '../types'

export default function Sezona() {
  return <StranicaSPodacima>{(p) => <SezonaSadrzaj podaci={p} />}</StranicaSPodacima>
}

function SezonaSadrzaj({ podaci }: { podaci: TurizamPodaci }) {
  const { mjesecno } = podaci
  const pune = useMemo(() => godisnje(mjesecno).map((g) => g.godina), [mjesecno])
  const zadnja = pune[pune.length - 1]

  const [godinaA, setGodinaA] = useState(pune.includes(2019) ? 2019 : pune[0])
  const [godinaB, setGodinaB] = useState(zadnja)

  const usporedba = useMemo(() => {
    const a = poMjesecima(mjesecno, godinaA)
    const b = poMjesecima(mjesecno, godinaB)
    return MJESECI.map((mjesec, i) => ({ mjesec, A: a[i] / 1e6, B: b[i] / 1e6 }))
  }, [mjesecno, godinaA, godinaB])

  const udjeli = useMemo(
    () =>
      pune.map((g) => ({
        godina: g,
        spica: udio(mjesecno, g, [7, 8]),
        okolo: udio(mjesecno, g, [5, 6, 9, 10]),
      })),
    [mjesecno, pune],
  )

  const prvi = udjeli[0]
  const zadnji = udjeli[udjeli.length - 1]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Kartica
          naslov={`Srpanj + kolovoz, ${prvi.godina}.`}
          vrijednost={formatPosto(prvi.spica)}
          opis="udio u godišnjim noćenjima"
        />
        <Kartica
          naslov={`Srpanj + kolovoz, ${zadnji.godina}.`}
          vrijednost={formatPosto(zadnji.spica)}
          opis={`${formatBodovi(zadnji.spica - prvi.spica)} od ${prvi.godina}.`}
          naglasak="pozitivno"
        />
        <Kartica
          naslov={`Svibanj, lipanj, rujan, listopad, ${zadnji.godina}.`}
          vrijednost={formatPosto(zadnji.okolo)}
          opis={`${formatBodovi(zadnji.okolo - prvi.okolo)} od ${prvi.godina}.`}
          naglasak="pozitivno"
        />
      </div>

      <Panel
        naslov="Usporedba dviju godina po mjesecima"
        podnaslov="noćenja u milijunima"
        akcije={
          <div className="flex gap-3">
            <Odabir oznaka="Godina A" vrijednost={godinaA} opcije={pune} onChange={setGodinaA} />
            <Odabir oznaka="Godina B" vrijednost={godinaB} opcije={pune} onChange={setGodinaB} />
          </div>
        }
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usporedba} margin={MARGINE}>
              <CartesianGrid stroke={BOJE.mreza} vertical={false} />
              <XAxis dataKey="mjesec" tick={OS} />
              <YAxis tick={OS} width={40} />
              <Tooltip formatter={(v, ime) => [`${Number(v).toFixed(2)} mil.`, ime]} />
              <Legend />
              <Bar dataKey="A" name={String(godinaA)} fill={BOJE.siva} radius={[4, 4, 0, 0]} />
              <Bar dataKey="B" name={String(godinaB)} fill={BOJE.glavna} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel
        naslov="Produljuje li se sezona?"
        podnaslov="udio u godišnjim noćenjima (%); covid godine su posebne jer su granice bile zatvorene izvan ljeta"
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={udjeli} margin={MARGINE}>
              <CartesianGrid stroke={BOJE.mreza} vertical={false} />
              <ReferenceArea x1={2020} x2={2021} fill={BOJE.covid} fillOpacity={0.3} ifOverflow="hidden" />
              <XAxis dataKey="godina" tick={OS} />
              <YAxis tick={OS} width={40} unit="%" />
              <Tooltip formatter={(v, ime) => [formatPosto(Number(v)), ime]} />
              <Legend />
              <Line dataKey="spica" name="Srpanj + kolovoz" stroke={BOJE.tamna} strokeWidth={2} />
              <Line dataKey="okolo" name="Svibanj, lipanj, rujan, listopad" stroke={BOJE.druga} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Udio špice pada, a udio predsezone i posezone raste. Budući da ukupni broj noćenja zadnjih godina raste sporo,
          izgleda da novi rast dolazi uglavnom izvan srpnja i kolovoza.
        </p>
      </Panel>
    </div>
  )
}
