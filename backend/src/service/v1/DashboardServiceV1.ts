import { UserDashboardResponse, AdminDashboardResponse } from "../../response/v1/DashboardResponseV1";

export interface DashboardServiceV1 {
    getUserDashboard(userId: string): Promise<UserDashboardResponse>;
    getAdminDashboard(): Promise<AdminDashboardResponse>;
}
