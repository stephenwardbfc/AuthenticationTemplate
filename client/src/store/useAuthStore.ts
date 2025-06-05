import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    register: (userData: { username: string; email: string; password: string }) => Promise<void>;
    getProfile: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: false,
    error: null,

    login: async (credentials) => {
        console.log('Logging in with credentials:', credentials);
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post('/auth/login', credentials);
            set({ user: response.data.user, loading: false });
            return response.data.user; // Optional: return user
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            set({ loading: false, error: errorMessage });
            throw new Error(errorMessage); // ✅ This is what makes your form react to failure
        }
    },
    
    logout: async () => {
        set({ loading: true, error: null });
        try {
            await axiosInstance.post('/auth/logout');
            set({ user: null, loading: false });
        } catch (error: any) {
            set({ loading: false, error: error.response?.data?.message || 'Logout failed' });
        }
    },

    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post('/auth/register', userData);
            set({ user: response.data.user, loading: false });
        } catch (error: any) {
            set({ loading: false, error: error.response?.data?.message || 'Registration failed' });
        }
    },

    getProfile: async () => {
        set({ loading: true, error: null });
        try {
            console.log('Fetching profile...');
            const response = await axiosInstance.get('/auth/profile');
            set({ user: response.data.user, loading: false });
        } catch (error: any) {
            const status = error.response?.status;

            if (status === 401) {
                // User is not authenticated — don't show an error, just clear user
                set({ user: null, loading: false });
            } else {
                set({
                    loading: false,
                    error: error.response?.data?.message || 'Failed to fetch profile',
                });
            }
        }
    },
}))

export default useAuthStore;
