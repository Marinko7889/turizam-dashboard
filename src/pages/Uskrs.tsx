import { useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Kartica } from '../components/Kartica'
import { Odabir } from '../components/Odabir'
import { Panel } from '../components/Panel'
import { StranicaSPodacima } from '../components/StranicaSPodacima'
import { BOJE, MARGINE, OS } from '../lib/grafovi'
import { formatPosto } from '../lib/format'
import { COVID_GODINE, godisnje, poMjesecima } from '../lib/statistika'
import { duhovi, formatDan, uskrs } from '../lib/uskrs'
import type { TurizamPodaci } from '../types'

const GODINE_ODABIR = Array.from({ length: 2035 - 2012 + 1 }, (_, i) => 2012 + i)

export default function Uskrs() {
  return <StranicaSPodacima>{(p) => <UskrsSadrzaj podaci={p} />}</StranicaSPodacima>
}

function UskrsSadrzaj({ podaci }: { podaci: TurizamPodaci }) {
  const { mjesecno } = podaci
  const [godina, setGodina] = useState(2027)

  const datumUskrsa = uskrs(godina)
  const datumDuhova = duhovi(godina)

  // udio travnja u ožujak + travanj + svibanj, bez covid godina
  const graf = useMemo(
    () =>
      godisnje(mjesecno)
        .filter((g) => !COVID_GODINE.includes(g.godina))
        .map(({ godina: g }) => {
          const m = poMjesecima(mjesecno, g)
          const u = uskrs(g)
          return {
            godina: g,
            udio: (m[3] / (m[2] + m[3] + m[4])) * 100,
            uTravnju: u.getMonth() === 3,
            datum: u.toLocaleDateString('hr-HR', { day: 'numeric', month: 'numeric' }),
          }
        }),
    [mjesecno],
  )

  const prosjek = (lista: typeof graf) => lista.reduce((s, g) => s + g.udio, 0) / (lista.length || 1)
  const travanj = graf.filter((g) => g.uTravnju)
  const ozujak = graf.filter((g) => !g.uTravnju)
  const odabrana = graf.find((g) => g.godina === godina)

  return (
    <div className="space-y-6">
      <Panel
        naslov="Kad je Uskrs?"
        podnaslov="Uskrs i Duhovi svake godine padaju na drugi datum i sele turiste iz mjeseca u mjesec"
        akcije={<Odabir oznaka="Godina" vrijednost={godina} opcije={GODINE_ODABIR} onChange={setGodina} />}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Kartica naslov={`Uskrs ${godina}.`} vrijednost={formatDan(datumUskrsa)} />
          <Kartica
            naslov={`Duhovi ${godina}.`}
            vrijednost={formatDan(datumDuhova)}
            opis="praznici u Njemačkoj i Austriji"
          />
          <Kartica
            naslov="Udio travnja u proljeću"
            vrijednost={odabrana ? formatPosto(odabrana.udio) : '–'}
            opis={
              odabrana
                ? datumUskrsa.getMonth() === 3 ? 'Uskrs je bio u travnju' : 'Uskrs je bio u ožujku'
                : 'nema podataka za ovu godinu'
            }
          />
        </div>
      </Panel>

      <Panel
        naslov="Udio travnja u noćenjima ožujka, travnja i svibnja"
        podnaslov="plavo: Uskrs u travnju · žuto: Uskrs u ožujku (bez 2020. i 2021.)"
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={graf} margin={MARGINE}>
              <CartesianGrid stroke={BOJE.mreza} vertical={false} />
              <XAxis dataKey="godina" tick={OS} />
              <YAxis tick={OS} width={40} unit="%" domain={[0, 40]} />
              <ReferenceLine y={prosjek(graf)} stroke={BOJE.siva} strokeDasharray="4 4" />
              <Tooltip
                formatter={(v) => [formatPosto(Number(v)), 'Udio travnja']}
                labelFormatter={(g) => {
                  const red = graf.find((x) => x.godina === Number(g))
                  return red ? `${g}. (Uskrs ${red.datum})` : String(g)
                }}
              />
              <Bar dataKey="udio" radius={[4, 4, 0, 0]}>
                {graf.map((g) => (
                  <Cell key={g.godina} fill={g.uTravnju ? BOJE.glavna : BOJE.druga} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Kartica naslov="Uskrs u travnju" vrijednost={formatPosto(prosjek(travanj))} opis={`prosjek, ${travanj.length} godina`} />
          <Kartica naslov="Uskrs u ožujku" vrijednost={formatPosto(prosjek(ozujak))} opis={`prosjek, ${ozujak.length} godine`} />
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Svaka godina s Uskrsom u travnju imala je jači travanj od svake godine s Uskrsom u ožujku. Bitan je i datum: kad je
          Uskrs početkom travnja, dio praznika padne u ožujak, pa je efekt slabiji.
        </p>
      </Panel>
    </div>
  )
}
