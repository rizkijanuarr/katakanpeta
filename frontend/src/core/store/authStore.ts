import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    token: string | null;
    isLoggedIn: boolean;

    // Actions
    setToken: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // Initial state
            token: null,
            isLoggedIn: false,

            // Set token setelah login berhasil
            setToken: (token: string) =>
                set({
                    token,
                    isLoggedIn: true,
                }),

            // Reset semua state saat logout
            logout: () =>
                set({
                    token: null,
                    isLoggedIn: false,
                }),
        }),
        {
            name: "auth-storage", // nama key di local storage
        }
    )
);
