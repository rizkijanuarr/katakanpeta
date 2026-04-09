import { Response } from "express";
import { AuthRequest } from "../../config/jwt/JwtAuthFilter";

export interface MeController {
  getProfile(req: AuthRequest, res: Response): Promise<void>;
}
