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

      const { rows } = await dbPool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
      const user = rows[0];
      
      if (!user) {
        throw new Error(MessageLib.AUTH.INVALID_CREDENTIALS);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error(MessageLib.AUTH.INVALID_CREDENTIALS);
      }

      const token = generateToken(user.id);
      return ResponseHelper.success(
        MessageLib.AUTH.USER_LOGIN_SUCCESSFULLY,
        toLoginDTO(user, token)
      );
    }
  }
