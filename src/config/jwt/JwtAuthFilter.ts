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
  // Extract token from Authorization header (Bearer scheme)
  const token = req.header(stringAuth)?.replace(stringBearer, "");

  // Return 401 for missing token
  if (!token) {
    res.status(401).json({
      success: false,
      message: MessageLib.JWT.NO_TOKEN_AUTHORIZATION
    });
    return;
  }

  try {
    // Verify token validation and expiration checking
    console.log(MessageLib.JWT.VERIFIED_TOKEN, token);
    const decoded = verifyToken(token);
    console.log(MessageLib.JWT.DECODED_TOKEN, decoded);

    // Attach user info to request object
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error(MessageLib.JWT.ERROR_VERIFYING_TOKEN, error);

    // Return 401 for invalid/expired tokens
    const message = error.message === MessageLib.JWT.INVALID_TOKEN
      ? MessageLib.JWT.TOKEN_IS_NOT_VALID
      : error.message;

    res.status(401).json({
      success: false,
      message
    });
  }
};
