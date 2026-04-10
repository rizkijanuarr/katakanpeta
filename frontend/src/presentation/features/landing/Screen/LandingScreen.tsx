import { Link } from '@tanstack/react-router'
import { MapPin, Search, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

function Navbar() {
  return (
    <nav className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <div className='flex items-center gap-2'>
          <MapPin className='h-6 w-6 text-primary' />
          <span className='text-xl font-bold'>KatakanPeta</span>
        </div>
        <div className='flex items-center gap-4'>
          <Link to='/sign-in-2'>
            <Button variant='ghost' size='sm'>
              Sign In
            </Button>
          </Link>
          <Link to='/sign-up'>
            <Button size='sm'>Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

function HeroSection() {
  return (
    <section className='container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-20 text-center'>
      <div className='mx-auto max-w-3xl space-y-8'>
        <div className='space-y-4'>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl'>
            Cari Data Klien dari{' '}
            <span className='text-primary'>Google Maps</span>
          </h1>
          <p className='mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl'>
            Platform otomatis untuk mencari dan mengumpulkan data calon klien
            dari Google Maps. Hemat waktu, tingkatkan konversi.
          </p>
        </div>

        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <Link to='/sign-up'>
            <Button size='lg' className='gap-2'>
              Mulai Sekarang
              <ArrowRight className='h-4 w-4' />
            </Button>
          </Link>
          <Link to='/sign-in-2'>
            <Button size='lg' variant='outline'>
              Sudah Punya Akun
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className='mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
        <div className='flex flex-col items-center space-y-3 rounded-lg border bg-card p-6 shadow-sm'>
          <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
            <Search className='h-6 w-6 text-primary' />
          </div>
          <h3 className='text-xl font-semibold'>Pencarian Otomatis</h3>
          <p className='text-sm text-muted-foreground'>
            Cari bisnis berdasarkan kata kunci dan lokasi secara otomatis
          </p>
        </div>

        <div className='flex flex-col items-center space-y-3 rounded-lg border bg-card p-6 shadow-sm'>
          <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
            <MapPin className='h-6 w-6 text-primary' />
          </div>
          <h3 className='text-xl font-semibold'>Data Lengkap</h3>
          <p className='text-sm text-muted-foreground'>
            Dapatkan alamat, rating, website, nomor telepon, dan lainnya
          </p>
        </div>

        <div className='flex flex-col items-center space-y-3 rounded-lg border bg-card p-6 shadow-sm sm:col-span-2 lg:col-span-1'>
          <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
            <Users className='h-6 w-6 text-primary' />
          </div>
          <h3 className='text-xl font-semibold'>Tingkatkan Konversi</h3>
          <p className='text-sm text-muted-foreground'>
            Temukan calon klien potensial dengan data yang akurat
          </p>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className='border-t bg-muted/40'>
      <div className='container mx-auto px-4 py-8 text-center text-sm text-muted-foreground'>
        <p>© 2026 KatakanPeta. All rights reserved.</p>
      </div>
    </footer>
  )
}

export function LandingScreen() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='flex-1'>
        <HeroSection />
      </main>
      <Footer />
    </div>
  )
}
