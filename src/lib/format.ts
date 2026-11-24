export const MJESECI = ['Sij', 'Velj', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro']
export const MJESECI_PUNO = [
  'siječanj', 'veljača', 'ožujak', 'travanj', 'svibanj', 'lipanj',
  'srpanj', 'kolovoz', 'rujan', 'listopad', 'studeni', 'prosinac',
]

const broj = new Intl.NumberFormat('hr-HR')
const jednaDecimala = new Intl.NumberFormat('hr-HR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export const formatBroj = (n: number) => broj.format(Math.round(n))
export const formatMil = (n: number) => `${jednaDecimala.format(n / 1e6)} mil.`
export const formatPosto = (n: number, predznak = false) =>
  `${predznak && n > 0 ? '+' : ''}${jednaDecimala.format(n)} %`

/** "2024-07" -> "Srp 2024" */
export const formatDatum = (datum: string) => {
  const [g, m] = datum.split('-').map(Number)
  return `${MJESECI[m - 1]} ${g}`
}

/** Razlika dvaju postotaka: "-8,0 postotnih bodova" */
export const formatBodovi = (n: number) =>
  `${n > 0 ? '+' : ''}${jednaDecimala.format(n)} postotnih bodova`
