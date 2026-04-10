import { networkModule } from '@/core/network/NetworkModule'
import { AppRoutes } from '@/core/common/AppRoutes'

export interface ScrapeRequest {
  query: string
  num?: number
  page?: number
}

export interface ScrapePlaceResult {
  position: number
  title?: string
  address?: string
  latitude?: number
  longitude?: number
  rating?: number
  ratingCount?: number
  type?: string
  website?: string
  phoneNumber?: string
  placeId?: string
}

export interface ScrapeResponse {
  success: boolean
  message: string
  data: {
    query: string
    totalResults: number
    places: ScrapePlaceResult[]
    creditsUsed: number
  }
}

export interface ScrapeLog {
  id: string
  user_id: string
  query: string
  request_body: any
  response_body: any
  active: boolean
  createddate: string
  modifieddate: string | null
}

export const ScraperRepository = {
  scrape: async (data: ScrapeRequest): Promise<ScrapeResponse> => {
    return await networkModule.request<ScrapeResponse>(AppRoutes.SCRAPER.SCRAP, {
      method: 'POST',
      body: data,
      requiresAuth: true,
    })
  },

  getScrapeLogs: async (): Promise<ScrapeLog[]> => {
    const response = await networkModule.request<{ success: boolean; message: string; data: ScrapeLog[] }>(AppRoutes.SCRAPER.LOGS, {
      method: 'GET',
      requiresAuth: true,
    })
    return response.data
  },
}
