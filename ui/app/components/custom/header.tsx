import { Link, useResolvedPath } from '@remix-run/react'

export default function Header() {
  return (
    <header>
      <div className="py-6">
        <Link to="/">
          <img src="/buildfast.svg" alt="logo" className="w-6 h-6 inline" />
          <span className="font-bold">Habitchain</span>
        </Link>
      </div>
    </header>
  )
}
