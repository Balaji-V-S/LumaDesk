import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Lumadesk</span>
            <img
              className="h-16 w-auto"
              src="/assets/lumadesk-logo.png"
              alt="Lumadesk Logo"
            />
          </Link>
        </div>
        
        {/* Get Started Button */}
        <div className="flex flex-1 justify-end">
          <Link
            to="/welcome"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  )
}