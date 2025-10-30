import { Link } from 'react-router-dom'

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        {/* Logo */}
        <Link to="/" className="inline-block">
          <img
            className="mx-auto h-12 w-auto"
            src="/assets/lumadesk-logo.png"
            alt="Lumadesk Logo"
          />
        </Link>
        
        <h2 className="mt-6 text-2xl font-semibold text-slate-800">
          Welcome to Lumadesk
        </h2>
        <p className="mt-2 text-slate-600">
          Sign in to your account or create a new one.
        </p>

        {/* Button Container */}
        <div className="mt-8 flex flex-col gap-4">
          {/* Login Button */}
          <Link
            to="/login"
            className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-base font-medium text-white shadow-sm transition-colors duration-150 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Login
          </Link>

          {/* Register Button */}
          <Link
            to="/register"
            className="w-full rounded-lg bg-white px-5 py-3 text-base font-medium text-indigo-600 shadow-sm ring-1 ring-inset ring-slate-300 transition-colors duration-150 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Register
          </Link>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-slate-500">
        Go back <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">Home</Link>
      </p>
    </div>
  )
}