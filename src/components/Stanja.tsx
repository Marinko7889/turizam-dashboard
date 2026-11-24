export function Ucitavanje() {
  return (
    <div className="flex h-64 items-center justify-center gap-3 text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-more-600 border-t-transparent" />
      Učitavam podatke...
    </div>
  )
}

export function Greska({ poruka }: { poruka: string }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
      <p className="font-semibold">Podaci se nisu uspjeli učitati.</p>
      <p className="mt-1 text-sm">{poruka}</p>
    </div>
  )
}
