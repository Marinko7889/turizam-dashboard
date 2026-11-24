import { useMemo, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Kartica } from '../components/Kartica'
import { Prekidac } from '../components/Odabir'
import { Panel } from '../components/Panel'
import { StranicaSPodacima } from '../components/StranicaSPodacima'
import { BOJE, MARGINE, OS } from '../lib/grafovi'
import { formatBroj, formatDatum, formatMil, formatPosto } from '../lib/format'
import type { ModelKljuc, TurizamPodaci } from '../types'

const MODELI: { kljuc: ModelKljuc; naziv: string; opis: string }[] = [
  { kljuc: 'baseline', naziv: 'Baseline', opis: 'isti mjesec prošle godine' },
  { kljuc: 'sarima', naziv: 'SARIMA', opis: 'statistički model za sezonske nizove' },
  { kljuc: 'lightgbm', naziv: 'LightGBM', opis: 'strojno učenje na kalendarskim značajkama' },
]

export default function Prognoza() {
  return <StranicaSPodacima>{(p) => <PrognozaSadrzaj podaci={p} />}</StranicaSPodacima>
}

function PrognozaSadrzaj({ podaci }: { podaci: TurizamPodaci }) {
  const { mjesecno, prognoza, modeli } = podaci
  const [model, setModel] = useState<ModelKljuc>('baseline')

  const zadnjih24 = mjesecno.slice(-24)
  const zadnjih12 = mjesecno.slice(-12).reduce((s, m) => s + m.nocenja, 0)
  const ukupnoPrognoza = prognoza.reduce((s, p) => s + p[model], 0)
  const promjena = (ukupnoPrognoza / zadnjih12 - 1) * 100

  const graf = useMemo(() => {
    const stvarno = zadnjih24.map((m) => ({ datum: m.datum, stvarno: m.nocenja / 1e6, prognoza: null as number | null }))
    // da se linije spoje
    stvarno[stvarno.length - 1].prognoza = stvarno[stvarno.length - 1].stvarno
    const buduce = prognoza.map((p) => ({ datum: p.datum, stvarno: null as number | null, prognoza: p[model] / 1e6 }))
    return [...stvarno, ...buduce]
  }, [zadnjih24, prognoza, model])

  const poredani = [...modeli].sort((a, b) => a.mape - b.mape)
  const najbolji = poredani[0]
  const odabrani = MODELI.find((m) => m.kljuc === model)!

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Kartica naslov="Zadnjih 12 mjeseci" vrijednost={formatMil(zadnjih12)} opis="stvarna noćenja" />
        <Kartica
          naslov={`Idućih 12 mjeseci (${odabrani.naziv})`}
          vrijednost={formatMil(ukupnoPrognoza)}
          opis={`${formatPosto(promjena, true)} u odnosu na zadnjih 12`}
          naglasak={promjena >= 0 ? 'pozitivno' : 'negativno'}
        />
        <Kartica naslov="Najbolji model na testu" vrijednost={najbolji.model} opis={`prosječna greška ${formatPosto(najbolji.mape)}`} />
      </div>

      <Panel
        naslov="Prognoza za idućih 12 mjeseci"
        podnaslov={`${odabrani.naziv}: ${odabrani.opis}`}
        akcije={<Prekidac vrijednost={model} opcije={MODELI} onChange={setModel} />}
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graf} margin={MARGINE}>
              <CartesianGrid stroke={BOJE.mreza} vertical={false} />
              <XAxis dataKey="datum" tick={OS} tickFormatter={(d: string) => formatDatum(d)} interval={5} />
              <YAxis tick={OS} width={40} />
              <Tooltip
                labelFormatter={(d) => formatDatum(String(d))}
                formatter={(v, ime) => [v == null ? '-' : `${Number(v).toFixed(2)} mil.`, ime]}
              />
              <Legend />
              <Line dataKey="stvarno" name="Stvarno" stroke={BOJE.tamna} strokeWidth={2} dot={false} connectNulls={false} />
              <Line
                dataKey="prognoza"
                name="Prognoza"
                stroke={BOJE.druga}
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={{ r: 3 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel naslov="Usporedba modela" podnaslov="greška na zadnjih 12 mjeseci koje modeli nisu vidjeli">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-2 font-medium">Model</th>
                <th className="py-2 text-right font-medium">MAE (noćenja)</th>
                <th className="py-2 text-right font-medium">MAPE</th>
              </tr>
            </thead>
            <tbody>
              {poredani.map((m) => (
                <tr key={m.model} className={`border-b border-slate-100 ${m === najbolji ? 'bg-more-50 font-semibold' : ''}`}>
                  <td className="py-2">{m.model}</td>
                  <td className="py-2 text-right tabular-nums">{formatBroj(m.mae)}</td>
                  <td className="py-2 text-right tabular-nums">{formatPosto(m.mape)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel naslov="Zašto je pobijedio najjednostavniji model?">
          <div className="space-y-3 text-sm leading-relaxed text-slate-700">
            <p>
              Nakon 2022. turizam je vrlo stabilan, pa je "isto kao prošle godine" izvrsna prognoza. SARIMA i LightGBM su učili
              i iz razdoblja brzog rasta (2012.–2019.) i iz covida, a ti obrasci danas više ne vrijede.
            </p>
            <p>
              Baseline ipak ne zna za kalendar. Uskrs je 2027. u ožujku, a 2026. bio je u travnju, pa će travanj 2027.
              vjerojatno biti slabiji nego što baseline predviđa. SARIMA i LightGBM to uzimaju u obzir.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  )
}
