import { Response, NextFunction } from "express";
import { RoleEnum } from "../../utils/enums/RoleEnum";
import { AuthRequest } from "./JwtAuthFilter";
import { dbPool } from "../../database";
import { MessageLib } from "../../utils";

export const AuthorizationRoleMiddleware = (allowedRoles: RoleEnum[]) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {

      if (!req.user) {
        res.status(401).json({ message: MessageLib.MIDDLEWARE.UNAUTHORIZED_ACCESS });
        return;
      }

      const { rows } = await dbPool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [req.user.id]);
      const user = rows[0];
      
      if (!user) {
        res.status(404).json({ message: MessageLib.MIDDLEWARE.USER_NOT_FOUND });
        return;
      }

      if (!allowedRoles.includes(user.role as RoleEnum)) {
        res
          .status(403)
          .json({ message: MessageLib.MIDDLEWARE.FORBIDDEN_ACCESS });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ message: MessageLib.MIDDLEWARE.SERVER_ERROR });
      return;
    }
  };
};
