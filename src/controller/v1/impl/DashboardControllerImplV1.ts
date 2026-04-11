import { Request, Response } from "express";
import { DashboardControllerV1 } from "../DashboardControllerV1";
import { DashboardServiceImplV1 } from "../../../service/v1/impl/DashboardServiceImplV1";
import { RoleEnum } from "../../../utils";
import { Logger } from "../../../config/logging/Logging";
import { AuthorizationRoleMiddleware, JwtAuthFilter } from "../../../config";
import { BaseController, GetEndpoint } from "../../../annotations";

@BaseController('/api/v1')
export class DashboardControllerImplV1 implements DashboardControllerV1 {
    constructor(
        private dashboardService: DashboardServiceImplV1,
        private logger: Logger
    ) {}

    @GetEndpoint('/dashboard', [JwtAuthFilter, AuthorizationRoleMiddleware([RoleEnum.USER, RoleEnum.ADMIN])])
    async getUserDashboard(req: Request, res: Response): Promise<void> {
        try {
            // @ts-ignore
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }

            const response = await this.dashboardService.getUserDashboard(userId);
            this.logger.info(`User dashboard accessed by ${userId}`);
            res.status(200).json(response);
        } catch (error: any) {
            this.logger.error(error.message);
            res.status(500).json({ message: error.message });
        }
    }

    @GetEndpoint('/admin/dashboard', [JwtAuthFilter, AuthorizationRoleMiddleware([RoleEnum.ADMIN])])
    async getAdminDashboard(req: Request, res: Response): Promise<void> {
        try {
            const response = await this.dashboardService.getAdminDashboard();
            this.logger.info("Admin dashboard accessed");
            res.status(200).json(response);
        } catch (error: any) {
            this.logger.error(error.message);
            res.status(500).json({ message: error.message });
        }
    }
}
