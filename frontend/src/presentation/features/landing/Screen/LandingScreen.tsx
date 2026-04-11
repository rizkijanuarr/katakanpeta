import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/core/store/authStore'

function Navbar() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  return (
    <nav className='flex items-center justify-between border-b px-8 py-6 lg:px-16 dark:border-neutral-800 dark:bg-neutral-950'>
      <Link
        to='/'
        className='font-["Bebas_Neue"] text-4xl tracking-[-0.5px] text-black hover:opacity-80 dark:text-white'
      >
        KatakanPeta
      </Link>
      <div className='flex items-center gap-7'>
        {isLoggedIn ? (
          <Link to='/dashboard'>
            <Button className='rounded bg-black px-6 py-6 font-medium text-white hover:bg-neutral-800 hover:-translate-y-0.5 transition-all dark:bg-white dark:text-black dark:hover:bg-neutral-200'>
              Kembali ke Dashboard
            </Button>
          </Link>
        ) : (
          <>
            <Link
              to='/sign-in-2'
              className='text-base font-medium text-black transition-opacity hover:opacity-60 dark:text-white'
            >
              Masuk
            </Link>
            <Link to='/sign-up'>
              <Button className='rounded bg-black px-6 py-6 font-medium text-white hover:bg-neutral-800 hover:-translate-y-0.5 transition-all dark:bg-white dark:text-black dark:hover:bg-neutral-200'>
                Daftar
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
      className='flex flex-1 flex-col items-center justify-center px-8 text-center dark:bg-neutral-950'
    >
      <h1 className='font-["Bebas_Neue"] mb-6 max-w-[820px] text-[clamp(3rem,7vw,5.5rem)] leading-[1.0] tracking-[1px] text-black dark:text-white'>
        Cari data klien seharga esteh di warung!
      </h1>
      <p className='mx-auto mb-8 max-w-[520px] text-[clamp(1rem,2vw,1.25rem)] leading-[1.6] text-neutral-500 dark:text-neutral-400'>
        KatakanPeta membantu kamu menemukan ratusan calon klien dari Google Maps secara otomatis.
      </p>
      {isLoggedIn ? (
        <Link to='/dashboard'>
          <Button className='rounded bg-black px-10 py-6 text-lg font-medium text-white hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-lg transition-all dark:bg-white dark:text-black dark:hover:bg-neutral-200'>
            Kembali ke Dashboard
          </Button>
        </Link>
      ) : (
        <Link to='/sign-up'>
          <Button className='rounded bg-black px-10 py-6 text-lg font-medium text-white hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-lg transition-all dark:bg-white dark:text-black dark:hover:bg-neutral-200'>
            Mulai Sekarang
          </Button>
        </Link>
      )}
    </main>
  )
}

function Footer() {
  return (
    <footer className='border-t px-8 py-4 text-center text-sm text-neutral-500 lg:px-16 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400'>
      Crafted by{' '}
      <a
        href='https://www.rzkjanuarr.com'
        target='_blank'
        rel='noopener noreferrer'
        className='text-neutral-500 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white'
      >
        www.rzkjanuarr.com
      </a>
    </footer>
  )
}

export function LandingScreen() {
  return (
    <div className='flex h-screen flex-col bg-white dark:bg-neutral-950'>
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
