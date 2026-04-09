import { Response, NextFunction } from "express";
import { RoleEnum } from "../../utils/enums/RoleEnum";
import { AuthRequest } from "./JwtAuthFilter";
import { dbPool } from "../../database";
import { MessageLib } from "../../utils";

// Role middleware that checks user role against allowed roles
// Supports multiple allowed roles (ADMIN, USER)
export const AuthorizationRoleMiddleware = (allowedRoles: RoleEnum[]) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: MessageLib.MIDDLEWARE.UNAUTHORIZED_ACCESS
        });
        return;
      }

      // Get user from database to verify role
      const { rows } = await dbPool.query(
        'SELECT * FROM users WHERE id = $1 AND "deletedDate" IS NULL LIMIT 1',
        [req.user.id]
      );
      const user = rows[0];

      if (!user) {
        res.status(404).json({
          success: false,
          message: MessageLib.MIDDLEWARE.USER_NOT_FOUND
        });
        return;
      }

      // Check role against allowed roles
      if (!allowedRoles.includes(user.role as RoleEnum)) {
        // Return 403 for unauthorized roles
        res.status(403).json({
          success: false,
          message: MessageLib.MIDDLEWARE.FORBIDDEN_ACCESS
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: MessageLib.MIDDLEWARE.SERVER_ERROR
      });
      return;
    }
  };
};
