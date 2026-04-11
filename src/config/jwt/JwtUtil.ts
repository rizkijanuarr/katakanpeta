import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { MessageLib } from "../../utils";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "24h";

export const generateToken = (userId: string, email: string, role: string): string => {
  // Include id, email, and role in JWT payload
  return jwt.sign(
    { id: userId, email, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION as any }
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error(MessageLib.JWT.INVALID_TOKEN);
  }
};
