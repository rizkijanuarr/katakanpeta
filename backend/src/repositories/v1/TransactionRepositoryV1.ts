import { dbPool } from "../../database";
import { Logger } from "../../config";
import { TransactionModel } from "../../database/model/TransactionModel";

export class TransactionRepositoryV1 {
    async findAll() {
        const logger = new Logger("TransactionRepositoryV1");
        try {
            logger.info("Fetching all transactions");
            const { rows } = await dbPool.query('SELECT * FROM transactions ORDER BY createddate DESC');
            return rows;
        } catch (error) {
            logger.error("Error fetching transactions: ", error);
            throw new Error("Failed to fetch transactions");
        }
    }

    async findById(id: string) {
        if (!id) return null;
        const { rows } = await dbPool.query('SELECT * FROM transactions WHERE id = $1 LIMIT 1', [id]);
        return rows[0] || null;
    }

    async findByUserId(userId: string) {
        if (!userId) return [];
        const { rows } = await dbPool.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY createddate DESC', [userId]);
        return rows;
    }

    async createTransaction(userId: string, data: Partial<TransactionModel>) {
        const { status = 'PENDING', start_date = null, end_date = null } = data;
        const query = `
          INSERT INTO transactions (user_id, status, start_date, end_date, createddate)
          VALUES ($1, $2, $3, $4, NOW()) RETURNING *`;
        const { rows } = await dbPool.query(query, [userId, status, start_date, end_date]);
        return rows[0];
    }

    async updateStatus(id: string, status: string, startDate: Date | null, endDate: Date | null) {
        if (!id) return null;
        const query = `
            UPDATE transactions
            SET status = $1, start_date = $2, end_date = $3, modifieddate = NOW()
            WHERE id = $4 RETURNING *`;
        const { rows } = await dbPool.query(query, [status, startDate, endDate, id]);
        return rows[0] || null;
    }
}
