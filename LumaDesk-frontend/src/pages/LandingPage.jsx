// src/pages/LandingPage.jsx
import Navbar from '../components/layout/Navbar'
import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {/* Hero Section - This remains largely the same */}
      <main className="relative isolate flex flex-1 items-center px-6 lg:px-8">
        {/* Background gradient element (the blur) */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#c4b5fd] to-[#818cf8] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="mx-auto max-w-2xl py-24 sm:py-32">
          <div className="text-center">
            <h1 className="font-serif text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
              Effortless ticket resolution.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Streamline your support, resolve issues faster, and keep your
              team in sync. Lumadesk is the clean, simple, and powerful
              ticketing system your team will actually enjoy using.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/welcome"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get Started
              </Link>
              <Link
                to="#features"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* --- NEW SECTION: Image/Screenshot Below Hero --- */}
      <section className="relative overflow-hidden pt-16 sm:pt-24 lg:pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Main image container with subtle background */}
          <div className="relative isolate overflow-hidden rounded-xl bg-slate-500/10 px-6 pb-9 pt-16 shadow-2xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pb-0 lg:pt-0">
            {/* The background blob/shape below the image */}
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
              aria-hidden="true"
            >
              <circle
                cx={512}
                cy={512}
                r={512}
                fill="url(#827591b1-ce8c-4110-b064-7cb857930c25)"
                fillOpacity="0.7"
              />
              <defs>
                <radialGradient id="827591b1-ce8c-4110-b064-7cb857930c25">
                  <stop stopColor="#a78bfa" /> {/* Adjusted to a shade of indigo/purple */}
                  <stop offset={1} stopColor="#c4b5fd" /> {/* Adjusted to a lighter indigo/purple */}
                </radialGradient>
              </defs>
            </svg>

            {/* The actual image/screenshot, appearing like a tablet */}
            <div className="relative mx-auto max-w-md lg:mx-0 lg:flex-auto lg:py-32 lg:pb-0">
              <img
                className="w-[58rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                src="/assets/mock-img.jpg" // <--- REPLACE WITH YOUR DASHBOARD MOCKUP IMAGE
                alt="App screenshot"
                width={1824}
                height={1080}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}