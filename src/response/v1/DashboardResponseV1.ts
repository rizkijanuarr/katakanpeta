export interface UserDashboardResponse {
    success: boolean;
    message: string;
    data: {
        subscription: {
            status: string | null;
            start_date: Date | null;
            end_date: Date | null;
            days_remaining: number | null;
        };
        total_scrapes: number;
        recent_scrapes: Array<{
            id: string;
            query: string;
            createddate: Date;
            result_count: number;
        }>;
    };
}

export interface AdminDashboardResponse {
    success: boolean;
    message: string;
    data: {
        total_users: number;
        total_transactions: number;
        pending_approvals: number;
        active_subscriptions: number;
        total_scrapes: number;
        recent_transactions: any[];
        recent_users: any[];
    };
}
