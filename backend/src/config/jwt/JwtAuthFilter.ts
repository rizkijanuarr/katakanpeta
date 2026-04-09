import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./JwtUtil";
import { MessageLib } from "../../utils";

export interface AuthRequest extends Request {
  user?: any;
}

const stringAuth = "Authorization";
const stringBearer = "Bearer ";

export const JwtAuthFilter = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header(stringAuth)?.replace(stringBearer, "");

  if (!token) {
    res.status(401).json({ message: MessageLib.JWT.NO_TOKEN_AUTHORIZATION });
    return;
  }

  try {

    console.log(MessageLib.JWT.VERIFIED_TOKEN, token);
    const decoded = verifyToken(token);
    console.log(MessageLib.JWT.DECODED_TOKEN, decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(MessageLib.JWT.ERROR_VERIFYING_TOKEN, error);
    res.status(401).json({ message: MessageLib.JWT.TOKEN_IS_NOT_VALID });
  }
};
