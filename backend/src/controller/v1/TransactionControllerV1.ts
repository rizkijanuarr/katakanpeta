import { Request, Response } from "express";

export interface TransactionControllerV1 {
  getAllTransactions(req: Request, res: Response): Promise<void>;
  approveTransaction(req: Request, res: Response): Promise<void>;
  rejectTransaction(req: Request, res: Response): Promise<void>;
  subscribe(req: Request, res: Response): Promise<void>;
  getMyTransactions(req: Request, res: Response): Promise<void>;
}
