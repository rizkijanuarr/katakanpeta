import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useScraperViewModel } from '../ViewModel/ScraperViewModel'
import { Search, Loader2, Star, MapPin, Phone, Globe, ExternalLink, Eye } from 'lucide-react'
import { useState } from 'react'
import { ScrapeLog } from '../Repository/ScraperRepository'

const scrapeFormSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  num: z.coerce.number().min(1).max(100).default(10),
  page: z.coerce.number().min(1).default(1),
})

type ScrapeFormValues = z.infer<typeof scrapeFormSchema>

interface PlaceRow {
  id: string
  logId: string
  query: string
  scrapeDate: string
  position: number
  title: string
  types: string[]
  rating: number | null
  ratingCount: number | null
  address: string | null
  lat: number | null
  lng: number | null
  website: string | null
  phoneNumber: string | null
  openingHours: string | null
  thumbnailUrl: string | null
  type: string | null
  bookingLinks: string[]
  placeId: string
}

function flattenLogsToPlaces(logs: ScrapeLog[]): PlaceRow[] {
  const places: PlaceRow[] = []
  logs.forEach((log) => {
    const placesArray = log.response_body?.places || []
    placesArray.forEach((place: any) => {
      const openingHoursStr = place.openingHours
        ? Object.entries(place.openingHours).map(([day, hours]) => `${day}: ${hours}`).join(', ')
        : null

      places.push({
        id: `${log.id}-${place.position}`,
        logId: log.id,
        query: log.query,
        scrapeDate: new Date(log.createddate).toLocaleString(),
        position: place.position,
        title: place.title || '-',
        types: place.types || [],
        rating: place.rating || null,
        ratingCount: place.ratingCount || null,
        address: place.address || null,
        lat: place.latitude || null,
        lng: place.longitude || null,
        website: place.website || null,
        phoneNumber: place.phoneNumber || null,
        openingHours: openingHoursStr,
        thumbnailUrl: place.thumbnailUrl || null,
        type: place.type || null,
        bookingLinks: place.bookingLinks || [],
        placeId: place.placeId || '',
      })
    })
  })
  return places
}

function PlaceDetailDialog({ place, open, onOpenChange }: { place: PlaceRow | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!place) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-start gap-4'>
            {place.thumbnailUrl && (
              <img src={place.thumbnailUrl} alt={place.title} className='h-16 w-16 rounded-lg object-cover flex-shrink-0' />
            )}
            <div>
              {place.title}
              <p className='text-sm text-muted-foreground font-normal'>{place.type}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            Scraped from: {place.query} • {place.scrapeDate}
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          {/* Rating */}
          {place.rating && (
            <div className='flex items-center gap-4'>
              <div className='w-32 text-sm text-muted-foreground'>Rating</div>
              <div className='flex items-center gap-1'>
                <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                <span className='font-bold text-lg'>{place.rating}</span>
                <span className='text-sm text-muted-foreground'>({place.ratingCount} reviews)</span>
              </div>
            </div>
          )}

          {/* Address */}
          {place.address && (
            <div className='flex items-start gap-4'>
              <div className='w-32 text-sm text-muted-foreground flex items-center gap-1'>
                <MapPin className='h-4 w-4' />
                Address
              </div>
              <div className='flex-1'>{place.address}</div>
            </div>
          )}

          {/* Coordinates */}
          {place.lat && place.lng && (
            <div className='flex items-center gap-4'>
              <div className='w-32 text-sm text-muted-foreground'>Coordinates</div>
              <div className='font-mono text-sm'>{place.lat.toFixed(6)}, {place.lng.toFixed(6)}</div>
            </div>
          )}

          {/* Google Maps Embed */}
          {place.lat && place.lng && (
            <div className='flex flex-col gap-2'>
              <div className='w-32 text-sm text-muted-foreground'>Location</div>
              <div className='w-full h-[300px] rounded-lg overflow-hidden border'>
                <iframe
                  width='100%'
                  height='100%'
                  frameBorder='0'
                  scrolling='no'
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://maps.google.com/maps?q=${place.lat},${place.lng}&z=15&output=embed`}
                  title={`Map for ${place.title}`}
                />
              </div>
              <a
                href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-xs text-blue-500 hover:underline flex items-center gap-1'
              >
                <MapPin className='h-3 w-3' />
                Open in Google Maps
                <ExternalLink className='h-3 w-3' />
              </a>
            </div>
          )}

          {/* Phone */}
          {place.phoneNumber && (
            <div className='flex items-center gap-4'>
              <div className='w-32 text-sm text-muted-foreground flex items-center gap-1'>
                <Phone className='h-4 w-4' />
                Phone
              </div>
              <div>{place.phoneNumber}</div>
            </div>
          )}

          {/* Website */}
          {place.website && (
            <div className='flex items-center gap-4'>
              <div className='w-32 text-sm text-muted-foreground flex items-center gap-1'>
                <Globe className='h-4 w-4' />
                Website
              </div>
              <a
                href={place.website}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-500 hover:underline flex items-center gap-1'
              >
                {place.website}
                <ExternalLink className='h-3 w-3' />
              </a>
            </div>
          )}

          {/* Opening Hours */}
          {place.openingHours && (
            <div className='flex items-start gap-4'>
              <div className='w-32 text-sm text-muted-foreground'>Opening Hours</div>
              <div className='text-sm whitespace-pre-line'>{place.openingHours.replace(/, /g, '\n')}</div>
            </div>
          )}

          {/* Booking Links */}
          {place.bookingLinks && place.bookingLinks.length > 0 && (
            <div className='flex items-start gap-4'>
              <div className='w-32 text-sm text-muted-foreground'>Booking</div>
              <div className='space-y-1'>
                {place.bookingLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-500 hover:underline text-sm block'
                  >
                    Booking Link {i + 1}
                    <ExternalLink className='h-3 w-3 inline ml-1' />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Place ID */}
          {place.placeId && (
            <div className='flex items-center gap-4'>
              <div className='w-32 text-sm text-muted-foreground'>Place ID</div>
              <code className='text-xs bg-muted px-2 py-1 rounded'>{place.placeId}</code>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ScraperScreen() {
  const { isLoading, logsLoading, logs, handleScrape } = useScraperViewModel()
  const [selectedPlace, setSelectedPlace] = useState<PlaceRow | null>(null)

  const form = useForm<ScrapeFormValues>({
    resolver: zodResolver(scrapeFormSchema),
    defaultValues: {
      query: '',
      num: 10,
      page: 1,
    },
  })

  const onSubmit = async (data: ScrapeFormValues) => {
    await handleScrape(data)
    form.reset({ query: data.query, num: data.num, page: data.page })
  }

  const places = flattenLogsToPlaces(logs)

  return (
    <>
      <Header breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Scraper' }]} />

      <Main>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold tracking-tight'>Google Maps Scraper</h1>
          <p className='text-muted-foreground mt-1'>
            Search and scrape business data from Google Maps
          </p>
        </div>

        {/* Search Form */}
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Search className='h-5 w-5' />
              Search Query
            </CardTitle>
            <CardDescription>
              Enter your search query to find businesses on Google Maps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <FormField
                  control={form.control}
                  name='query'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Search Query</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g., restaurant jakarta, coffee shop bandung' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='num'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Results Count</FormLabel>
                        <FormControl>
                          <Input type='number' min={1} max={100} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='page'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Page</FormLabel>
                        <FormControl>
                          <Input type='number' min={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type='submit' disabled={isLoading} className='w-full'>
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Scraping...
                    </>
                  ) : (
                    <>
                      <Search className='mr-2 h-4 w-4' />
                      Scrape Now
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Scraped Results</CardTitle>
            <CardDescription>
              {places.length} places from {logs.length} scrape operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className='space-y-3'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className='h-16 w-full' />
                ))}
              </div>
            ) : places.length > 0 ? (
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Query</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {places.map((place) => (
                      <TableRow key={place.id}>
                        <TableCell className='font-medium'>
                          <Badge variant='outline'>{place.position}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className='font-medium truncate max-w-[200px]' title={place.title}>
                              {place.title}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {place.type && (
                            <Badge variant='secondary'>{place.type}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {place.rating ? (
                            <div className='flex items-center gap-1'>
                              <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                              <span className='font-medium'>{place.rating}</span>
                              <span className='text-xs text-muted-foreground'>({place.ratingCount})</span>
                            </div>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <span className='text-xs text-muted-foreground'>{place.query}</span>
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button variant='ghost' size='sm' onClick={() => setSelectedPlace(place)}>
                            <Eye className='mr-1 h-4 w-4' />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className='flex h-[300px] flex-col items-center justify-center text-center'>
                <Search className='h-12 w-12 text-muted-foreground mb-4 opacity-50' />
                <h2 className='text-xl font-semibold mb-2'>No results yet</h2>
                <p className='text-muted-foreground'>
                  Start scraping to see business data here
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Place Detail Dialog */}
        <PlaceDetailDialog
          place={selectedPlace}
          open={!!selectedPlace}
          onOpenChange={(open) => !open && setSelectedPlace(null)}
        />
      </Main>
    </>
  )
}
