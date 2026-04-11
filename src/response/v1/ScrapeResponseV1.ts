export interface ScrapePlaceResult {
    position: number;
    title?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    rating?: number;
    ratingCount?: number;
    type?: string;
    types?: string[];
    website?: string;
    phoneNumber?: string;
    openingHours?: Record<string, string>;
    bookingLinks?: string[];
    thumbnailUrl?: string;
    cid?: string;
    fid?: string;
    placeId?: string;
}

export interface ScrapeResponseV1 {
    success: boolean;
    message: string;
    data: {
        query: string;
        totalResults: number;
        places: ScrapePlaceResult[];
        creditsUsed: number;
    };
}
