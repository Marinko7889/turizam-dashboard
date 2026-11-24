import { Link } from 'react-router-dom'

export default function NijePronadeno() {
  return (
    <div className="py-20 text-center">
      <p className="text-5xl font-bold text-more-700">404</p>
      <p className="mt-2 text-slate-600">Ova stranica ne postoji.</p>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-more-700 px-4 py-2 text-white hover:bg-more-900">
        Natrag na pregled
      </Link>
    </div>
  )
}
