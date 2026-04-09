import { Request, Response } from "express";

export interface UserControllerV1 {
  createUser(req: Request, res: Response): Promise<void>;
  getAllUsers(req: Request, res: Response): Promise<void>;
  getUserById(req: Request, res: Response): Promise<void>;
  updateUser(req: Request, res: Response): Promise<void>;
  deleteUser(req: Request, res: Response): Promise<void>;
}