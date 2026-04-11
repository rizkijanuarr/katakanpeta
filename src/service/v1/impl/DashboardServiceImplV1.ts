import { DashboardServiceV1 } from "../DashboardServiceV1";
import { DashboardRepositoryV1 } from "../../../repositories/v1/DashboardRepositoryV1";
import { UserDashboardResponse, AdminDashboardResponse } from "../../../response/v1/DashboardResponseV1";
import { Logger } from "../../../config";

export class DashboardServiceImplV1 implements DashboardServiceV1 {
    private dashboardRepo: DashboardRepositoryV1;
    private logger: Logger;

    constructor() {
        this.dashboardRepo = new DashboardRepositoryV1();
        this.logger = new Logger("DashboardServiceImplV1");
    }

    async getUserDashboard(userId: string): Promise<UserDashboardResponse> {
        // 1. Get user's latest subscription
        const subscription = await this.dashboardRepo.getUserSubscription(userId);
        
        // 2. Calculate days remaining
        let daysRemaining: number | null = null;
        if (subscription && subscription.status === 'ACTIVE' && subscription.end_date) {
            const now = new Date();
            const endDate = new Date(subscription.end_date);
            const diffTime = endDate.getTime() - now.getTime();
            daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        }

        // 3. Get total scrapes
        const totalScrapes = await this.dashboardRepo.getUserScrapeCount(userId);

        // 4. Get recent scrapes
        const recentScrapes = await this.dashboardRepo.getUserRecentScrapes(userId, 5);

        this.logger.info(`Dashboard fetched for user ${userId}`);

        return {
            success: true,
            message: "User dashboard data retrieved successfully",
            data: {
                subscription: {
                    status: subscription?.status || null,
                    start_date: subscription?.start_date || null,
                    end_date: subscription?.end_date || null,
                    days_remaining: daysRemaining
                },
                total_scrapes: totalScrapes,
                recent_scrapes: recentScrapes
            }
        };
    }

    async getAdminDashboard(): Promise<AdminDashboardResponse> {
        // 1. Get all stats in parallel
        const [
            totalUsers,
            totalTransactions,
            pendingApprovals,
            activeSubscriptions,
            totalScrapes,
            recentTransactions,
            recentUsers
        ] = await Promise.all([
            this.dashboardRepo.getTotalUsers(),
            this.dashboardRepo.getTotalTransactions(),
            this.dashboardRepo.getPendingTransactionsCount(),
            this.dashboardRepo.getActiveSubscriptionsCount(),
            this.dashboardRepo.getTotalScrapeLogs(),
            this.dashboardRepo.getRecentTransactions(10),
            this.dashboardRepo.getRecentUsers(10)
        ]);

        this.logger.info("Admin dashboard fetched");

        return {
            success: true,
            message: "Admin dashboard data retrieved successfully",
            data: {
                total_users: totalUsers,
                total_transactions: totalTransactions,
                pending_approvals: pendingApprovals,
                active_subscriptions: activeSubscriptions,
                total_scrapes: totalScrapes,
                recent_transactions: recentTransactions,
                recent_users: recentUsers
            }
        };
    }
}
