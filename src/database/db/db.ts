import { Pool } from 'pg';
import dotenv from "dotenv";
import { Logger } from "../../config";

dotenv.config();

const logger = new Logger('database');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    logger.error('DATABASE_URL is not defined in env ❌');
}

export const dbPool = new Pool({
  connectionString,
});

export const connectDB = async (): Promise<void> => {
    try {
        await dbPool.query('SELECT 1');
        logger.info('Neon PostgreSQL Client Initialized 🚀');
    } catch (error) {
        logger.error('Failed to initialize Neon PostgreSQL ❌');
        process.exit(1);
    }
};
