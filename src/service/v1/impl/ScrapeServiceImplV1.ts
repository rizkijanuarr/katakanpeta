import { ScrapeServiceV1 } from "../ScrapeServiceV1";
import { ScrapeRepositoryV1 } from "../../../repositories/v1/ScrapeRepositoryV1";
import { ScrapeRequestV1 } from "../../../request/v1/ScrapeRequestV1";
import { ScrapeResponseV1 } from "../../../response/v1/ScrapeResponseV1";
import { Logger } from "../../../config";

export class ScrapeServiceImplV1 implements ScrapeServiceV1 {
    private scrapeRepo: ScrapeRepositoryV1;
    private logger: Logger;
    private serperApiKey: string;

    constructor() {
        this.scrapeRepo = new ScrapeRepositoryV1();
        this.logger = new Logger("ScrapeServiceImplV1");
        this.serperApiKey = process.env.SERPER_API_KEY || "";
    }

    async scrapeGoogleMaps(userId: string, request: ScrapeRequestV1): Promise<ScrapeResponseV1> {
        // 1. Check active subscription
        const hasActiveSubscription = await this.scrapeRepo.checkActiveSubscription(userId);
        if (!hasActiveSubscription) {
            this.logger.error(`User ${userId} has no active subscription`);
            throw new Error("Active subscription required to use scraper");
        }

        // 2. Prepare request to Serper API
        const { query, num = 10, page = 1 } = request;
        const serperUrl = "https://google.serper.dev/maps";
        
        const requestBody = {
            q: query,
            num,
            page
        };

        // 3. Call Serper API
        const response = await fetch(serperUrl, {
            method: "POST",
            headers: {
                "X-API-KEY": this.serperApiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            this.logger.error(`Serper API error: ${errorText}`);
            throw new Error(`Failed to scrape data from Google Maps`);
        }

        const serperResult = await response.json();
        this.logger.info(`Successfully scraped query: "${query}" - ${serperResult.places?.length || 0} results`);

        // 4. Save to scrape_logs
        await this.scrapeRepo.saveScrapeLog({
            user_id: userId,
            query,
            request_body: requestBody,
            response_body: serperResult
        });

        // 5. Return formatted response
        return {
            success: true,
            message: "Scraping completed successfully",
            data: {
                query,
                totalResults: serperResult.places?.length || 0,
                places: serperResult.places || [],
                creditsUsed: serperResult.credits || 0
            }
        };
    }

    async getUserScrapeLogs(userId: string): Promise<any[]> {
        return await this.scrapeRepo.getScrapeLogsByUserId(userId);
    }
}
