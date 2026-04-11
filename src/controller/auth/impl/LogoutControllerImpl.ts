import { Request, Response } from "express";
import { LogoutController } from "../LogoutController";
import { LogoutServiceImpl } from "../../../service/auth/impl/LogoutServiceImpl";
import { Logger } from "../../../config/logging/Logging";
import { BaseController, PostEndpoint } from "../../../annotations";
import { JwtAuthFilter } from "../../../config";

@BaseController('/api/v1/auth')
export class LogoutControllerImpl implements LogoutController {
    private logger: Logger;
    private logoutService: LogoutServiceImpl;

    constructor(logoutService: LogoutServiceImpl, logger: Logger) {
        this.logoutService = logoutService;
        this.logger = logger;
    }

    @PostEndpoint('/logout', [JwtAuthFilter])
    async logout(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }

            const response = await this.logoutService.logout(userId);
            this.logger.info(`User ${userId} logged out`);
            res.status(200).json({
                success: true,
                message: response.message
            });
        } catch (error: any) {
            this.logger.error(error.message);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
