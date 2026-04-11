import bcrypt from 'bcrypt';
import { LoginService } from '../..';
import { LoginRequest } from '../../../request';
import { LoginApiResponse, ResponseHelper } from '../../../response';
import { dbPool } from '../../../database';
import { generateToken } from '../../../config';
import { MessageLib } from '../../../utils';
import { toLoginDTO } from '../../../dtos/LoginDTO';

export class LoginServiceImpl implements LoginService {

    async login(request: LoginRequest): Promise<LoginApiResponse> {
      const { email, password } = request;

      // Find user by email (exclude soft-deleted users)
      const { rows } = await dbPool.query(
        'SELECT * FROM users WHERE email = $1 AND "deletedDate" IS NULL LIMIT 1',
        [email]
      );
      const user = rows[0];

      if (!user) {
        throw new Error(MessageLib.AUTH.INVALID_CREDENTIALS);
      }

      // Check user active status before login
      if (!user.active) {
        throw new Error('Account is inactive. Please contact support.');
      }

      // Verify password with bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error(MessageLib.AUTH.INVALID_CREDENTIALS);
      }

      // Generate JWT token with payload: {id, email, role}
      const token = generateToken(user.id, user.email, user.role);

      return ResponseHelper.success(
        MessageLib.AUTH.USER_LOGIN_SUCCESSFULLY,
        toLoginDTO(user, token)
      );
    }
  }
