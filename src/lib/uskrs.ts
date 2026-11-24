/** Datum Uskrsa za zadanu godinu (gregorijanski kalendar, "anonymous" algoritam). */
export function uskrs(godina: number): Date {
  const a = godina % 19
  const b = Math.floor(godina / 100)
  const c = godina % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const mjesec = Math.floor((h + l - 7 * m + 114) / 31)
  const dan = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(godina, mjesec - 1, dan)
}

/** Duhovi su 49 dana nakon Uskrsa. */
export function duhovi(godina: number): Date {
  const d = uskrs(godina)
  d.setDate(d.getDate() + 49)
  return d
}

export const formatDan = (d: Date) =>
  d.toLocaleDateString('hr-HR', { weekday: 'long', day: 'numeric', month: 'long' })
