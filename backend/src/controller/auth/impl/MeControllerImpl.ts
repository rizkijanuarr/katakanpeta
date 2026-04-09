import { Response } from "express";
import { MeController } from "../MeController";
import { AuthRequest } from "../../../config/jwt/JwtAuthFilter";
import { dbPool } from "../../../database";
import { ResponseHelper } from "../../../response";
import { toUserDTO } from "../../../dtos/UserDTO";
import { BaseController, GetEndpoint } from '../../../annotations';
import { JwtAuthFilter } from "../../../config/jwt/JwtAuthFilter";

@BaseController('/api/v1')
export class MeControllerImpl implements MeController {

  @GetEndpoint('/me', [JwtAuthFilter])
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      // User info is attached to request by authMiddleware
      if (!req.user || !req.user.id) {
        res.status(401).json(ResponseHelper.error('Unauthorized'));
        return;
      }

      // Get user profile from database
      const { rows } = await dbPool.query(
        'SELECT * FROM users WHERE id = $1 AND "deletedDate" IS NULL LIMIT 1',
        [req.user.id]
      );

      if (rows.length === 0) {
        res.status(404).json(ResponseHelper.error('User not found'));
        return;
      }

      const user = rows[0];

      // Return user profile without password
      const userDTO = toUserDTO(user);
      const result = ResponseHelper.success('User profile retrieved successfully', userDTO);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json(ResponseHelper.error(error.message || 'Failed to retrieve user profile'));
    }
  }
}
