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
import { Search, Loader2, Eye } from 'lucide-react'
import { useState } from 'react'

const scrapeFormSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  num: z.coerce.number().min(1).max(100).default(10),
  page: z.coerce.number().min(1).default(1),
})

type ScrapeFormValues = z.infer<typeof scrapeFormSchema>

export function ScraperScreen() {
  const {
    isLoading,
    logsLoading,
    scrapeResult,
    logs,
    handleScrape,
    fetchLogs,
  } = useScraperViewModel()

  const [showResponse, setShowResponse] = useState<string | null>(null)

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

        {/* Action Form */}
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

        {/* Scrape History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Scrape History</CardTitle>
            <CardDescription>Your recent scrape operations</CardDescription>
          </CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className='space-y-3'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className='h-16 w-full' />
                ))}
              </div>
            ) : logs.length > 0 ? (
              <div className='rounded-md border'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Query</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Results</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className='font-medium'>{log.query}</TableCell>
                        <TableCell>
                          {new Date(log.createddate).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant='secondary'>
                            {log.response_body?.places?.length || 0}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline'>
                            {log.response_body?.credits || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => setShowResponse(showResponse === log.id ? null : log.id)}
                          >
                            <Eye className='mr-1 h-4 w-4' />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Response Body Viewer */}
                {showResponse && (
                  <div className='border-t p-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <h4 className='font-medium'>Response Details</h4>
                      <Button variant='ghost' size='sm' onClick={() => setShowResponse(null)}>
                        Close
                      </Button>
                    </div>
                    <pre className='bg-muted p-4 rounded-lg overflow-auto max-h-[400px] text-xs'>
                      {JSON.stringify(
                        logs.find((l) => l.id === showResponse)?.response_body,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex h-[300px] flex-col items-center justify-center text-center'>
                <Search className='h-12 w-12 text-muted-foreground mb-4 opacity-50' />
                <h2 className='text-xl font-semibold mb-2'>No scrape history yet</h2>
                <p className='text-muted-foreground'>
                  Start scraping to see your history here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </Main>
    </>
  )
}
