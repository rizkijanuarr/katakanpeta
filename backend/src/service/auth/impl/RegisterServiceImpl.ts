import bcrypt from 'bcrypt';
import { RegisterService } from '../..';
import { RegisterRequest } from '../../../request';
import { RegisterApiResponse, ResponseHelper } from '../../../response';
import { dbPool } from '../../../database';
import { MessageLib, RoleEnum } from '../../../utils';
import { toUserDTO } from '../../../dtos/UserDTO';

export class RegisterServiceImpl implements RegisterService {

  async register(request: RegisterRequest): Promise<RegisterApiResponse> {
    const { name, email, password, role } = request;

    const { rows: existingUsers } = await dbPool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
    if (existingUsers.length > 0) {
      throw new Error(MessageLib.AUTH.USER_ALREADY_EXISTS);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const r = role || RoleEnum.USER;
    const createdBy = "SYSTEM";

    try {
      const query = `
          INSERT INTO users (name, email, password, role, "createdBy", "createdDate") 
          VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`;
      const { rows } = await dbPool.query(query, [name, email, hashedPassword, r, createdBy]);

      return ResponseHelper.success(
        MessageLib.AUTH.USER_REGISTERED_SUCCESSFULLY,
        toUserDTO(rows[0])
      );
    } catch (error: any) {
      throw new Error(MessageLib.UTIL.FAILED + " " + error.message);
    }
  }
}
