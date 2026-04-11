import { createFileRoute } from '@tanstack/react-router'
import { ScraperScreen } from '@/features/scraper/Screen/ScraperScreen'

export const Route = createFileRoute('/_authenticated/scraper/')({
  component: ScraperScreen,
})
