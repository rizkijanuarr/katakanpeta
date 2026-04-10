import { TransactionModel } from "../../database/model/TransactionModel";

export interface TransactionResponseV1 extends TransactionModel {
    id: string;
    createdDate: Date;
    modifiedDate: Date | null;
}
