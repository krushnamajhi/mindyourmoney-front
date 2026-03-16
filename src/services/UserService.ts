import apiClient from '../api/axiosClient';
import type { User } from '../domain/models';

// Mock Data
const MOCK_USERS: User[] = [
    // { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com' },
    // { id: 'u2', name: 'Bob Smith', email: 'bob@example.com' },
    // { id: 'u3', name: 'Charlie Brown', email: 'charlie@example.com' },
];

export class UserService {
    private static URL = "user";
    static async getUsers(): Promise<User[]> {
        const response = await apiClient.get(`${this.URL}/list`);
        return response.data;
    }

    static async getUserById(id: string): Promise<User | undefined> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(MOCK_USERS.find(u => u.id === id)), 300);
        });
    }

    static async getCurrentUser(): Promise<User> {
        // Simulate authenticated user
        return await apiClient.get(`${this.URL}/current/me`).then(response => response.data);
    }
}
