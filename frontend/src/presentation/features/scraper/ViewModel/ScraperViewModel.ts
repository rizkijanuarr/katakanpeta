import { useState } from 'react'
import { ScraperRepository, ScrapeRequest, ScrapeResponse, ScrapeLog } from '../Repository/ScraperRepository'
import { toast } from 'sonner'

export function useScraperViewModel() {
  const [isLoading, setIsLoading] = useState(false)
  const [logsLoading, setLogsLoading] = useState(false)
  const [scrapeResult, setScrapeResult] = useState<ScrapeResponse['data'] | null>(null)
  const [logs, setLogs] = useState<ScrapeLog[]>([])

  const handleScrape = async (data: ScrapeRequest) => {
    setIsLoading(true)
    try {
      const response = await ScraperRepository.scrape(data)
      setScrapeResult(response.data)
      toast.success('Scraping completed', {
        description: `Found ${response.data.totalResults} results for "${data.query}"`,
      })
      // Refresh logs after scrape
      await fetchLogs()
    } catch (error: any) {
      toast.error('Scraping failed', {
        description: error?.message || 'Could not scrape data',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLogs = async () => {
    setLogsLoading(true)
    try {
      const data = await ScraperRepository.getScrapeLogs()
      setLogs(data)
    } catch (error: any) {
      toast.error('Failed to load scrape logs', {
        description: error?.message || 'Could not fetch logs',
      })
    } finally {
      setLogsLoading(false)
    }
  }

  return {
    isLoading,
    logsLoading,
    scrapeResult,
    logs,
    handleScrape,
    fetchLogs,
    setScrapeResult,
  }
}
