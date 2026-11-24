import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Ucitavanje } from './components/Stanja'
import { PodaciProvider } from './components/PodaciProvider'

const Pregled = lazy(() => import('./pages/Pregled'))
const Sezona = lazy(() => import('./pages/Sezona'))
const Prognoza = lazy(() => import('./pages/Prognoza'))
const Uskrs = lazy(() => import('./pages/Uskrs'))
const NijePronadeno = lazy(() => import('./pages/NijePronadeno'))

export default function App() {
  return (
    <PodaciProvider>
      <BrowserRouter>
        <Suspense fallback={<Ucitavanje />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Pregled />} />
              <Route path="sezona" element={<Sezona />} />
              <Route path="prognoza" element={<Prognoza />} />
              <Route path="uskrs" element={<Uskrs />} />
              <Route path="*" element={<NijePronadeno />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </PodaciProvider>
  )
}
