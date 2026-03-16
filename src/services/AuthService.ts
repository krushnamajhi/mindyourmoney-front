import apiClient from '../api/axiosClient';
import type { SignupData, AuthResponse, User } from '../domain/models';

const TOKEN_KEY = 'auth_token';

export class AuthService {
    private static URL = "/user";

    // Signup new user
    static async signup(data: SignupData): Promise<AuthResponse> {
        const response = await apiClient.post(`${this.URL}/create`, data);
        return response.data;
    }

    // Login user
    static async login(email: string, password: string): Promise<AuthResponse> {
        const response = await apiClient.post(`${this.URL}/login`, {
            email,
            password,
        });
        return response.data;
    }

    // Get current user (for token validation)
    static async getCurrentUser(): Promise<User> {
        const response = await apiClient.get(`${this.URL}/current/me`);
        return response.data;
    }

    // Logout
    static logout(): void {
        this.removeToken();
    }

    // Token management
    static getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    static setToken(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    }

    static removeToken(): void {
        localStorage.removeItem(TOKEN_KEY);
    }
}
