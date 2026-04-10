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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useScraperViewModel } from '../ViewModel/ScraperViewModel'
import { Search, Loader2, Star, MapPin, Phone, Globe, ExternalLink } from 'lucide-react'
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
  address: string | null
  lat: number | null
  lng: number | null
  ratingCount: number | null
  website: string | null
  phoneNumber: string | null
  openingHours: string | null
  thumbnailUrl: string | null
  type: string | null
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
        address: place.address || null,
        lat: place.latitude || null,
        lng: place.longitude || null,
        ratingCount: place.ratingCount || null,
        website: place.website || null,
        phoneNumber: place.phoneNumber || null,
        openingHours: openingHoursStr,
        thumbnailUrl: place.thumbnailUrl || null,
        type: place.type || null,
      })
    })
  })
  return places
}

export function ScraperScreen() {
  const { isLoading, logsLoading, scrapeResult, logs, handleScrape, fetchLogs } =
    useScraperViewModel()

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
      <Header />

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
              {places.length} places found from {logs.length} scrape operations
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
              <div className='rounded-md border overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Lat / Lng</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Opening Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {places.map((place) => (
                      <TableRow key={place.id}>
                        <TableCell className='font-medium'>
                          <Badge variant='outline'>{place.position}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className='max-w-[200px]'>
                            <p className='font-medium truncate' title={place.title}>
                              {place.title}
                            </p>
                            <p className='text-xs text-muted-foreground truncate' title={place.query}>
                              {place.query}
                            </p>
                            <p className='text-xs text-muted-foreground'>{place.scrapeDate}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {place.type && (
                            <Badge variant='secondary'>{place.type}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {place.rating && (
                            <div className='flex items-center gap-1'>
                              <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                              <span className='font-medium'>{place.rating}</span>
                              <span className='text-xs text-muted-foreground'>({place.ratingCount})</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className='flex items-start gap-1 max-w-[150px]'>
                            <MapPin className='h-3 w-3 mt-1 flex-shrink-0' />
                            <span className='text-xs truncate' title={place.address || '-'}>
                              {place.address || '-'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {place.lat && place.lng ? (
                            <span className='text-xs'>
                              {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                            </span>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          {place.website ? (
                            <a
                              href={place.website}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-xs text-blue-500 hover:underline flex items-center gap-1'
                            >
                              <Globe className='h-3 w-3' />
                              Website
                              <ExternalLink className='h-3 w-3' />
                            </a>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          {place.phoneNumber ? (
                            <span className='text-xs flex items-center gap-1'>
                              <Phone className='h-3 w-3' />
                              {place.phoneNumber}
                            </span>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          {place.openingHours ? (
                            <span className='text-xs max-w-[150px] truncate' title={place.openingHours}>
                              {place.openingHours}
                            </span>
                          ) : (
                            '-'
                          )}
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
      </Main>
    </>
  )
}
