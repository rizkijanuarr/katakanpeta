import { ScrapeRequestV1 } from "../../request/v1/ScrapeRequestV1";
import { ScrapeResponseV1 } from "../../response/v1/ScrapeResponseV1";

export interface ScrapeServiceV1 {
    scrapeGoogleMaps(userId: string, request: ScrapeRequestV1): Promise<ScrapeResponseV1>;
    getUserScrapeLogs(userId: string): Promise<any[]>;
}
