import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useScraperViewModel } from '../ViewModel/ScraperViewModel'
import { ScrapeForm } from '../components/ScrapeForm'
import { Search, MapPin, Star, Phone, Globe, ExternalLink, History } from 'lucide-react'

export function ScraperScreen() {
  const {
    isLoading,
    logsLoading,
    scrapeResult,
    logs,
    handleScrape,
    fetchLogs,
    setScrapeResult,
  } = useScraperViewModel()

  const [showLogs, setShowLogs] = useState(false)

  if (showLogs) {
    return (
      <>
        <Header>
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>

        <Main>
          <div className='mb-8 flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold tracking-tight'>Scrape Logs</h1>
              <p className='text-muted-foreground mt-1'>Your scrape history</p>
            </div>
            <Button variant='outline' onClick={() => setShowLogs(false)}>
              <Search className='mr-2 h-4 w-4' />
              Back to Scraper
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Scrape History</CardTitle>
              <CardDescription>Your recent scrape operations</CardDescription>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className='space-y-3'>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className='h-16 w-full' />
                  ))}
                </div>
              ) : logs.length > 0 ? (
                <div className='space-y-3'>
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className='flex items-center justify-between rounded-lg border p-4'
                    >
                      <div>
                        <p className='font-medium'>{log.query}</p>
                        <p className='text-sm text-muted-foreground'>
                          {new Date(log.createddate).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant='secondary'>
                        {log.response_body?.places?.length || 0} results
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='py-8 text-center text-muted-foreground'>
                  <Search className='mx-auto h-8 w-8 mb-2 opacity-50' />
                  <p>No scrape logs yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </Main>
      </>
    )
  }

  return (
    <>
      <Header />

      <Main>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Google Maps Scraper</h1>
            <p className='text-muted-foreground mt-1'>
              Search and scrape business data from Google Maps
            </p>
          </div>
          <Button variant='outline' onClick={() => { setShowLogs(true); fetchLogs(); }}>
            <History className='mr-2 h-4 w-4' />
            View Logs
          </Button>
        </div>

        <ScrapeForm onSubmit={handleScrape} isLoading={isLoading} />

        {scrapeResult && (
          <Card className='mt-6'>
            <CardHeader>
              <CardTitle>Results: "{scrapeResult.query}"</CardTitle>
              <CardDescription>
                Found {scrapeResult.totalResults} places • {scrapeResult.creditsUsed} credits used
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scrapeResult.places.length > 0 ? (
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {scrapeResult.places.map((place) => (
                    <Card key={place.position} className='overflow-hidden'>
                      <CardHeader className='p-4 pb-3'>
                        <div className='flex items-start justify-between'>
                          <div>
                            <CardTitle className='text-base'>{place.title}</CardTitle>
                            <CardDescription className='flex items-center gap-1 mt-1'>
                              <MapPin className='h-3 w-3' />
                              {place.address}
                            </CardDescription>
                          </div>
                          <Badge variant='secondary'>#{place.position}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className='p-4 pt-0 space-y-2'>
                        {place.rating && (
                          <div className='flex items-center gap-1 text-sm'>
                            <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                            <span className='font-medium'>{place.rating}</span>
                            <span className='text-muted-foreground'>({place.ratingCount})</span>
                          </div>
                        )}
                        {place.type && (
                          <Badge variant='outline'>{place.type}</Badge>
                        )}
                        <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                          {place.phoneNumber && (
                            <span className='flex items-center gap-1'>
                              <Phone className='h-3 w-3' />
                              {place.phoneNumber}
                            </span>
                          )}
                          {place.website && (
                            <a
                              href={place.website}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='flex items-center gap-1 hover:text-foreground'
                            >
                              <Globe className='h-3 w-3' />
                              Website
                              <ExternalLink className='h-3 w-3' />
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className='py-8 text-center text-muted-foreground'>
                  <Search className='mx-auto h-8 w-8 mb-2 opacity-50' />
                  No results found
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </Main>
    </>
  )
}
