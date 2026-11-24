import { NavLink, Outlet } from 'react-router-dom'

const LINKOVI = [
  { to: '/', naziv: 'Pregled' },
  { to: '/sezona', naziv: 'Sezona' },
  { to: '/prognoza', naziv: 'Prognoza' },
  { to: '/uskrs', naziv: 'Uskrs' },
]

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-gradient-to-r from-more-900 to-more-700 text-white">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-4">
          <p className="text-sm text-more-100">Eurostat · Open-Meteo · 2012.–2026.</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Turizam u Hrvatskoj</h1>
          <nav className="mt-4 flex gap-1 overflow-x-auto">
            {LINKOVI.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition ${
                    isActive ? 'bg-white text-more-900' : 'text-more-50 hover:bg-white/15'
                  }`
                }
              >
                {l.naziv}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        Podaci: Eurostat (tour_occ_nim), Open-Meteo. Analiza i modeli u Pythonu, prikaz u Reactu.
      </footer>
    </div>
  )
}
