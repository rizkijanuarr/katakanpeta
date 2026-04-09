import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { MessageLib } from "../../utils";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN: number | undefined = process.env.JWT_EXPIRES_IN
  ? parseInt(process.env.JWT_EXPIRES_IN)
  : undefined;

export const generateToken = (userId: string): string => {
  const options: jwt.SignOptions = {
    expiresIn: "1h",
  };

  return jwt.sign({ id: userId }, JWT_SECRET, options);
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error(MessageLib.JWT.INVALID_TOKEN);
  }
};
