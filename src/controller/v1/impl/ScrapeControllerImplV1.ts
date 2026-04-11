import { Request, Response } from "express";
import { ScrapeControllerV1 } from "../ScrapeControllerV1";
import { ScrapeServiceImplV1 } from "../../../service/v1/impl/ScrapeServiceImplV1";
import { RoleEnum } from "../../../utils";
import { Logger } from "../../../config/logging/Logging";
import { AuthorizationRoleMiddleware, JwtAuthFilter } from "../../../config";
import { BaseController, GetEndpoint, PostEndpoint } from "../../../annotations";
import { ScrapeRequestV1 } from "../../../request/v1/ScrapeRequestV1";

@BaseController('/api/v1/scrape')
export class ScrapeControllerImplV1 implements ScrapeControllerV1 {
    constructor(
        private scrapeService: ScrapeServiceImplV1,
        private logger: Logger
    ) {}

    @PostEndpoint('/', [JwtAuthFilter, AuthorizationRoleMiddleware([RoleEnum.USER, RoleEnum.ADMIN])])
    async scrapeGoogleMaps(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const { query, num, page } = req.body as ScrapeRequestV1;
            if (!query) {
                res.status(400).json({ message: 'Query parameter is required' });
                return;
            }

            const scrapeRequest: ScrapeRequestV1 = { query, num, page };
            const response = await this.scrapeService.scrapeGoogleMaps(userId, scrapeRequest);
            
            this.logger.info(`User ${userId} scraped: "${query}"`);
            res.status(200).json(response);
        } catch (error: any) {
            this.logger.error(error.message);
            if (error.message.includes("subscription")) {
                res.status(403).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message });
            }
        }
    }

    @GetEndpoint('/logs', [JwtAuthFilter, AuthorizationRoleMiddleware([RoleEnum.USER, RoleEnum.ADMIN])])
    async getMyScrapeLogs(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const response = await this.scrapeService.getUserScrapeLogs(userId);
            this.logger.info(`Fetched scrape logs for user ${userId}`);
            res.status(200).json({
                success: true,
                message: "Scrape logs retrieved successfully",
                data: response
            });
        } catch (error: any) {
            this.logger.error(error.message);
            res.status(500).json({ message: error.message });
        }
    }
}
