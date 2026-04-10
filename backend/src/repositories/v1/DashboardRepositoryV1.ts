import { dbPool } from "../../database";
import { Logger } from "../../config";

export class DashboardRepositoryV1 {
    private logger = new Logger("DashboardRepositoryV1");

    // User Dashboard Queries
    async getUserSubscription(userId: string) {
        const query = `
            SELECT * FROM transactions 
            WHERE user_id = $1 
            AND deleteddate IS NULL
            ORDER BY createddate DESC 
            LIMIT 1
        `;
        const { rows } = await dbPool.query(query, [userId]);
        return rows[0] || null;
    }

    async getUserScrapeCount(userId: string): Promise<number> {
        const query = `
            SELECT COUNT(*) FROM scrape_logs 
            WHERE user_id = $1 AND deleteddate IS NULL
        `;
        const { rows } = await dbPool.query(query, [userId]);
        return parseInt(rows[0].count);
    }

    async getUserRecentScrapes(userId: string, limit: number = 5) {
        const query = `
            SELECT id, query, createddate, 
                   jsonb_array_length(response_body->'places') as result_count
            FROM scrape_logs 
            WHERE user_id = $1 AND deleteddate IS NULL
            ORDER BY createddate DESC 
            LIMIT $2
        `;
        const { rows } = await dbPool.query(query, [userId, limit]);
        return rows;
    }

    // Admin Dashboard Queries
    async getTotalUsers(): Promise<number> {
        const query = `SELECT COUNT(*) FROM users WHERE "deletedDate" IS NULL`;
        const { rows } = await dbPool.query(query);
        return parseInt(rows[0].count);
    }

    async getTotalTransactions(): Promise<number> {
        const query = `SELECT COUNT(*) FROM transactions WHERE deleteddate IS NULL`;
        const { rows } = await dbPool.query(query);
        return parseInt(rows[0].count);
    }

    async getPendingTransactionsCount(): Promise<number> {
        const query = `SELECT COUNT(*) FROM transactions WHERE status = 'PENDING' AND deleteddate IS NULL`;
        const { rows } = await dbPool.query(query);
        return parseInt(rows[0].count);
    }

    async getActiveSubscriptionsCount(): Promise<number> {
        const query = `SELECT COUNT(*) FROM transactions WHERE status = 'ACTIVE' AND deleteddate IS NULL`;
        const { rows } = await dbPool.query(query);
        return parseInt(rows[0].count);
    }

    async getTotalScrapeLogs(): Promise<number> {
        const query = `SELECT COUNT(*) FROM scrape_logs WHERE deleteddate IS NULL`;
        const { rows } = await dbPool.query(query);
        return parseInt(rows[0].count);
    }

    async getRecentTransactions(limit: number = 10) {
        const query = `
            SELECT t.*, u.name as user_name, u.email as user_email
            FROM transactions t
            LEFT JOIN users u ON t.user_id = u.id
            WHERE t.deleteddate IS NULL
            ORDER BY t.createddate DESC
            LIMIT $1
        `;
        const { rows } = await dbPool.query(query, [limit]);
        return rows;
    }

    async getRecentUsers(limit: number = 10) {
        const query = `
            SELECT id, name, email, role, "createdDate", active
            FROM users 
            WHERE "deletedDate" IS NULL
            ORDER BY "createdDate" DESC
            LIMIT $1
        `;
        const { rows } = await dbPool.query(query, [limit]);
        return rows;
    }

    async getScrapeLogsByDateRange(startDate: string, endDate: string) {
        const query = `
            SELECT DATE(createddate) as date, COUNT(*) as count
            FROM scrape_logs
            WHERE createddate >= $1 AND createddate <= $2 AND deleteddate IS NULL
            GROUP BY DATE(createddate)
            ORDER BY date DESC
        `;
        const { rows } = await dbPool.query(query, [startDate, endDate]);
        return rows;
    }
}
