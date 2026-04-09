import { create } from 'zustand';

interface User {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
}

interface UserState {
    user: User | null;

    // Actions
    setUser: (user: User) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>(set => ({
    // Initial state
    user: null,

    // Set data user setelah fetch profile berhasil
    setUser: (user: User) => set({ user }),

    // Reset saat logout
    clearUser: () => set({ user: null }),
}));
