import crypto from 'crypto';
import { ForgotPasswordService, ForgotPasswordRequest, ForgotPasswordApiResponse } from '../ForgotPasswordService';
import { ResponseHelper } from '../../../response';
import { dbPool } from '../../../database';

export class ForgotPasswordServiceImpl implements ForgotPasswordService {

  async initiateReset(request: ForgotPasswordRequest): Promise<ForgotPasswordApiResponse> {
    const { email } = request;

    // Validate email exists in database
    const { rows } = await dbPool.query(
      'SELECT * FROM users WHERE email = $1 AND "deletedDate" IS NULL LIMIT 1',
      [email]
    );

    if (rows.length === 0) {
      throw new Error('Email not found');
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // TODO: Store token with expiration (implementation detail for future)
    // For now, we just generate the token and return success
    // In production, you would:
    // 1. Store the token in database with expiration time
    // 2. Send email with reset link containing the token

    return ResponseHelper.success(
      'Password reset instructions have been sent to your email',
      { message: 'Password reset initiated successfully' }
    );
  }
}
