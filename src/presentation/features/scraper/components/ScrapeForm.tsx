import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrapeRequest } from '../Repository/ScraperRepository'
import { Loader2, Search } from 'lucide-react'

const scrapeFormSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  num: z.coerce.number().min(1).max(100).default(10),
  page: z.coerce.number().min(1).default(1),
})

type ScrapeFormValues = z.infer<typeof scrapeFormSchema>

interface ScrapeFormProps {
  onSubmit: (data: ScrapeRequest) => Promise<void>
  isLoading: boolean
}

export function ScrapeForm({ onSubmit, isLoading }: ScrapeFormProps) {
  const form = useForm<ScrapeFormValues>({
    resolver: zodResolver(scrapeFormSchema),
    defaultValues: {
      query: '',
      num: 10,
      page: 1,
    },
  })

  const handleSubmit = async (data: ScrapeFormValues) => {
    await onSubmit(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Search className='h-5 w-5' />
          Search Google Maps
        </CardTitle>
        <CardDescription>
          Enter your search query to find businesses on Google Maps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
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
  )
}
