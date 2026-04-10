import { dbPool } from "../../database";
import { Logger } from "../../config";

export class ScrapeRepositoryV1 {
    private logger = new Logger("ScrapeRepositoryV1");

    async checkActiveSubscription(userId: string): Promise<boolean> {
        const query = `
            SELECT id FROM transactions 
            WHERE user_id = $1 
            AND status = 'ACTIVE' 
            AND end_date > NOW()
            AND deleteddate IS NULL
            LIMIT 1
        `;
        const { rows } = await dbPool.query(query, [userId]);
        return rows.length > 0;
    }

    async saveScrapeLog(data: {
        user_id: string;
        query: string;
        request_body: Record<string, any>;
        response_body: Record<string, any>;
    }) {
        const query = `
            INSERT INTO scrape_logs (user_id, query, request_body, response_body, active, createddate)
            VALUES ($1, $2, $3, $4, true, NOW()) RETURNING *
        `;
        const { rows } = await dbPool.query(query, [
            data.user_id,
            data.query,
            JSON.stringify(data.request_body),
            JSON.stringify(data.response_body)
        ]);
        return rows[0];
    }

    async getScrapeLogsByUserId(userId: string) {
        const query = `
            SELECT * FROM scrape_logs 
            WHERE user_id = $1 
            AND deleteddate IS NULL
            ORDER BY createddate DESC
        `;
        const { rows } = await dbPool.query(query, [userId]);
        return rows;
    }
}
