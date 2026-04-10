import { TransactionServiceV1 } from "../TransactionServiceV1";
import { TransactionRepositoryV1 } from "../../../repositories/v1/TransactionRepositoryV1";
import { TransactionResponseV1 } from "../../../response/v1/TransactionResponseV1";

export class TransactionServiceImplV1 implements TransactionServiceV1 {
    private transactionRepo: TransactionRepositoryV1;

    constructor() {
        this.transactionRepo = new TransactionRepositoryV1();
    }

    async findAll(): Promise<TransactionResponseV1[]> {
        return await this.transactionRepo.findAll();
    }

    async findById(id: string): Promise<TransactionResponseV1 | null> {
        return await this.transactionRepo.findById(id);
    }

    async findByUserId(userId: string): Promise<TransactionResponseV1[]> {
        return await this.transactionRepo.findByUserId(userId);
    }

    async subscribe(userId: string): Promise<TransactionResponseV1> {
        // Default PENDING state. Start and end dates are null until approved.
        return await this.transactionRepo.createTransaction(userId, { status: 'PENDING' });
    }

    async approve(id: string): Promise<TransactionResponseV1 | null> {
        const transaction = await this.transactionRepo.findById(id);
        if (!transaction) return null;

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); // For subscription add 1 month

        return await this.transactionRepo.updateStatus(id, 'ACTIVE', startDate, endDate);
    }

    async reject(id: string): Promise<TransactionResponseV1 | null> {
        const transaction = await this.transactionRepo.findById(id);
        if (!transaction) return null;

        return await this.transactionRepo.updateStatus(id, 'REJECTED', null, null);
    }
}
