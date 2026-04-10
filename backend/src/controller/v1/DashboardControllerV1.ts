import { Request, Response } from "express";

export interface DashboardControllerV1 {
    getUserDashboard(req: Request, res: Response): Promise<void>;
    getAdminDashboard(req: Request, res: Response): Promise<void>;
}
