import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/core/store/authStore'

function Navbar() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  return (
    <nav className='flex items-center justify-between border-b px-8 py-4 lg:px-16'>
      <Link
        to='/'
        className='font-["Bebas_Neue"] text-2xl tracking-[-0.5px] text-black hover:opacity-80'
      >
        KatakanPeta
      </Link>
      <div className='flex items-center gap-7'>
        {isLoggedIn ? (
          <Link to='/dashboard'>
            <Button className='rounded bg-black px-6 py-3 font-medium text-white hover:bg-neutral-800 hover:-translate-y-0.5 transition-all'>
              Kembali ke Dashboard
            </Button>
          </Link>
        ) : (
          <>
            <Link
              to='/sign-in-2'
              className='text-base font-medium text-black transition-opacity hover:opacity-60'
            >
              Sign in
            </Link>
            <Link to='/sign-up'>
              <Button className='rounded bg-black px-6 py-3 font-medium text-white hover:bg-neutral-800 hover:-translate-y-0.5 transition-all'>
                Get Started
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

function HeroSection() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  return (
    <main
      className='flex flex-1 flex-col items-center justify-center px-8 text-center'
    >
      <h1 className='font-["Bebas_Neue"] mb-4 max-w-[820px] text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[0.5px] text-black'>
        Cari data klien seharga esteh di warung!
      </h1>
      <p className='mx-auto mb-6 max-w-[520px] text-[clamp(0.9rem,1.8vw,1.1rem)] leading-[1.6] text-neutral-500'>
        KatakanPeta membantu kamu menemukan ratusan calon klien dari Google Maps secara otomatis.
      </p>
      {isLoggedIn ? (
        <Link to='/dashboard'>
          <Button className='rounded bg-black px-8 py-3 text-base font-medium text-white hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-lg transition-all'>
            Kembali ke Dashboard
          </Button>
        </Link>
      ) : (
        <Link to='/sign-up'>
          <Button className='rounded bg-black px-8 py-3 text-base font-medium text-white hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-lg transition-all'>
            Mulai Sekarang
          </Button>
        </Link>
      )}
    </main>
  )
}

function Footer() {
  return (
    <footer className='border-t px-8 py-3 text-center text-sm text-neutral-500 lg:px-16'>
      Crafted by{' '}
      <a
        href='https://www.rzkjanuarr.com'
        target='_blank'
        rel='noopener noreferrer'
        className='text-neutral-500 transition-colors hover:text-black'
      >
        www.rzkjanuarr.com
      </a>
    </footer>
  )
}

export function LandingScreen() {
  return (
    <div className='flex h-screen flex-col'>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <Navbar />
      <HeroSection />
      <Footer />
    </div>
  )
}
