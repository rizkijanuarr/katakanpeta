import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = 'ADMIN' | 'USER';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isLoggedIn: boolean;

    // Actions
    setAuth: (token: string, user: User) => void;
    updateUser: (user: Partial<User>) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // Initial state
            token: null,
            user: null,
            isLoggedIn: false,

            // Set token dan user setelah login berhasil
            setAuth: (token: string, user: User) =>
                set({
                    token,
                    user,
                    isLoggedIn: true,
                }),

            // Update partial user info
            updateUser: (userData: Partial<User>) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...userData } : null,
                })),

            // Reset semua state saat logout
            logout: () =>
                set({
                    token: null,
                    user: null,
                    isLoggedIn: false,
                }),
        }),
        {
            name: "auth-storage", // nama key di local storage
        }
    )
);
