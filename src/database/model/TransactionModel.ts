import { BaseModel } from "./BaseModel";

export interface TransactionModel extends BaseModel {
  user_id: string;
  status: string;
  start_date?: Date | null;
  end_date?: Date | null;
}
