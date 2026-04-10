import { TransactionRequestV1, ReviewTransactionRequestV1 } from "../../request/v1/TransactionRequestV1";
import { TransactionResponseV1 } from "../../response/v1/TransactionResponseV1";

export interface TransactionServiceV1 {
    findAll(): Promise<TransactionResponseV1[]>;
    findById(id: string): Promise<TransactionResponseV1 | null>;
    findByUserId(userId: string): Promise<TransactionResponseV1[]>;
    subscribe(userId: string): Promise<TransactionResponseV1>;
    approve(id: string): Promise<TransactionResponseV1 | null>;
    reject(id: string): Promise<TransactionResponseV1 | null>;
}
