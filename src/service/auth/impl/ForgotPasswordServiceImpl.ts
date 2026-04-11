import bcrypt from 'bcrypt';
import { ForgotPasswordService, ForgotPasswordRequest, ForgotPasswordApiResponse } from '../ForgotPasswordService';
import { ResponseHelper } from '../../../response';
import { dbPool } from '../../../database';

export class ForgotPasswordServiceImpl implements ForgotPasswordService {

  async initiateReset(request: ForgotPasswordRequest): Promise<ForgotPasswordApiResponse> {
    const { email, newPassword } = request;

    if (!newPassword) {
      throw new Error('New password is required');
    }

    // Validate email exists in database
    const { rows } = await dbPool.query(
      'SELECT * FROM users WHERE email = $1 AND "deletedDate" IS NULL LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      throw new Error('Email not found');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await dbPool.query(
      'UPDATE users SET password = $1, "modifiedDate" = NOW() WHERE email = $2',
      [hashedPassword, email]
    );

    return ResponseHelper.success(
      'Password has been updated successfully',
      { message: 'Password reset successfully' }
    );
  }
}
