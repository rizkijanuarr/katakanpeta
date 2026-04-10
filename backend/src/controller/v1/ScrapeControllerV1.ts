import { Request, Response } from "express";
import { ScrapeRequestV1 } from "../../request/v1/ScrapeRequestV1";

export interface ScrapeControllerV1 {
    scrapeGoogleMaps(req: Request, res: Response): Promise<void>;
    getMyScrapeLogs(req: Request, res: Response): Promise<void>;
}
