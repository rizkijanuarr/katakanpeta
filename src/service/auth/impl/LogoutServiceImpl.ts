import { LogoutService } from "../LogoutService";

export class LogoutServiceImpl implements LogoutService {
    async logout(userId: string): Promise<{ message: string }> {
        // Logout di JWT-based system adalah client-side action (hapus token)
        // Endpoint ini untuk logging dan invalidation jika perlu di masa depan
        return { message: 'User logged out successfully' };
    }
}
