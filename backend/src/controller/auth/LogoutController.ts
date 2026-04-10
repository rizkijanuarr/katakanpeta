import { Request, Response } from "express";

export interface LogoutController {
    logout(req: Request, res: Response): Promise<void>;
}
