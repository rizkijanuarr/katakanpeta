import { Request, Response } from "express";

export interface ForgotPasswordController {
  forgotPassword(req: Request, res: Response): Promise<void>;
}
