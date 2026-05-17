import apiClient from '../api/axiosClient';
import type { User } from '../domain/models';

export class UserService {
    private static URL = "/user";

    static async getUsers(): Promise<User[]> {
        const response = await apiClient.get(`${this.URL}/list`);
        return response.data;
    }

    static async getUserById(id: number): Promise<User | undefined> {
        const response = await apiClient.get(`${this.URL}/${id}`);
        return response.data;
    }

    static async getCurrentUser(): Promise<User> {
        // Simulate authenticated user
        return await apiClient.get(`${this.URL}/current/me`).then(response => response.data);
    }

    static async searchUser(searchedValue : string): Promise<User[]> {
        // Simulate authenticated user
        const response =  await apiClient.get(`${this.URL}/search/q=${encodeURIComponent(searchedValue)}`)
        return response.data?.data;
    }
}
