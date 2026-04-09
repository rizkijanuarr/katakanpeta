import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { RegisterService } from '../..';
import { RegisterRequest } from '../../../request';
import { RegisterApiResponse, ResponseHelper } from '../../../response';
import { dbPool } from '../../../database';
import { MessageLib, RoleEnum } from '../../../utils';
import { toUserDTO } from '../../../dtos/UserDTO';

export class RegisterServiceImpl implements RegisterService {

  async register(request: RegisterRequest): Promise<RegisterApiResponse> {
    const { name, email, password, role } = request;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Check for duplicate email
    const { rows: existingUsers } = await dbPool.query(
      'SELECT * FROM users WHERE email = $1 AND "deletedDate" IS NULL LIMIT 1',
      [email]
    );
    if (existingUsers.length > 0) {
      throw new Error(MessageLib.AUTH.USER_ALREADY_EXISTS);
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate UUID for user ID
    const userId = uuidv4();

    // Set role='USER' by default, active=true
    const userRole = role || RoleEnum.USER;
    const createdBy = "SYSTEM";

    try {
      const query = `
          INSERT INTO users (id, name, email, password, role, active, "createdBy", "createdDate")
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`;
      const { rows } = await dbPool.query(query, [
        userId,
        name,
        email,
        hashedPassword,
        userRole,
        true, // active=true by default
        createdBy
      ]);

      return ResponseHelper.success(
        MessageLib.AUTH.USER_REGISTERED_SUCCESSFULLY,
        toUserDTO(rows[0])
      );
    } catch (error: any) {
      throw new Error(MessageLib.UTIL.FAILED + " " + error.message);
    }
  }
}
