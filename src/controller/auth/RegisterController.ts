import { Request, Response } from "express";

export interface RegisterController {
  register(req: Request, res: Response): Promise<void>;
}