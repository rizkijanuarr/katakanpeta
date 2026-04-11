export interface LogoutService {
    logout(userId: string): Promise<{ message: string }>;
}
